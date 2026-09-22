"use client";

import { useState, type FormEvent } from "react";
import type { GearType, MyGearSlot } from "@/lib/types";

type Props = {
  gearType: GearType;
  label: string;
  gear: MyGearSlot | null;
  onSave: (
    gearType: GearType,
    values: { brand: string; category: string; modelName: string; comment: string }
  ) => void;
};

export default function GearSlotForm({ gearType, label, gear, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(!gear);
  const [brand, setBrand] = useState(gear?.brand ?? "");
  const [category, setCategory] = useState(gear?.category ?? "");
  const [modelName, setModelName] = useState(gear?.modelName ?? "");
  const [comment, setComment] = useState(gear?.comment ?? "");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!brand.trim() || !modelName.trim()) {
      setError("ブランドと機種名は入力してください");
      return;
    }

    onSave(gearType, {
      brand: brand.trim(),
      category: category.trim(),
      modelName: modelName.trim(),
      comment: comment.trim(),
    });
    setError("");
    setIsEditing(false);
  };

  if (!isEditing && gear) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            {label}
          </h3>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-xs font-medium text-orange-600 underline dark:text-orange-400"
          >
            編集
          </button>
        </div>
        <p className="font-bold text-neutral-900 dark:text-neutral-100">
          {gear.brand} {gear.modelName}
        </p>
        {gear.category && (
          <p className="text-xs text-neutral-400">{gear.category}</p>
        )}
        {gear.comment && (
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {gear.comment}
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        {label}
      </h3>

      <div className="flex flex-col gap-2.5">
        <input
          type="text"
          placeholder="ブランド(例: Fender)"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
        />
        <input
          type="text"
          placeholder="機種名(例: Stratocaster)"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
        />
        <input
          type="text"
          placeholder="カテゴリ(例: エレキギター)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
        />
        <textarea
          placeholder="コメント(任意)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          className="resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
        />

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            保存する
          </button>
          {gear && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            >
              キャンセル
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
