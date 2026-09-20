"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useCurrentUser } from "./userStore";

// 自分が投稿した回答が、合計で何件「高評価」をもらったかを数える
export function useReceivedLikes() {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const [totalLikes, setTotalLikes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async (userId: string) => {
    const { data: myAnswers, error: answersError } = await supabase
      .from("answers")
      .select("id")
      .eq("user_id", userId);

    if (answersError || !myAnswers || myAnswers.length === 0) {
      setTotalLikes(0);
      setIsLoading(false);
      return;
    }

    const answerIds = myAnswers.map((answer) => answer.id);

    const { count } = await supabase
      .from("answer_likes")
      .select("id", { count: "exact", head: true })
      .in("answer_id", answerIds);

    setTotalLikes(count ?? 0);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isUserLoading || !user) return;
    // Supabaseへの非同期フェッチなので、setStateはawait後の非同期タイミングで呼ばれる
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh(user.id);
  }, [isUserLoading, user, refresh]);

  return {
    totalLikes,
    isReady: !isUserLoading && (!user || !isLoading),
  };
}
