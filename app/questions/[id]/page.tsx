"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import AnswerForm from "@/components/AnswerForm";
import AnswerCard from "@/components/AnswerCard";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { useQuestionDetail } from "@/lib/useQuestionDetail";
import { useCurrentUser } from "@/lib/userStore";

export default function QuestionDetailPage() {
  const params = useParams();
  const questionId = params.id as string;
  const { user } = useCurrentUser();
  const { question, answers, isReady, error, addAnswer, markBestAnswer } =
    useQuestionDetail(questionId);

  const handleAnswerSubmit = (body: string) => {
    if (!user) return;
    addAnswer(user.id, body);
  };

  if (!isReady) {
    return (
      <p className="py-8 text-center text-sm text-neutral-400">
        読み込み中...
      </p>
    );
  }

  if (!question) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center dark:border-neutral-700 dark:bg-neutral-900">
        <p className="text-sm text-neutral-500">
          質問が見つかりませんでした
        </p>
        <Link
          href="/"
          className="text-sm font-semibold text-orange-600 underline"
        >
          ホームに戻る
        </Link>
      </div>
    );
  }

  const isAsker = user?.id === question.authorId;
  const canAnswer = !question.advisorOnly || Boolean(user?.is_advisor);

  return (
    <div className="flex flex-col gap-4">
      <Link href="/" className="text-sm text-neutral-500 underline">
        ← ホームに戻る
      </Link>

      <article className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {question.author}
          </p>
          <p className="text-xs text-neutral-400">
            {formatRelativeTime(question.createdAt)}
          </p>
        </div>
        <h1 className="mb-2 flex flex-wrap items-center gap-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
          {question.title}
          {question.advisorOnly && (
            <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
              🎓 アドバイザー限定
            </span>
          )}
        </h1>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {question.body}
        </p>
      </article>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500 dark:bg-red-500/10">
          {error}
        </p>
      )}

      <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        回答 {answers.length}件
      </h2>

      <div className="flex flex-col gap-3">
        {answers.length === 0 && (
          <p className="py-4 text-center text-sm text-neutral-400">
            まだ回答がありません。最初の回答をしよう!
          </p>
        )}

        {answers.map((answer) => (
          <AnswerCard
            key={answer.id}
            answer={answer}
            canMarkBest={isAsker}
            onMarkBest={markBestAnswer}
          />
        ))}
      </div>

      {!user && (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-4 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
          <Link
            href="/login"
            className="font-semibold text-orange-600 underline"
          >
            ログイン
          </Link>
          すると回答できます
        </div>
      )}

      {user && !canAnswer && (
        <div className="rounded-2xl border border-dashed border-purple-300 bg-purple-50 p-4 text-center text-sm text-purple-600 dark:border-purple-500/50 dark:bg-purple-500/10 dark:text-purple-400">
          🎓 この質問はアドバイザーのみ回答できます
        </div>
      )}

      {user && canAnswer && <AnswerForm onSubmit={handleAnswerSubmit} />}
    </div>
  );
}
