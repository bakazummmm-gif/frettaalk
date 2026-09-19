"use client";

import type { PracticeLogView } from "@/lib/types";

type Props = {
  log: PracticeLogView;
  onToggleLike: (id: string) => void;
};

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / (1000 * 60));

  if (diffMin < 1) return "たった今";
  if (diffMin < 60) return `${diffMin}分前`;

  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}時間前`;

  const diffDay = Math.round(diffHour / 24);
  return `${diffDay}日前`;
}

export default function PracticeLogCard({ log, onToggleLike }: Props) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {log.author.slice(0, 1)}
          </span>
          <div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {log.author}
            </p>
            <p className="text-xs text-neutral-400">
              {formatRelativeTime(log.createdAt)}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
          {log.minutes}分
        </span>
      </div>

      <p className="mb-3 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
        {log.memo}
      </p>

      <button
        type="button"
        onClick={() => onToggleLike(log.id)}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          log.liked
            ? "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400"
            : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
        }`}
      >
        <span aria-hidden>{log.liked ? "❤️" : "🤍"}</span>
        <span>{log.likes}</span>
      </button>
    </article>
  );
}
