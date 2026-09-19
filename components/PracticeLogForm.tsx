"use client";

import { useState, type FormEvent } from "react";

type Props = {
  onSubmit: (minutes: number, memo: string) => void;
};

export default function PracticeLogForm({ onSubmit }: Props) {
  const [minutes, setMinutes] = useState("");
  const [memo, setMemo] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const minutesValue = Number(minutes);
    if (!minutes || Number.isNaN(minutesValue) || minutesValue <= 0) {
      setError("練習時間を正しく入力してください");
      return;
    }
    if (!memo.trim()) {
      setError("メモを入力してください");
      return;
    }

    onSubmit(minutesValue, memo.trim());
    setMinutes("");
    setMemo("");
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <h2 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        練習ログを記録する
      </h2>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">
            練習時間(分)
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="例: 30"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">
            メモ
          </span>
          <textarea
            placeholder="今日練習した内容を書こう"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
            className="resize-none rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          />
        </label>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          投稿する
        </button>
      </div>
    </form>
  );
}
