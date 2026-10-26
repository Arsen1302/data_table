const SKELETON_ROWS = Array.from({ length: 10 }, (_, index) => index);

export const UnitsTableSkeleton = () => (
  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
    <div className="h-11 bg-slate-50 dark:bg-slate-900" />
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {SKELETON_ROWS.map((row) => (
        <div key={row} className="flex items-center gap-6 px-4 py-4">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 flex-1 animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  </div>
);
