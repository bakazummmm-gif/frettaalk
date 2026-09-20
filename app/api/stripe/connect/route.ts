import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// ログイン中のアドバイザーがStripe Connect(Express)に登録・口座連携するためのリンクを発行する。
export async function POST(request: NextRequest) {
  const accessToken = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  console.log(
    "[/api/stripe/connect] accessToken先頭20文字:",
    accessToken.slice(0, 20),
    "長さ:",
    accessToken.length
  );

  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
  if (authError || !authData.user) {
    console.error("[/api/stripe/connect] 認証に失敗:", authError);
    return NextResponse.json(
      { error: `認証に失敗しました: ${authError?.message ?? "ユーザーが取得できません"}` },
      { status: 401 }
    );
  }

  const userId = authData.user.id;

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("users")
    .select("id, is_advisor, stripe_account_id")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || !profile) {
    return NextResponse.json({ error: "ユーザー情報の取得に失敗しました" }, { status: 400 });
  }

  if (!profile.is_advisor) {
    return NextResponse.json(
      { error: "アドバイザー承認済みのユーザーのみ利用できます" },
      { status: 403 }
    );
  }

  let accountId: string | null = profile.stripe_account_id;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "JP",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    accountId = account.id;

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ stripe_account_id: accountId })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}/mypage`,
    return_url: `${origin}/mypage`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}
