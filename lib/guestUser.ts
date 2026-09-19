import { supabase } from "./supabase";
import type { DbUser } from "./types";

const STORAGE_KEY = "frettalk:guestUserId";

function readStoredId(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeId(id: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // localStorageが使えない環境では保存をあきらめる
  }
}

// Supabase Authを導入するまでの仮運用として、端末ごとにゲストユーザーを1件発行する。
export async function ensureGuestUser(): Promise<DbUser> {
  const storedId = readStoredId();

  if (storedId) {
    const { data } = await supabase
      .from("users")
      .select("id, name, avatar_url, points, created_at")
      .eq("id", storedId)
      .maybeSingle();

    if (data) {
      return data;
    }
  }

  const { data, error } = await supabase
    .from("users")
    .insert({ name: "あなた" })
    .select("id, name, avatar_url, points, created_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "ユーザーの作成に失敗しました");
  }

  storeId(data.id);
  return data;
}
