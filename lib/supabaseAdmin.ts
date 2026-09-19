import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    "SUPABASE_SERVICE_ROLE_KEYが設定されていません。.env.local.exampleを参考に.env.localへ追加してください。"
  );
}

// RLSを無視する管理者権限クライアント。Route Handler / Webhook 以外からimportしないこと。
// (ブラウザに渡すと全ユーザーのデータが読み書きできてしまうため、"use client"のファイルでは絶対に使わない)
export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  serviceRoleKey || "placeholder-service-role-key",
  { auth: { persistSession: false } }
);
