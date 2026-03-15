import { RouterProvider } from 'react-router';
import { RoleProvider } from './contexts/RoleContext';
import { Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import { router } from './routes';

export default function App() {
  return (
    <RoleProvider>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
          <LoadingSpinner />
        </div>
      }>
        <RouterProvider router={router} />
      </Suspense>
    </RoleProvider>
  );
}