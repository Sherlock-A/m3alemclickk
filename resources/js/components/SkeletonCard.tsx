export function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-4">
        {/* Header: avatar + name + info */}
        <div className="flex items-start gap-3">
          {/* Avatar circle */}
          <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />

          <div className="flex-1 min-w-0 space-y-2 pt-0.5">
            {/* Name */}
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-2/3" />
            {/* Profession */}
            <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2" />
            {/* City */}
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3" />
            {/* Category tags */}
            <div className="flex gap-1.5 pt-0.5">
              <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
              <div className="h-5 w-14 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>
          </div>

          {/* Favorite button */}
          <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
        </div>

        {/* Rating + status */}
        <div className="mt-3 flex items-center justify-between">
          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>

        {/* CTA buttons */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
