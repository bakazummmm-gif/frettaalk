"use client";

import { useCallback, useSyncExternalStore } from "react";
import { createDummyLogs } from "./dummyData";
import type { PracticeLog } from "./types";

const STORAGE_KEY = "frettalk:logs";
const EMPTY_SNAPSHOT: PracticeLog[] = [];

const listeners = new Set<() => void>();
let cache: PracticeLog[] | null = null;

function readFromStorage(): PracticeLog[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PracticeLog[];
  } catch {
    return [];
  }
}

function writeToStorage(logs: PracticeLog[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch {
    // localStorageが使えない環境では保存をあきらめる
  }
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setLogs(next: PracticeLog[]) {
  cache = next;
  writeToStorage(next);
  emitChange();
}

function getSnapshot(): PracticeLog[] {
  if (cache === null) {
    const existing = readFromStorage();
    cache = existing.length > 0 ? existing : createDummyLogs();
    if (existing.length === 0) {
      writeToStorage(cache);
    }
  }
  return cache;
}

function getServerSnapshot(): PracticeLog[] {
  return EMPTY_SNAPSHOT;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useLogs() {
  const logs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isReady = logs !== EMPTY_SNAPSHOT;

  const addLog = useCallback((minutes: number, memo: string) => {
    const current = cache ?? getSnapshot();
    const next: PracticeLog[] = [
      {
        id: `log-${Date.now()}`,
        author: "あなた",
        minutes,
        memo,
        createdAt: new Date().toISOString(),
        likes: 0,
        liked: false,
      },
      ...current,
    ];
    setLogs(next);
  }, []);

  const toggleLike = useCallback((id: string) => {
    const current = cache ?? getSnapshot();
    const next = current.map((log) =>
      log.id === id
        ? {
            ...log,
            liked: !log.liked,
            likes: log.liked ? log.likes - 1 : log.likes + 1,
          }
        : log
    );
    setLogs(next);
  }, []);

  return { logs, isReady, addLog, toggleLike };
}
