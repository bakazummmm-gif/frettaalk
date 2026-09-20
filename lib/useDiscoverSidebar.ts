"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";

export type PopularLog = {
  id: string;
  author: string;
  memo: string;
  likes: number;
};

export type SuggestedUser = {
  id: string;
  name: string;
  points: number;
};

type LogRow = {
  id: string;
  memo: string;
  users: { name: string } | null;
  likes: { user_id: string }[];
};

export function useDiscoverSidebar() {
  const [popularLogs, setPopularLogs] = useState<PopularLog[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(async () => {
    const [logsResult, usersResult] = await Promise.all([
      supabase
        .from("practice_logs")
        .select("id, memo, users(name), likes(user_id)")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("users")
        .select("id, name, points")
        .order("points", { ascending: false })
        .limit(3),
    ]);

    const logs = ((logsResult.data as unknown as LogRow[]) ?? [])
      .map((row) => ({
        id: row.id,
        author: row.users?.name ?? "ゲスト",
        memo: row.memo,
        likes: row.likes.length,
      }))
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3);

    setPopularLogs(logs);
    setSuggestedUsers(usersResult.data ?? []);
    setIsReady(true);
  }, []);

  useEffect(() => {
    // Supabaseへの非同期フェッチなので、setStateはawait後の非同期タイミングで呼ばれる
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  return { popularLogs, suggestedUsers, isReady };
}
