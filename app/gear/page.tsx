"use client";

import Link from "next/link";
import GearSlotForm from "@/components/GearSlotForm";
import GearCard from "@/components/GearCard";
import { useGear } from "@/lib/useGear";
import { useCurrentUser } from "@/lib/userStore";

export default function GearPage() {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const { myGear, allGear, isReady, error, saveGear, saveGearImage } = useGear();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
        機材図鑑
      </h1>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500 dark:bg-red-500/10">
          {error}
        </p>
      )}

      {!isUserLoading &&
        (user ? (
          <div className="flex flex-col gap-3">
            <GearSlotForm
              gearType="first"
              label="メイン機材"
              gear={myGear.first}
              onSave={saveGear}
              onImageSelect={saveGearImage}
            />
            <GearSlotForm
              gearType="second"
              label="サブ機材"
              gear={myGear.second}
              onSave={saveGear}
              onImageSelect={saveGearImage}
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-4 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
            <Link
              href="/login"
              className="font-semibold text-orange-600 underline"
            >
              ログイン
            </Link>
            すると自分の機材を登録できます
          </div>
        ))}

      <h2 className="mt-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        みんなの機材
      </h2>

      <div className="flex flex-col">
        {!isReady && (
          <p className="py-8 text-center text-sm text-neutral-400">
            読み込み中...
          </p>
        )}

        {isReady && allGear.length === 0 && !error && (
          <p className="py-8 text-center text-sm text-neutral-400">
            まだ機材が登録されていません
          </p>
        )}

        {allGear.map((gear) => (
          <GearCard key={gear.id} gear={gear} />
        ))}
      </div>
    </div>
  );
}
