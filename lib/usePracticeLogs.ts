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
};

function mapRow(row: LogRow): PracticeLogView {
  return {
    id: row.id,
    minutes: row.duration_minutes,
    memo: row.memo,
    createdAt: row.created_at,
  };
}

// 練習ログは非公開(本人のみ)。マイページのカレンダーで使う。
export function usePracticeLogs() {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const [logs, setLogs] = useState<PracticeLogView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from("practice_logs")
      .select("id, duration_minutes, memo, created_at")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setIsLoading(false);
      return;
    }

    setLogs(((data as unknown as LogRow[]) ?? []).map(mapRow));
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isUserLoading || !user) return;
    // Supabaseへの非同期フェッチなので、setStateはawait後の非同期タイミングで呼ばれる
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [isUserLoading, user, refresh]);

  const isReady = !isUserLoading && (!user || !isLoading);

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

      await refresh();
    },
    [user, refresh]
  );

  return {
    logs,
    isReady,
    error,
    addLog,
  };
}
