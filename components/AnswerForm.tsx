"use client";

import { useState, type FormEvent } from "react";
import Avatar from "@/components/Avatar";

type Props = {
  authorName: string;
  onSubmit: (body: string) => void;
};

export default function AnswerForm({ authorName, onSubmit }: Props) {
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
      <div className="flex gap-3">
        <Avatar name={authorName} />

        <div className="flex flex-1 flex-col gap-2.5">
          <textarea
            placeholder="アドバイスを書こう"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="resize-none rounded-xl border-none bg-neutral-100 px-3.5 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-orange-400 dark:bg-neutral-800 dark:text-neutral-100"
          />

          {error && <p className="text-xs font-medium text-red-500">{error}</p>}

          <button
            type="submit"
            className="self-end rounded-full bg-orange-500 px-5 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-orange-600"
          >
            回答を投稿する
          </button>
        </div>
      </div>
    </form>
  );
}
