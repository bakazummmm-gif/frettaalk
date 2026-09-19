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
    .select("id, name, avatar_url, points, is_advisor, advisor_status, created_at")
    .eq("id", authUserId)
    .maybeSingle();

  if (error) {
    setState({ user: null, isLoading: false, error: error.message });
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
