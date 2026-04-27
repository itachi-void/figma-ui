import { createBrowserRouter, redirect } from 'react-router';
import { lazy } from 'react';

// Helper function to add 0.5 second delay to lazy loading
const lazyWithDelay = (importFunc: () => Promise<any>) => {
  return lazy(() =>
    Promise.all([
      importFunc(),
      new Promise(resolve => setTimeout(resolve, 500))
    ]).then(([moduleExports]) => moduleExports)
  );
};

// Lazy load pages for better performance with 0.5 second delay
const LandingPage = lazyWithDelay(() => import('./pages/LandingPage'));
const CitizenPortalPage = lazyWithDelay(() => import('./citizen-portal/CitizenPortalPage'));
const NotFoundPage = lazyWithDelay(() => import('./pages/NotFound'));

// Dashboard layout
const DashboardLayout = lazyWithDelay(() => import('./dashboard/layout'));

// Dashboard Pages - Lazy loaded from dashboard folder structure with 0.5 second delay
const OverviewPage = lazyWithDelay(() => import('./dashboard/overview/page'));
const SmartAlertsPage = lazyWithDelay(() => import('./dashboard/smart-alerts/page'));
const ResourcesPage = lazyWithDelay(() => import('./dashboard/resources/page'));
const PerformancePage = lazyWithDelay(() => import('./dashboard/performance/page'));
const ReportsPage = lazyWithDelay(() => import('./dashboard/reports/page'));
const DriversPage = lazyWithDelay(() => import('./dashboard/drivers/page'));
const RoutesPage = lazyWithDelay(() => import('./dashboard/routes/page'));
const CitizensPage = lazyWithDelay(() => import('./dashboard/citizens/page'));
const CentersPage = lazyWithDelay(() => import('./dashboard/centers/page'));
const AnalyticsPage = lazyWithDelay(() => import('./dashboard/analytics/page'));
const SettingsPage = lazyWithDelay(() => import('./dashboard/settings/page'));
const AdminPage = lazyWithDelay(() => import('./dashboard/admin/page'));
const FleetMapPage = lazyWithDelay(() => import('./dashboard/fleet-map/page'));
const CommunitiesPage = lazyWithDelay(() => import('./dashboard/communities/page'));

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: LandingPage,
    },
    {
      path: '/citizen-portal',
      Component: CitizenPortalPage,
    },
    {
      path: '/dashboard',
      Component: DashboardLayout,
      children: [
        {
          index: true,
          loader: () => redirect('/dashboard/overview'),
        },
        {
          path: 'overview',
          Component: OverviewPage,
        },
        {
          path: 'smart-alerts',
          Component: SmartAlertsPage,
        },
        {
          path: 'resources',
          Component: ResourcesPage,
        },
        {
          path: 'performance',
          Component: PerformancePage,
        },
        {
          path: 'reports',
          Component: ReportsPage,
        },
        {
          path: 'drivers',
          Component: DriversPage,
        },
        {
          path: 'routes',
          Component: RoutesPage,
        },
        {
          path: 'citizens',
          Component: CitizensPage,
        },
        {
          path: 'centers',
          Component: CentersPage,
        },
        {
          path: 'analytics',
          Component: AnalyticsPage,
        },
        {
          path: 'settings',
          Component: SettingsPage,
        },
        {
          path: 'admin',
          Component: AdminPage,
        },
        {
          path: 'fleet-map',
          Component: FleetMapPage,
        },
        {
          path: 'communities',
          Component: CommunitiesPage,
        },
      ],
    },
    {
      path: '*',
      Component: NotFoundPage,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);