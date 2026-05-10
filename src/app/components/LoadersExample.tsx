/**
 * SKELETON LOADING EXAMPLES
 * 
 * This file contains examples of how to use the skeleton loading components
 * throughout the RecycleHub application.
 */

import { useState, useEffect } from 'react';
import {
  PageLoader,
  OverviewPageLoader,
  TablePageLoader,
  StatsPageLoader,
  ChartPageLoader,
  ListPageLoader,
  FormPageLoader,
} from './PageLoader';

import {
  SectionLoader,
  CardSectionLoader,
  ListSectionLoader,
  ChartSectionLoader,
  TableSectionLoader,
} from './SectionLoader';

import {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonChart,
  SkeletonList,
  SkeletonForm,
  SkeletonPageHeader,
  SkeletonStatsGrid,
  SkeletonDashboardOverview,
} from './ui/skeleton';

// ==========================================
// EXAMPLE 1: Full Page Loading
// ==========================================
export function Example1_FullPageLoading() {
  return (
    <OverviewPageLoader>
      {/* Your actual page content */}
      <div>
        <h1>Dashboard Overview</h1>
        {/* Stats, charts, tables, etc. */}
      </div>
    </OverviewPageLoader>
  );
}

// ==========================================
// EXAMPLE 2: Table Page Loading
// ==========================================
export function Example2_TablePageLoading() {
  return (
    <TablePageLoader>
      {/* Your table content */}
      <div>
        <h1>Drivers Table</h1>
        <table>{/* table rows */}</table>
      </div>
    </TablePageLoader>
  );
}

// ==========================================
// EXAMPLE 3: Custom Page Loading with Custom Skeleton
// ==========================================
export function Example3_CustomPageLoading() {
  return (
    <PageLoader
      type="custom"
      customSkeleton={
        <div className="space-y-6">
          <SkeletonPageHeader />
          <SkeletonStatsGrid count={3} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonChart />
            <SkeletonList items={5} />
          </div>
        </div>
      }
      loadingTime={1000}
      simulatedDelay={1500}
    >
      {/* Your custom page content */}
      <div>Custom Page Content</div>
    </PageLoader>
  );
}

// ==========================================
// EXAMPLE 4: Section Loading with State Control
// ==========================================
export function Example4_SectionLoading() {
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(true);

  useEffect(() => {
    // Simulate fetching stats
    setTimeout(() => setIsLoadingStats(false), 1500);

    // Simulate fetching chart data
    setTimeout(() => setIsLoadingChart(false), 2000);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Section with Loading */}
      <CardSectionLoader isLoading={isLoadingStats} count={4}>
        <div className="grid grid-cols-4 gap-6">
          {/* Your stat cards */}
          <div>Stat 1</div>
          <div>Stat 2</div>
          <div>Stat 3</div>
          <div>Stat 4</div>
        </div>
      </CardSectionLoader>

      {/* Chart Section with Loading */}
      <ChartSectionLoader isLoading={isLoadingChart} height="h-80">
        <div>
          {/* Your chart component */}
          <h3>Performance Chart</h3>
        </div>
      </ChartSectionLoader>
    </div>
  );
}

// ==========================================
// EXAMPLE 5: List Loading
// ==========================================
export function Example5_ListLoading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1800);
  }, []);

  return (
    <ListSectionLoader isLoading={isLoading} items={6}>
      <div className="space-y-4">
        {/* Your list items */}
        <div>List Item 1</div>
        <div>List Item 2</div>
        <div>List Item 3</div>
      </div>
    </ListSectionLoader>
  );
}

// ==========================================
// EXAMPLE 6: Table Section Loading
// ==========================================
export function Example6_TableSectionLoading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  return (
    <TableSectionLoader isLoading={isLoading} rows={8} columns={5}>
      <table>
        {/* Your table content */}
      </table>
    </TableSectionLoader>
  );
}

// ==========================================
// EXAMPLE 7: Multiple Independent Sections
// ==========================================
export function Example7_MultipleIndependentSections() {
  const [loadingStates, setLoadingStates] = useState({
    header: true,
    stats: true,
    recentActivity: true,
    chart: true,
  });

  useEffect(() => {
    // Simulate different loading times for different sections
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, header: false }));
    }, 500);

    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, stats: false }));
    }, 1200);

    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, chart: false }));
    }, 1800);

    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, recentActivity: false }));
    }, 2200);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <SectionLoader isLoading={loadingStates.header} rows={1} height="h-16">
        <div className="flex justify-between items-center">
          <h1>Page Title</h1>
          <button>Action Button</button>
        </div>
      </SectionLoader>

      {/* Stats Cards */}
      <CardSectionLoader isLoading={loadingStates.stats} count={4}>
        <div className="grid grid-cols-4 gap-6">
          {/* Your stats */}
        </div>
      </CardSectionLoader>

      {/* Chart */}
      <ChartSectionLoader isLoading={loadingStates.chart}>
        <div>{/* Your chart */}</div>
      </ChartSectionLoader>

      {/* Recent Activity List */}
      <ListSectionLoader isLoading={loadingStates.recentActivity} items={5}>
        <div>{/* Your activity list */}</div>
      </ListSectionLoader>
    </div>
  );
}

// ==========================================
// EXAMPLE 8: Using Basic Skeleton Components Directly
// ==========================================
export function Example8_BasicSkeletons() {
  return (
    <div className="space-y-6">
      {/* Basic skeleton */}
      <Skeleton className="h-12 w-full" />

      {/* Circular skeleton (for avatars) */}
      <Skeleton variant="circular" className="h-16 w-16" />

      {/* Text skeleton */}
      <Skeleton variant="text" className="w-3/4" />

      {/* Multiple skeletons */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

/**
 * SHIMMER ANIMATION
 * 
 * All skeleton components automatically include a shimmer animation
 * that moves from left to right. This is defined in /src/styles/theme.css:
 * 
 * @keyframes shimmer {
 *   0% { transform: translateX(-100%); }
 *   100% { transform: translateX(100%); }
 * }
 * 
 * The animation creates a smooth, professional loading effect.
 */

/**
 * DARK MODE SUPPORT
 * 
 * All skeleton components support dark mode automatically:
 * - Light mode: bg-gray-200
 * - Dark mode: bg-gray-800
 * 
 * The shimmer effect is visible in both modes.
 */

/**
 * BEST PRACTICES
 * 
 * 1. Use PageLoader for entire pages (wraps route components)
 * 2. Use SectionLoader for individual sections that load independently
 * 3. Match skeleton structure to actual content layout
 * 4. Set appropriate loading times (800-1500ms typical)
 * 5. Consider staggered loading for better UX
 * 6. Always show skeleton in the same position as real content
 */
