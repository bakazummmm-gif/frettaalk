import Avatar from "@/components/Avatar";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import type { AnswerView } from "@/lib/types";

type Props = {
  answer: AnswerView;
  canLike: boolean;
  onToggleLike: (answerId: string) => void;
};

export default function AnswerCard({ answer, canLike, onToggleLike }: Props) {
  return (
    <article className="flex gap-3 border-b border-neutral-100 px-1 py-4 last:border-none dark:border-neutral-800">
      <Avatar name={answer.author} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            {answer.author}
          </p>
          <span aria-hidden className="text-neutral-300 dark:text-neutral-600">
            ・
          </span>
          <p className="text-xs text-neutral-400">
            {formatRelativeTime(answer.createdAt)}
          </p>
        </div>

        <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {answer.body}
        </p>

        <button
          type="button"
          disabled={!canLike}
          onClick={() => onToggleLike(answer.id)}
          className={`mt-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            answer.liked
              ? "bg-orange-500 text-white shadow-sm"
              : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
          }`}
        >
          <span aria-hidden>{answer.liked ? "👍" : "🤍"}</span>
          <span>{answer.likes}</span>
        </button>
      </div>
    </article>
  );
}
