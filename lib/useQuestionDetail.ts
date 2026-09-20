"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useCurrentUser } from "./userStore";
import type { AnswerView, QuestionDetailView } from "./types";

type QuestionRow = {
  id: string;
  user_id: string;
  title: string;
  body: string;
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
  answer_likes: { user_id: string }[];
};

export function useQuestionDetail(questionId: string) {
  const { user } = useCurrentUser();
  const [question, setQuestion] = useState<QuestionDetailView | null>(null);
  const [answers, setAnswers] = useState<AnswerView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(
    async (currentUserId?: string) => {
      const [questionResult, answersResult] = await Promise.all([
        supabase
          .from("questions")
          .select("id, user_id, title, body, advisor_only, created_at, users(name)")
          .eq("id", questionId)
          .maybeSingle(),
        supabase
          .from("answers")
          .select("id, user_id, body, created_at, users(name), answer_likes(user_id)")
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
        advisorOnly: questionRow.advisor_only,
      });

      setAnswers(
        ((answersResult.data as unknown as AnswerRow[]) ?? []).map((row) => ({
          id: row.id,
          body: row.body,
          author: row.users?.name ?? "ゲスト",
          authorId: row.user_id,
          createdAt: row.created_at,
          likes: row.answer_likes.length,
          liked: currentUserId
            ? row.answer_likes.some((like) => like.user_id === currentUserId)
            : false,
        }))
      );
      setError(null);
      setIsLoading(false);
    },
    [questionId]
  );

  useEffect(() => {
    // Supabaseへの非同期フェッチなので、setStateはawait後の非同期タイミングで呼ばれる
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh(user?.id);
  }, [refresh, user?.id]);

  const addAnswer = useCallback(
    async (body: string) => {
      if (!user) return;

      const { error: insertError } = await supabase
        .from("answers")
        .insert({ question_id: questionId, user_id: user.id, body });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      await refresh(user.id);
    },
    [questionId, user, refresh]
  );

  const toggleAnswerLike = useCallback(
    async (answerId: string) => {
      if (!user) return;

      const target = answers.find((answer) => answer.id === answerId);
      if (!target) return;

      const { error: likeError } = target.liked
        ? await supabase
            .from("answer_likes")
            .delete()
            .eq("user_id", user.id)
            .eq("answer_id", answerId)
        : await supabase
            .from("answer_likes")
            .insert({ user_id: user.id, answer_id: answerId });

      if (likeError) {
        setError(likeError.message);
        return;
      }

      await refresh(user.id);
    },
    [user, answers, refresh]
  );

  return {
    question,
    answers,
    isReady: !isLoading,
    error,
    addAnswer,
    toggleAnswerLike,
  };
}
