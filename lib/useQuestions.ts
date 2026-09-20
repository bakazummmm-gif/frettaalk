"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { QuestionListItem } from "./types";

type QuestionRow = {
  id: string;
  title: string;
  body: string;
  advisor_only: boolean;
  created_at: string;
  users: { name: string } | null;
  answers: { id: string }[];
};

function mapRow(row: QuestionRow): QuestionListItem {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    author: row.users?.name ?? "ゲスト",
    createdAt: row.created_at,
    answerCount: row.answers.length,
    advisorOnly: row.advisor_only,
  };
}

export function useQuestions() {
  const [questions, setQuestions] = useState<QuestionListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from("questions")
      .select(
        "id, title, body, advisor_only, created_at, users(name), answers!question_id(id)"
      )
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setIsLoading(false);
      return;
    }

    setQuestions(((data as unknown as QuestionRow[]) ?? []).map(mapRow));
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Supabaseへの非同期フェッチなので、setStateはawait後の非同期タイミングで呼ばれる
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const addQuestion = useCallback(
    async (userId: string, title: string, body: string, advisorOnly: boolean) => {
      const { error: insertError } = await supabase
        .from("questions")
        .insert({ user_id: userId, title, body, advisor_only: advisorOnly });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      await refresh();
    },
    [refresh]
  );

  return {
    questions,
    isReady: !isLoading,
    error,
    addQuestion,
  };
}
