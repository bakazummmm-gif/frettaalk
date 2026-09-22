import Avatar from "@/components/Avatar";
import type { GearListItem } from "@/lib/types";

const GEAR_TYPE_LABEL: Record<string, string> = {
  first: "メイン",
  second: "サブ",
};

type Props = {
  gear: GearListItem;
};

export default function GearCard({ gear }: Props) {
  return (
    <div className="flex gap-3 border-b border-neutral-100 px-1 py-4 last:border-none dark:border-neutral-800">
      <Avatar name={gear.author} src={gear.authorAvatarUrl} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            {gear.author}
          </p>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            {GEAR_TYPE_LABEL[gear.gearType]}
          </span>
        </div>

        <div className="mt-1.5 flex gap-3">
          {gear.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={gear.imageUrl}
              alt={gear.modelName}
              className="h-16 w-16 shrink-0 rounded-xl object-cover"
            />
          )}

          <div className="min-w-0 flex-1">
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
        </div>
      </div>
    </div>
  );
}
