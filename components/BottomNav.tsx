"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "ホーム", icon: "🏠" },
  { href: "/mission", label: "ミッション", icon: "🎯" },
  { href: "/gear", label: "機材図鑑", icon: "🎸" },
  { href: "/review", label: "添削", icon: "📝" },
  { href: "/mypage", label: "マイページ", icon: "👤" },
] as const;

function isNavActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* モバイル: 画面下部の固定ナビ */}
      <nav className="sticky bottom-0 z-20 order-2 border-t border-neutral-200 bg-white/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95 md:hidden">
        <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1">
          {NAV_ITEMS.map((item) => {
            const isActive = isNavActive(pathname, item.href);

            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] transition-colors ${
                    isActive
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`text-lg ${isActive ? "scale-110" : ""}`}
                  >
                    {item.icon}
                  </span>
                  <span className={isActive ? "font-semibold" : ""}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* デスクトップ: 左サイドバー */}
      <nav className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto border-r border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950 md:order-1 md:block">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = isNavActive(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-orange-50 font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                      : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
                  }`}
                >
                  <span aria-hidden className="text-lg">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
