type Props = {
  icon: string;
  title: string;
  description: string;
};

export default function ComingSoon({ icon, title, description }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center dark:border-neutral-700 dark:bg-neutral-900">
      <span aria-hidden className="text-4xl">
        {icon}
      </span>
      <h1 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
        {title}
      </h1>
      <p className="max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
      <span className="mt-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
        Coming Soon
      </span>
    </div>
  );
}
