import Link from "next/link";
import Avatar from "@/components/Avatar";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import type { QuestionListItem } from "@/lib/types";

type Props = {
  question: QuestionListItem;
};

export default function QuestionCard({ question }: Props) {
  return (
    <Link
      href={`/questions/${question.id}`}
      className="flex gap-3 px-1 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/60"
    >
      <Avatar name={question.author} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            {question.author}
          </p>
          <span aria-hidden className="text-neutral-300 dark:text-neutral-600">
            ・
          </span>
          <p className="text-xs text-neutral-400">
            {formatRelativeTime(question.createdAt)}
          </p>
          {question.advisorOnly && (
            <span className="ml-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
              🎓 アドバイザー限定
            </span>
          )}
        </div>

        <h3 className="mt-0.5 font-bold text-neutral-900 dark:text-neutral-100">
          {question.title}
        </h3>

        <p className="mt-0.5 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
          {question.body}
        </p>

        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"
          >
            💬
          </span>
          回答{question.answerCount}件
        </div>
      </div>
    </Link>
  );
}
