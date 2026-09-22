"use client";

import { useSyncExternalStore } from "react";
import { supabase } from "./supabase";
import type { DbUser } from "./types";

type State = {
  user: DbUser | null;
  isLoading: boolean;
  error: string | null;
};

const INITIAL_STATE: State = { user: null, isLoading: true, error: null };

let state: State = INITIAL_STATE;
const listeners = new Set<() => void>();
let started = false;

function setState(next: State) {
  state = next;
  listeners.forEach((listener) => listener());
}

async function loadProfile(authUserId: string) {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, name, avatar_url, points, is_advisor, advisor_status, stripe_payouts_enabled, created_at"
    )
    .eq("id", authUserId)
    .maybeSingle();

  if (error) {
    console.error("[userStore] プロフィール取得に失敗しました:", error);
    setState({ user: null, isLoading: false, error: error.message });
    return;
  }

  if (!data) {
    console.error(
      "[userStore] auth.usersにはユーザーがいますが、public.usersに対応する行がありません:",
      authUserId
    );
    setState({
      user: null,
      isLoading: false,
      error: "プロフィールが見つかりません。運営に連絡してください。",
    });
    return;
  }

  setState({ user: data, isLoading: false, error: null });
}

function start() {
  if (started) return;
  started = true;

  supabase.auth.getSession().then(({ data }) => {
    const authUser = data.session?.user;
    if (authUser) {
      loadProfile(authUser.id);
    } else {
      setState({ user: null, isLoading: false, error: null });
    }
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      loadProfile(session.user.id);
    } else {
      setState({ user: null, isLoading: false, error: null });
    }
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  start();
  return () => listeners.delete(listener);
}

function getSnapshot(): State {
  return state;
}

function getServerSnapshot(): State {
  return INITIAL_STATE;
}

export function useCurrentUser() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// プロフィール画像などを更新した直後に、画面表示を最新化するために呼ぶ
export async function refreshCurrentUser() {
  const { data } = await supabase.auth.getSession();
  const authUser = data.session?.user;
  if (authUser) {
    await loadProfile(authUser.id);
  }
}
