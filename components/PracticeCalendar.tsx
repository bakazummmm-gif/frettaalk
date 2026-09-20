"use client";

import { useMemo, useState } from "react";
import type { PracticeLogView } from "@/lib/types";

type Props = {
  logs: PracticeLogView[];
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function toDateKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function PracticeCalendar({ logs }: Props) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const now = new Date();
  const viewDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const totalsByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const log of logs) {
      const key = toDateKey(log.createdAt);
      map.set(key, (map.get(key) ?? 0) + log.minutes);
    }
    return map;
  }, [logs]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = new Date(year, month, 1).getDay();

  const cells: (number | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const selectedLogs = selectedDate
    ? logs.filter((log) => toDateKey(log.createdAt) === selectedDate)
    : [];

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonthOffset((m) => m - 1)}
          className="rounded-full px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          ←
        </button>
        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
          {year}年{month + 1}月
        </h2>
        <button
          type="button"
          onClick={() => setMonthOffset((m) => m + 1)}
          className="rounded-full px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-neutral-400">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />;
          }

          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;
          const minutes = totalsByDate.get(dateKey) ?? 0;
          const isSelected = dateKey === selectedDate;

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => setSelectedDate(isSelected ? null : dateKey)}
              className={`flex flex-col items-center rounded-lg py-1.5 text-xs transition-colors ${
                isSelected
                  ? "bg-orange-500 text-white"
                  : minutes > 0
                    ? "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400"
                    : "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              <span>{day}</span>
              {minutes > 0 && (
                <span className="text-[10px] leading-none">{minutes}分</span>
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-4 border-t border-neutral-200 pt-3 dark:border-neutral-800">
          <p className="mb-2 text-xs font-semibold text-neutral-500">
            {selectedDate} の記録
          </p>
          {selectedLogs.length === 0 ? (
            <p className="text-xs text-neutral-400">記録がありません</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {selectedLogs.map((log) => (
                <li
                  key={log.id}
                  className="rounded-lg bg-neutral-50 p-2 text-sm dark:bg-neutral-950"
                >
                  <p className="font-semibold text-orange-600 dark:text-orange-400">
                    {log.minutes}分
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {log.memo}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
