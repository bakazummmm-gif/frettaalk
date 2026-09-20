import Link from "next/link";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import type { QuestionListItem } from "@/lib/types";

type Props = {
  question: QuestionListItem;
};

export default function QuestionCard({ question }: Props) {
  return (
    <Link
      href={`/questions/${question.id}`}
      className="block rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:border-orange-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-orange-500/50"
    >
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {question.author}
        </p>
        <p className="text-xs text-neutral-400">
          {formatRelativeTime(question.createdAt)}
        </p>
      </div>

      <h3 className="mb-1 font-bold text-neutral-900 dark:text-neutral-100">
        {question.title}
      </h3>

      <p className="mb-3 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
        {question.body}
      </p>

      <div className="flex items-center gap-2 text-xs">
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          💬 回答{question.answerCount}件
        </span>
        {question.hasBestAnswer && (
          <span className="rounded-full bg-orange-50 px-2.5 py-1 font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
            ✅ 解決済み
          </span>
        )}
      </div>
    </Link>
  );
}
