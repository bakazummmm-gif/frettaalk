"use client";

import { useState, type FormEvent } from "react";

type Props = {
  onSubmit: (title: string, body: string, advisorOnly: boolean) => void;
};

export default function QuestionForm({ onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [advisorOnly, setAdvisorOnly] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }
    if (!body.trim()) {
      setError("質問の内容を入力してください");
      return;
    }

    onSubmit(title.trim(), body.trim(), advisorOnly);
    setTitle("");
    setBody("");
    setAdvisorOnly(false);
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <h2 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        質問を投稿する
      </h2>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">
            タイトル
          </span>
          <input
            type="text"
            placeholder="例: Fコードがどうしても鳴らない"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">
            質問の内容
          </span>
          <textarea
            placeholder="困っていることを詳しく書こう"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="resize-none rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <input
            type="checkbox"
            checked={advisorOnly}
            onChange={(e) => setAdvisorOnly(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-orange-500 focus:ring-orange-500 dark:border-neutral-700"
          />
          アドバイザーのみ回答できるようにする
        </label>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          質問する
        </button>
      </div>
    </form>
  );
}
