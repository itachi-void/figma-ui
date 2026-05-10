import { ReactNode } from "react";
import { Skeleton } from "./ui/skeleton";

interface SectionLoaderProps {
  isLoading: boolean;
  children: ReactNode;
  skeleton?: ReactNode;
  rows?: number;
  height?: string;
}

/**
 * Wrapper for individual sections with loading state
 * Use this when you need granular control over specific sections
 */
export function SectionLoader({
  isLoading,
  children,
  skeleton,
  rows = 3,
  height = "h-24",
}: SectionLoaderProps) {
  if (isLoading) {
    if (skeleton) {
      return <>{skeleton}</>;
    }

    // Default skeleton
    return (
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className={`w-full ${height}`} />
        ))}
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Card Section Loader
 */
export function CardSectionLoader({
  isLoading,
  children,
  count = 3,
}: {
  isLoading: boolean;
  children: ReactNode;
  count?: number;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton variant="circular" className="h-10 w-10" />
            </div>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * List Section Loader
 */
export function ListSectionLoader({
  isLoading,
  children,
  items = 5,
}: {
  isLoading: boolean;
  children: ReactNode;
  items?: number;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: items }).map((_, i) => (
          <div
            key={i}
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

  return <>{children}</>;
}

/**
 * Chart Section Loader
 */
export function ChartSectionLoader({
  isLoading,
  children,
  height = "h-64",
}: {
  isLoading: boolean;
  children: ReactNode;
  height?: string;
}) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <Skeleton className="h-6 w-40 mb-6" />
        <Skeleton className={`w-full ${height}`} />
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Table Section Loader
 */
export function TableSectionLoader({
  isLoading,
  children,
  rows = 5,
  columns = 4,
}: {
  isLoading: boolean;
  children: ReactNode;
  rows?: number;
  columns?: number;
}) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 p-4">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="border-b border-gray-200 dark:border-gray-800 p-4 last:border-0"
          >
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <>{children}</>;
}
