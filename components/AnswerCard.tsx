import { formatRelativeTime } from "@/lib/formatRelativeTime";
import type { AnswerView } from "@/lib/types";

type Props = {
  answer: AnswerView;
  canLike: boolean;
  onToggleLike: (answerId: string) => void;
};

export default function AnswerCard({ answer, canLike, onToggleLike }: Props) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
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

      <button
        type="button"
        disabled={!canLike}
        onClick={() => onToggleLike(answer.id)}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          answer.liked
            ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
            : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
        }`}
      >
        <span aria-hidden>{answer.liked ? "👍" : "🤍"}</span>
        <span>{answer.likes}</span>
      </button>
    </article>
  );
}
