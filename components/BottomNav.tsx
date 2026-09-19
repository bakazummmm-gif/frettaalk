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

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 border-t border-neutral-200 bg-white/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

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
  );
}
