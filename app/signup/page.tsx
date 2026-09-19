"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = await signUp(email, password, name.trim() || email.split("@")[0]);
      if (data.session) {
        router.push("/");
        router.refresh();
      } else {
        setNeedsConfirmation(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "登録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (needsConfirmation) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <span aria-hidden className="text-3xl">
          📩
        </span>
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          確認メールを送りました
        </h1>
        <p className="text-sm text-neutral-500">
          {email} 宛てに届いたメールのリンクをクリックすると、ログインできるようになります。
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
        新規登録
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">
            ニックネーム
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: たろう"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">
            メールアドレス
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">
            パスワード(6文字以上)
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          />
        </label>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
        >
          {isSubmitting ? "登録中..." : "登録する"}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-500">
        アカウントをお持ちの方は{" "}
        <Link href="/login" className="text-orange-600 underline">
          ログイン
        </Link>
      </p>
    </div>
  );
}
