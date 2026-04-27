import { useState, useEffect, ReactNode } from "react";
import {
  SkeletonDashboardOverview,
  SkeletonTable,
  SkeletonStatsGrid,
  SkeletonChart,
  SkeletonList,
  SkeletonForm,
  SkeletonPageHeader,
} from "./ui/skeleton";

interface PageLoaderProps {
  children: ReactNode;
  type?: "dashboard" | "table" | "stats" | "chart" | "list" | "form" | "custom";
  customSkeleton?: ReactNode;
  loadingTime?: number; // Minimum time to show skeleton (ms)
  simulatedDelay?: number; // Simulated data fetch delay (ms)
}

export function PageLoader({
  children,
  type = "dashboard",
  customSkeleton,
  loadingTime = 800,
  simulatedDelay = 1200,
}: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();

    const fetchTimer = setTimeout(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, loadingTime - elapsed);

      setTimeout(() => {
        setIsLoading(false);
      }, remaining);
    }, simulatedDelay);

    return () => clearTimeout(fetchTimer);
  }, [loadingTime, simulatedDelay]);

  if (isLoading) {
    if (customSkeleton) {
      return <>{customSkeleton}</>;
    }

    // Return appropriate skeleton based on type
    switch (type) {
      case "dashboard":
        return <SkeletonDashboardOverview />;
      case "table":
        return (
          <div className="space-y-6">
            <SkeletonPageHeader />
            <SkeletonTable rows={8} columns={5} />
          </div>
        );
      case "stats":
        return (
          <div className="space-y-6">
            <SkeletonPageHeader />
            <SkeletonStatsGrid count={4} />
          </div>
        );
      case "chart":
        return (
          <div className="space-y-6">
            <SkeletonPageHeader />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonChart />
              <SkeletonChart />
            </div>
          </div>
        );
      case "list":
        return (
          <div className="space-y-6">
            <SkeletonPageHeader />
            <SkeletonList items={6} />
          </div>
        );
      case "form":
        return (
          <div className="space-y-6">
            <SkeletonPageHeader />
            <SkeletonForm fields={6} />
          </div>
        );
      default:
        return <SkeletonDashboardOverview />;
    }
  }

  return <>{children}</>;
}

// Specific page loaders for common layouts
export function OverviewPageLoader({ children }: { children: ReactNode }) {
  return (
    <PageLoader type="dashboard" loadingTime={2000} simulatedDelay={8000}>
      {children}
    </PageLoader>
  );
}

export function TablePageLoader({ children }: { children: ReactNode }) {
  return (
    <PageLoader type="table" loadingTime={2000} simulatedDelay={8000}>
      {children}
    </PageLoader>
  );
}

export function StatsPageLoader({ children }: { children: ReactNode }) {
  return (
    <PageLoader type="stats" loadingTime={2000} simulatedDelay={8000}>
      {children}
    </PageLoader>
  );
}

export function ChartPageLoader({ children }: { children: ReactNode }) {
  return (
    <PageLoader type="chart" loadingTime={2000} simulatedDelay={8000}>
      {children}
    </PageLoader>
  );
}

export function ListPageLoader({ children }: { children: ReactNode }) {
  return (
    <PageLoader type="list" loadingTime={2000} simulatedDelay={8000}>
      {children}
    </PageLoader>
  );
}

export function FormPageLoader({ children }: { children: ReactNode }) {
  return (
    <PageLoader type="form" loadingTime={2000} simulatedDelay={8000}>
      {children}
    </PageLoader>
  );
}
