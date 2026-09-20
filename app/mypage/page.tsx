"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCurrentUser } from "@/lib/userStore";
import { useAdvisorApplication } from "@/lib/useAdvisorApplication";
import { getAccessToken } from "@/lib/auth";

const STATUS_LABEL: Record<string, string> = {
  none: "未申請",
  pending: "審査中",
  approved: "承認済み",
  rejected: "却下",
};

function AdvisorSection() {
  const { user } = useCurrentUser();
  const { application, isReady, error, apply } = useAdvisorApplication();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const canApply =
    user.advisor_status === "none" || user.advisor_status === "rejected";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await apply(message);
    setMessage("");
    setIsSubmitting(false);
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        アドバイザー申請
      </h2>

      <p className="mb-3 text-sm text-neutral-500">
        現在のステータス:{" "}
        <span className="font-semibold text-neutral-800 dark:text-neutral-100">
          {STATUS_LABEL[user.advisor_status]}
        </span>
      </p>

      {error && <p className="mb-2 text-xs text-red-500">{error}</p>}

      {isReady && canApply && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="実績や得意なジャンルなど、アピールしたいことがあれば書いてください(任意)"
            rows={3}
            className="resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {isSubmitting ? "送信中..." : "申請する"}
          </button>
        </form>
      )}

      {isReady && !canApply && (
        <p className="text-xs text-neutral-400">
          {application
            ? `申請日: ${new Date(application.created_at).toLocaleDateString("ja-JP")}`
            : "運営からの承認をお待ちください。"}
        </p>
      )}
    </div>
  );
}

function StripeConnectSection() {
  const { user } = useCurrentUser();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user || user.advisor_status !== "approved") return null;

  const handleConnect = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const accessToken = await getAccessToken();
      const response = await fetch("/api/stripe/connect", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const rawBody = await response.text();
      const data = rawBody ? JSON.parse(rawBody) : {};

      if (!response.ok) {
        throw new Error(data.error ?? `連携に失敗しました(status: ${response.status})`);
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "連携に失敗しました");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        振込先の連携(Stripe)
      </h2>

      <p className="mb-3 text-sm text-neutral-500">
        受け取り設定:{" "}
        <span className="font-semibold text-neutral-800 dark:text-neutral-100">
          {user.stripe_payouts_enabled ? "連携済み" : "未連携"}
        </span>
      </p>

      {error && <p className="mb-2 text-xs text-red-500">{error}</p>}

      <button
        type="button"
        onClick={handleConnect}
        disabled={isSubmitting}
        className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
      >
        {isSubmitting
          ? "移動中..."
          : user.stripe_payouts_enabled
            ? "連携情報を確認する"
            : "Stripeで口座を連携する"}
      </button>
    </div>
  );
}

export default function MyPage() {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <p className="py-8 text-center text-sm text-neutral-400">読み込み中...</p>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center dark:border-neutral-700 dark:bg-neutral-900">
        <span aria-hidden className="text-4xl">
          👤
        </span>
        <p className="max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
          マイページを見るにはログインしてください
        </p>
        <Link
          href="/login"
          className="mt-1 rounded-full bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white"
        >
          ログイン
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 text-lg font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {user.name.slice(0, 1)}
        </span>
        <div>
          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
            {user.name}
          </p>
          <p className="text-sm text-orange-600 dark:text-orange-400">
            {user.points.toLocaleString()} pt
          </p>
        </div>
      </div>

      <AdvisorSection />
      <StripeConnectSection />
    </div>
  );
}
