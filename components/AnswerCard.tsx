import { formatRelativeTime } from "@/lib/formatRelativeTime";
import type { AnswerView } from "@/lib/types";

type Props = {
  answer: AnswerView;
  canMarkBest: boolean;
  onMarkBest: (answerId: string) => void;
};

export default function AnswerCard({ answer, canMarkBest, onMarkBest }: Props) {
  return (
    <article
      className={`rounded-2xl border p-4 shadow-sm ${
        answer.isBestAnswer
          ? "border-orange-300 bg-orange-50 dark:border-orange-500/50 dark:bg-orange-500/10"
          : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {answer.author}
        </p>
        <p className="text-xs text-neutral-400">
          {formatRelativeTime(answer.createdAt)}
        </p>
      </div>

      <p className="mb-3 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
        {answer.body}
      </p>

      {answer.isBestAnswer && (
        <span className="inline-block rounded-full bg-orange-500 px-2.5 py-1 text-xs font-semibold text-white">
          ✅ ベストアンサー
        </span>
      )}

      {!answer.isBestAnswer && canMarkBest && (
        <button
          type="button"
          onClick={() => onMarkBest(answer.id)}
          className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 transition-colors hover:bg-orange-100 hover:text-orange-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-orange-500/10 dark:hover:text-orange-400"
        >
          ベストアンサーに選ぶ
        </button>
      )}
    </article>
  );
}
