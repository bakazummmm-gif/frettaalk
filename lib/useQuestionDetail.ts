"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { AnswerView, QuestionDetailView } from "./types";

type QuestionRow = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  best_answer_id: string | null;
  advisor_only: boolean;
  created_at: string;
  users: { name: string } | null;
};

type AnswerRow = {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  users: { name: string } | null;
};

export function useQuestionDetail(questionId: string) {
  const [question, setQuestion] = useState<QuestionDetailView | null>(null);
  const [answers, setAnswers] = useState<AnswerView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [questionResult, answersResult] = await Promise.all([
      supabase
        .from("questions")
        .select(
          "id, user_id, title, body, best_answer_id, advisor_only, created_at, users(name)"
        )
        .eq("id", questionId)
        .maybeSingle(),
      supabase
        .from("answers")
        .select("id, user_id, body, created_at, users(name)")
        .eq("question_id", questionId)
        .order("created_at", { ascending: true }),
    ]);

    if (questionResult.error) {
      setError(questionResult.error.message);
      setIsLoading(false);
      return;
    }
    if (answersResult.error) {
      setError(answersResult.error.message);
      setIsLoading(false);
      return;
    }

    const questionRow = questionResult.data as unknown as QuestionRow | null;
    if (!questionRow) {
      setQuestion(null);
      setAnswers([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setQuestion({
      id: questionRow.id,
      title: questionRow.title,
      body: questionRow.body,
      author: questionRow.users?.name ?? "ゲスト",
      authorId: questionRow.user_id,
      createdAt: questionRow.created_at,
      bestAnswerId: questionRow.best_answer_id,
      advisorOnly: questionRow.advisor_only,
    });

    setAnswers(
      ((answersResult.data as unknown as AnswerRow[]) ?? []).map((row) => ({
        id: row.id,
        body: row.body,
        author: row.users?.name ?? "ゲスト",
        authorId: row.user_id,
        createdAt: row.created_at,
        isBestAnswer: row.id === questionRow.best_answer_id,
      }))
    );
    setError(null);
    setIsLoading(false);
  }, [questionId]);

  useEffect(() => {
    // Supabaseへの非同期フェッチなので、setStateはawait後の非同期タイミングで呼ばれる
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const addAnswer = useCallback(
    async (userId: string, body: string) => {
      const { error: insertError } = await supabase
        .from("answers")
        .insert({ question_id: questionId, user_id: userId, body });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      await refresh();
    },
    [questionId, refresh]
  );

  const markBestAnswer = useCallback(
    async (answerId: string) => {
      const { error: updateError } = await supabase
        .from("questions")
        .update({ best_answer_id: answerId })
        .eq("id", questionId);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      await refresh();
    },
    [questionId, refresh]
  );

  return {
    question,
    answers,
    isReady: !isLoading,
    error,
    addAnswer,
    markBestAnswer,
  };
}
