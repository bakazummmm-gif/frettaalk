"use client";

import { useSyncExternalStore } from "react";
import { ensureGuestUser } from "./guestUser";
import type { DbUser } from "./types";

type State = {
  user: DbUser | null;
  isLoading: boolean;
  error: string | null;
};

let state: State = { user: null, isLoading: true, error: null };
const listeners = new Set<() => void>();
let initPromise: Promise<void> | null = null;

function setState(next: State) {
  state = next;
  listeners.forEach((listener) => listener());
}

function init() {
  if (initPromise) return initPromise;

  initPromise = ensureGuestUser()
    .then((user) => {
      setState({ user, isLoading: false, error: null });
    })
    .catch((err: Error) => {
      setState({ user: null, isLoading: false, error: err.message });
    });

  return initPromise;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  init();
  return () => listeners.delete(listener);
}

function getSnapshot(): State {
  return state;
}

function getServerSnapshot(): State {
  return { user: null, isLoading: true, error: null };
}

export function useCurrentUser() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
