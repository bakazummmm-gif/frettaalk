"use client";

import { useCurrentUser } from "@/lib/userStore";

export default function Header() {
  const { user, isLoading } = useCurrentUser();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white">
          FT
        </span>
        <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          FretTalk
        </span>
      </div>

      <div className="flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
        <span aria-hidden className="text-sm">
          ⭐
        </span>
        <span className="text-sm font-semibold">
          {isLoading || !user ? "--" : `${user.points.toLocaleString()} pt`}
        </span>
      </div>
    </header>
  );
}
