import { createBrowserRouter, Navigate } from 'react-router';
import { lazy } from 'react';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const CitizenPortalPage = lazy(() => import('./citizen-portal/CitizenPortalPage'));
const DashboardLayout = lazy(() => import('./dashboard/layout'));

// Dashboard Pages - Lazy loaded
const OverviewPage = lazy(() => import('./dashboard/overview/page'));
const SmartAlertsPage = lazy(() => import('./dashboard/smart-alerts/page'));
const ResourcesPage = lazy(() => import('./dashboard/resources/page'));
const PerformancePage = lazy(() => import('./dashboard/performance/page'));
const ReportsPage = lazy(() => import('./dashboard/reports/page'));
const DriversPage = lazy(() => import('./dashboard/drivers/page'));
const RoutesPage = lazy(() => import('./dashboard/routes/page'));
const CitizensPage = lazy(() => import('./dashboard/citizens/page'));
const CentersPage = lazy(() => import('./dashboard/centers/page'));
const AnalyticsPage = lazy(() => import('./dashboard/analytics/page'));
const SettingsPage = lazy(() => import('./dashboard/settings/page'));
const AdminPage = lazy(() => import('./dashboard/admin/page'));

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
          element: <Navigate to="/dashboard/overview" replace />,
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
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);
