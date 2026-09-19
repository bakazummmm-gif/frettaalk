"use client";

import Link from "next/link";
import PracticeLogForm from "@/components/PracticeLogForm";
import PracticeLogCard from "@/components/PracticeLogCard";
import { usePracticeLogs } from "@/lib/usePracticeLogs";
import { useCurrentUser } from "@/lib/userStore";

export default function TimelinePage() {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const { logs, isReady, error, addLog, toggleLike } = usePracticeLogs();

  return (
    <div className="flex flex-col gap-4">
      {!isUserLoading &&
        (user ? (
          <PracticeLogForm onSubmit={addLog} />
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-4 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
            <Link href="/login" className="font-semibold text-orange-600 underline">
              ログイン
            </Link>
            すると練習ログを投稿できます
          </div>
        ))}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500 dark:bg-red-500/10">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {!isReady && (
          <p className="py-8 text-center text-sm text-neutral-400">
            読み込み中...
          </p>
        )}

        {isReady && logs.length === 0 && !error && (
          <p className="py-8 text-center text-sm text-neutral-400">
            まだ投稿がありません。最初の練習ログを記録しよう!
          </p>
        )}

        {logs.map((log) => (
          <PracticeLogCard key={log.id} log={log} onToggleLike={toggleLike} />
        ))}
      </div>
    </div>
  );
}
