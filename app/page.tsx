"use client";

import Link from "next/link";
import QuestionForm from "@/components/QuestionForm";
import QuestionCard from "@/components/QuestionCard";
import { useQuestions } from "@/lib/useQuestions";
import { useCurrentUser } from "@/lib/userStore";

export default function HomePage() {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const { questions, isReady, error, addQuestion } = useQuestions();

  const handleSubmit = (title: string, body: string, advisorOnly: boolean) => {
    if (!user) return;
    addQuestion(user.id, title, body, advisorOnly);
  };

  return (
    <div className="flex flex-col gap-4">
      {!isUserLoading &&
        (user ? (
          <QuestionForm authorName={user.name} onSubmit={handleSubmit} />
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-4 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
            <Link href="/login" className="font-semibold text-orange-600 underline">
              ログイン
            </Link>
            すると質問を投稿できます
          </div>
        ))}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500 dark:bg-red-500/10">
          {error}
        </p>
      )}

      <div className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800">
        {!isReady && (
          <p className="py-8 text-center text-sm text-neutral-400">
            読み込み中...
          </p>
        )}

        {isReady && questions.length === 0 && !error && (
          <p className="py-8 text-center text-sm text-neutral-400">
            まだ質問がありません。最初の質問を投稿しよう!
          </p>
        )}

        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
}
