import { Navigate } from 'react-router';
import { useRole } from '@/app/contexts/RoleContext';
import { ReactNode } from 'react';

// Define which roles can access which routes
const routePermissions: Record<string, string[]> = {
  '/dashboard/overview': ['admin', 'manager', 'driver', 'citizen'],
  '/dashboard/smart-alerts': ['admin', 'manager'],
  '/dashboard/resources': ['admin'],
  '/dashboard/performance': ['admin', 'manager'],
  '/dashboard/reports': ['admin', 'manager'],
  '/dashboard/drivers': ['admin', 'manager'],
  '/dashboard/routes': ['admin', 'manager', 'driver'],
  '/dashboard/citizens': ['admin', 'manager'],
  '/dashboard/centers': ['admin', 'manager', 'driver'],
  '/dashboard/analytics': ['admin', 'manager'],
  '/dashboard/fleet-map': ['admin', 'manager', 'driver', 'citizen'],
  '/dashboard/communities': ['admin', 'citizen'],
  '/dashboard/pickup-requests': ['admin', 'manager', 'citizen'],
  '/dashboard/settings': ['admin', 'manager', 'driver', 'citizen'],
  '/dashboard/admin': ['admin'],
};

export function RouteGuard({ children, path }: { children: ReactNode; path: string }) {
  const { role } = useRole();
  const allowedRoles = routePermissions[path];

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard/overview" replace />;
  }

  return <>{children}</>;
}
