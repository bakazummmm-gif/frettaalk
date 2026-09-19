"use client";

import PracticeLogForm from "@/components/PracticeLogForm";
import PracticeLogCard from "@/components/PracticeLogCard";
import { usePracticeLogs } from "@/lib/usePracticeLogs";

export default function TimelinePage() {
  const { logs, isReady, error, addLog, toggleLike } = usePracticeLogs();

  return (
    <div className="flex flex-col gap-4">
      <PracticeLogForm onSubmit={addLog} />

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
