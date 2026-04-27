import { cn } from "./utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular" | "text";
}

export function Skeleton({
  className,
  variant = "default",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-200 dark:bg-gray-800",
        "before:absolute before:inset-0",
        "before:-translate-x-full",
        "before:animate-shimmer",
        "before:bg-gradient-to-r",
        "before:from-transparent before:via-white/80 dark:before:via-white/30 before:to-transparent",
        variant === "circular" && "rounded-full",
        variant === "text" && "rounded-md h-4",
        variant === "default" && "rounded-lg",
        className,
      )}
      {...props}
    />
  );
}

// Card Skeleton for dashboard cards
export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton variant="circular" className="h-10 w-10" />
      </div>
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-4 w-40" />
    </div>
  );
}

// Table Skeleton
export function SkeletonTable({
  rows,
  columns,
}: {
  rows?: number;
  columns?: number;
}) {
  const rowsCount = rows ?? 5;
  const columnsCount = columns ?? 4;
  const gridTemplateStyle = `repeat(${columnsCount}, 1fr)`;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: gridTemplateStyle }}
        >
          {Array.from({ length: columnsCount }).map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-5 w-full" />
          ))}
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: rowsCount }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="border-b border-gray-200 dark:border-gray-800 p-4 last:border-0"
        >
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: gridTemplateStyle }}
          >
            {Array.from({ length: columnsCount }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-4 w-full"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Chart Skeleton
export function SkeletonChart({ height }: { height?: string }) {
  const heightClass = height ?? "h-64";
  const fullClassName = `w-full ${heightClass}`;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
      <Skeleton className="h-6 w-40 mb-6" />
      <Skeleton className={fullClassName} />
    </div>
  );
}

// Stats Grid Skeleton
export function SkeletonStatsGrid({ count }: { count?: number }) {
  const itemsCount = count ?? 4;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: itemsCount }).map((_, i) => (
        <SkeletonCard key={`stat-${i}`} />
      ))}
    </div>
  );
}

// List Skeleton
export function SkeletonList({ items }: { items?: number }) {
  const itemsCount = items ?? 5;
  return (
    <div className="space-y-4">
      {Array.from({ length: itemsCount }).map((_, i) => (
        <div
          key={`list-item-${i}`}
          className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 flex items-center gap-4"
        >
          <Skeleton variant="circular" className="h-12 w-12 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

// Form Skeleton
export function SkeletonForm({ fields }: { fields?: number }) {
  const fieldsCount = fields ?? 4;
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 space-y-6">
      {Array.from({ length: fieldsCount }).map((_, i) => (
        <div key={`form-field-${i}`} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-4 pt-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

// Page Header Skeleton
export function SkeletonPageHeader() {
  return (
    <div className="mb-8">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-5 w-96" />
    </div>
  );
}

// Dashboard Overview Skeleton
export function SkeletonDashboardOverview() {
  return (
    <div className="space-y-6">
      <SkeletonPageHeader />
      <SkeletonStatsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      <SkeletonTable />
    </div>
  );
}
