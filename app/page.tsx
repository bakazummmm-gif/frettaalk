"use client";

import PracticeLogForm from "@/components/PracticeLogForm";
import PracticeLogCard from "@/components/PracticeLogCard";
import { useLogs } from "@/lib/useLogs";

export default function TimelinePage() {
  const { logs, isReady, addLog, toggleLike } = useLogs();

  return (
    <div className="flex flex-col gap-4">
      <PracticeLogForm onSubmit={addLog} />

      <div className="flex flex-col gap-3">
        {!isReady && (
          <p className="py-8 text-center text-sm text-neutral-400">
            読み込み中...
          </p>
        )}

        {isReady && logs.length === 0 && (
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
