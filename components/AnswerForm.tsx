"use client";

import { useState, type FormEvent } from "react";

type Props = {
  onSubmit: (body: string) => void;
};

export default function AnswerForm({ onSubmit }: Props) {
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!body.trim()) {
      setError("回答の内容を入力してください");
      return;
    }

    onSubmit(body.trim());
    setBody("");
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <h2 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        回答する
      </h2>

      <div className="flex flex-col gap-3">
        <textarea
          placeholder="アドバイスを書こう"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className="resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
        />

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          回答を投稿する
        </button>
      </div>
    </form>
  );
}
