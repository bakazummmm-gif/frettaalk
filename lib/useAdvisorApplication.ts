"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useCurrentUser } from "./userStore";
import type { DbAdvisorApplication } from "./types";

export function useAdvisorApplication() {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const [application, setApplication] = useState<DbAdvisorApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (userId: string) => {
    const { data, error: fetchError } = await supabase
      .from("advisor_applications")
      .select("id, user_id, message, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      setError(fetchError.message);
      setIsLoading(false);
      return;
    }

    setApplication(data);
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isUserLoading || !user) return;
    // Supabaseへの非同期フェッチなので、setStateはawait後の非同期タイミングで呼ばれる
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh(user.id);
  }, [isUserLoading, user, refresh]);

  const isReady = !isUserLoading && (!user || !isLoading);

  const apply = useCallback(
    async (message: string) => {
      if (!user) return;

      const { error: insertError } = await supabase
        .from("advisor_applications")
        .insert({ user_id: user.id, message: message.trim() || null });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      await refresh(user.id);
    },
    [user, refresh]
  );

  return { application, isReady, error, apply };
}
