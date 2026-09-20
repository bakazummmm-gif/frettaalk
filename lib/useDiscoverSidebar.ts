"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";

export type PopularQuestion = {
  id: string;
  author: string;
  title: string;
  answerCount: number;
};

export type SuggestedUser = {
  id: string;
  name: string;
  points: number;
};

type QuestionRow = {
  id: string;
  title: string;
  users: { name: string } | null;
  answers: { id: string }[];
};

export function useDiscoverSidebar() {
  const [popularQuestions, setPopularQuestions] = useState<PopularQuestion[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(async () => {
    const [questionsResult, usersResult] = await Promise.all([
      supabase
        .from("questions")
        .select("id, title, users(name), answers!question_id(id)")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("users")
        .select("id, name, points")
        .order("points", { ascending: false })
        .limit(3),
    ]);

    const questions = ((questionsResult.data as unknown as QuestionRow[]) ?? [])
      .map((row) => ({
        id: row.id,
        author: row.users?.name ?? "ゲスト",
        title: row.title,
        answerCount: row.answers.length,
      }))
      .sort((a, b) => b.answerCount - a.answerCount)
      .slice(0, 3);

    setPopularQuestions(questions);
    setSuggestedUsers(usersResult.data ?? []);
    setIsReady(true);
  }, []);

  useEffect(() => {
    // Supabaseへの非同期フェッチなので、setStateはawait後の非同期タイミングで呼ばれる
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  return { popularQuestions, suggestedUsers, isReady };
}
