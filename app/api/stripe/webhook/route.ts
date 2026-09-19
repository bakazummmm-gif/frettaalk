import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// StripeダッシュボードのWebhook設定で、このURLに events を送るよう登録する。
// 現時点では Connect アカウントの本人確認完了(account.updated)のみ処理する。
// チケット/投げ銭の決済確定(checkout.session.completed)は、決済フロー実装時に追加する。
export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook設定が不足しています" }, { status: 500 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "signature verification failed";
    return NextResponse.json(
      { error: `Webhook署名の検証に失敗しました: ${message}` },
      { status: 400 }
    );
  }

  // 同じイベントの二重処理を防ぐ(Stripeは同じイベントを複数回送ってくることがある)
  const { error: logError } = await supabaseAdmin.from("payment_events").insert({
    stripe_event_id: event.id,
    type: event.type,
    payload: event as unknown as Record<string, unknown>,
  });

  if (logError) {
    if (logError.code === "23505") {
      return NextResponse.json({ received: true, duplicate: true });
    }
    return NextResponse.json({ error: logError.message }, { status: 500 });
  }

  if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account;
    const payoutsEnabled = Boolean(account.charges_enabled && account.payouts_enabled);

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ stripe_payouts_enabled: payoutsEnabled })
      .eq("stripe_account_id", account.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
