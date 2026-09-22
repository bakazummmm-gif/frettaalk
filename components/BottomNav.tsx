"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";

function HomeIcon({ filled, ...props }: SVGProps<SVGSVGElement> & { filled: boolean }) {
  return filled ? (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.5 2 11h3v9.5h5.5V15h3v5.5H19V11h3z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9.5h12V10" />
      <path d="M10 19.5V14h4v5.5" />
    </svg>
  );
}

function TargetIcon({ filled, ...props }: SVGProps<SVGSVGElement> & { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" fill={filled ? "currentColor" : "none"} />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GuitarIcon({ filled, ...props }: SVGProps<SVGSVGElement> & { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="15" r="5.2" fill={filled ? "currentColor" : "none"} />
      <path d="M12.5 11.5 19 5" />
      <path d="M17 3.2 20.8 7" />
      <path d="M15.3 4.9l1.8 1.8" />
    </svg>
  );
}

function EditIcon({ filled, ...props }: SVGProps<SVGSVGElement> & { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 20.5h16" />
      <path d="M5 16.5 15.5 6a1.8 1.8 0 0 1 2.5 0l0 0a1.8 1.8 0 0 1 0 2.5L7.5 19H5z" />
    </svg>
  );
}

function PersonIcon({ filled, ...props }: SVGProps<SVGSVGElement> & { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="3.8" fill={filled ? "currentColor" : "none"} />
      <path d="M4.5 20c1.4-4 4-6 7.5-6s6.1 2 7.5 6" fill={filled ? "currentColor" : "none"} />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/", label: "ホーム", Icon: HomeIcon },
  { href: "/mission", label: "ミッション", Icon: TargetIcon },
  { href: "/gear", label: "機材図鑑", Icon: GuitarIcon },
  { href: "/review", label: "添削", Icon: EditIcon },
  { href: "/mypage", label: "マイページ", Icon: PersonIcon },
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
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const isActive = isNavActive(pathname, href);

            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] transition-colors ${
                    isActive
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  <Icon filled={isActive} className="h-6 w-6" />
                  <span className={isActive ? "font-semibold" : ""}>
                    {label}
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
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const isActive = isNavActive(pathname, href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-full px-3.5 py-2.5 text-[15px] transition-colors ${
                    isActive
                      ? "bg-orange-50 font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                      : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
                  }`}
                >
                  <Icon filled={isActive} className="h-6 w-6" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
