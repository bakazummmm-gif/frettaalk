"use client";

import { useDiscoverSidebar } from "@/lib/useDiscoverSidebar";

export default function DiscoverSidebar() {
  const { popularLogs, suggestedUsers, isReady } = useDiscoverSidebar();

  return (
    <aside className="sticky top-14 order-3 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 overflow-y-auto p-4 xl:block">
      <div className="flex flex-col gap-4">
        <section className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
            人気の投稿
          </h2>

          {!isReady && (
            <p className="text-xs text-neutral-400">読み込み中...</p>
          )}

          {isReady && popularLogs.length === 0 && (
            <p className="text-xs text-neutral-400">まだ投稿がありません</p>
          )}

          <ul className="flex flex-col gap-3">
            {popularLogs.map((log) => (
              <li key={log.id} className="text-sm">
                <p className="font-semibold text-neutral-800 dark:text-neutral-100">
                  {log.author}
                </p>
                <p className="line-clamp-2 text-neutral-500 dark:text-neutral-400">
                  {log.memo}
                </p>
                <p className="mt-0.5 text-xs text-pink-500">❤️ {log.likes}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
            おすすめユーザー
          </h2>

          {!isReady && (
            <p className="text-xs text-neutral-400">読み込み中...</p>
          )}

          {isReady && suggestedUsers.length === 0 && (
            <p className="text-xs text-neutral-400">ユーザーがいません</p>
          )}

          <ul className="flex flex-col gap-3">
            {suggestedUsers.map((suggestedUser) => (
              <li key={suggestedUser.id} className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                  {suggestedUser.name.slice(0, 1)}
                </span>
                <div className="text-sm">
                  <p className="font-semibold text-neutral-800 dark:text-neutral-100">
                    {suggestedUser.name}
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    {suggestedUser.points.toLocaleString()} pt
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}
