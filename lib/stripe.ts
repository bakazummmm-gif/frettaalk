import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn(
    "STRIPE_SECRET_KEYが設定されていません。.env.local.exampleを参考に.env.localへ追加してください。"
  );
}

// サーバー専用クライアント。Route Handler / Server Action 以外からimportしないこと。
export const stripe = new Stripe(stripeSecretKey || "sk_test_placeholder");
