"use client";

import Link from "next/link";
import { useCurrentUser } from "@/lib/userStore";
import { signOut } from "@/lib/auth";

export default function Header() {
  const { user, isLoading } = useCurrentUser();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-neutral-200 bg-white/90 px-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white shadow-sm">
          FT
        </span>
        <span className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          FretTalk
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
          <span aria-hidden className="text-sm">
            ⭐
          </span>
          <span className="text-sm font-bold">
            {isLoading ? "--" : user ? `${user.points.toLocaleString()} pt` : "--"}
          </span>
        </div>

        {!isLoading &&
          (user ? (
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-full px-2.5 py-1.5 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
            >
              ログアウト
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-orange-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-orange-600"
            >
              ログイン
            </Link>
          ))}
      </div>
    </header>
  );
}
