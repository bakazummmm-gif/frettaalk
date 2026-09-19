"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useCurrentUser } from "./userStore";
import type { PracticeLogView } from "./types";

type LogRow = {
  id: string;
  duration_minutes: number;
  memo: string;
  created_at: string;
  users: { name: string } | null;
  likes: { user_id: string }[];
};

function mapRow(row: LogRow, currentUserId?: string): PracticeLogView {
  return {
    id: row.id,
    author: row.users?.name ?? "ゲスト",
    minutes: row.duration_minutes,
    memo: row.memo,
    createdAt: row.created_at,
    likes: row.likes.length,
    liked: currentUserId
      ? row.likes.some((like) => like.user_id === currentUserId)
      : false,
  };
}

export function usePracticeLogs() {
  const { user } = useCurrentUser();
  const [logs, setLogs] = useState<PracticeLogView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (currentUserId?: string) => {
    const { data, error: fetchError } = await supabase
      .from("practice_logs")
      .select(
        "id, duration_minutes, memo, created_at, users(name), likes(user_id)"
      )
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setIsLoading(false);
      return;
    }

    setLogs(((data as unknown as LogRow[]) ?? []).map((row) => mapRow(row, currentUserId)));
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    // Supabaseへの非同期フェッチなので、setStateはawait後の非同期タイミングで呼ばれる
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh(user.id);
  }, [user, refresh]);

  const addLog = useCallback(
    async (minutes: number, memo: string) => {
      if (!user) return;

      const { error: insertError } = await supabase.from("practice_logs").insert({
        user_id: user.id,
        duration_minutes: minutes,
        memo,
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      await refresh(user.id);
    },
    [user, refresh]
  );

  const toggleLike = useCallback(
    async (logId: string) => {
      if (!user) return;

      const target = logs.find((log) => log.id === logId);
      if (!target) return;

      const { error: likeError } = target.liked
        ? await supabase
            .from("likes")
            .delete()
            .eq("user_id", user.id)
            .eq("log_id", logId)
        : await supabase.from("likes").insert({ user_id: user.id, log_id: logId });

      if (likeError) {
        setError(likeError.message);
        return;
      }

      await refresh(user.id);
    },
    [user, logs, refresh]
  );

  return {
    logs,
    isReady: !isLoading,
    error,
    addLog,
    toggleLike,
  };
}
