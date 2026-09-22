"use client";

import { useState, type FormEvent } from "react";
import Avatar from "@/components/Avatar";

type Props = {
  authorName: string;
  onSubmit: (title: string, body: string, advisorOnly: boolean) => void;
};

export default function QuestionForm({ authorName, onSubmit }: Props) {
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
      <div className="flex gap-3">
        <Avatar name={authorName} />

        <div className="flex flex-1 flex-col gap-2.5">
          <input
            type="text"
            placeholder="困っていることは?(例: Fコードがどうしても鳴らない)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl border-none bg-neutral-100 px-3.5 py-2.5 text-sm font-semibold text-neutral-900 outline-none placeholder:font-normal placeholder:text-neutral-400 focus:ring-2 focus:ring-orange-400 dark:bg-neutral-800 dark:text-neutral-100"
          />

          <textarea
            placeholder="詳しく書いてみよう"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="resize-none rounded-xl border-none bg-neutral-100 px-3.5 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-orange-400 dark:bg-neutral-800 dark:text-neutral-100"
          />

          <div className="flex items-center justify-between gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
              <input
                type="checkbox"
                checked={advisorOnly}
                onChange={(e) => setAdvisorOnly(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-purple-300 text-purple-500 focus:ring-purple-400"
              />
              🎓 アドバイザーのみ回答可
            </label>

            <button
              type="submit"
              className="rounded-full bg-orange-500 px-5 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-orange-600"
            >
              質問する
            </button>
          </div>

          {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        </div>
      </div>
    </form>
  );
}
