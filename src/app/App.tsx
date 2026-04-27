import { RouterProvider } from 'react-router';
import { RoleProvider } from '@/app/contexts/RoleContext';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { Suspense } from 'react';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { router } from '@/app/routes';
import { Toaster } from '@/app/components/ui/sonner';
import { NotificationsProvider } from '@/app/contexts/NotificationsContext';
import { ActivityLogProvider } from '@/app/contexts/ActivityLogContext';
import { ChatProvider } from '@/app/contexts/ChatContext';
import { WalletProvider } from '@/app/contexts/WalletContext';
import { TicketsProvider } from '@/app/contexts/TicketsContext';
import { SidebarProvider } from '@/app/contexts/SidebarContext';

export default function App() {
  return (
    <ThemeProvider>
      <RoleProvider>
        <WalletProvider>
          <TicketsProvider>
            <NotificationsProvider>
              <ActivityLogProvider>
                <ChatProvider>
                  <SidebarProvider>
                    <Suspense fallback={
                      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
                        <LoadingSpinner />
                      </div>
                    }>
                      <RouterProvider router={router} />
                    </Suspense>
                    <Toaster />
                  </SidebarProvider>
                </ChatProvider>
              </ActivityLogProvider>
            </NotificationsProvider>
          </TicketsProvider>
        </WalletProvider>
      </RoleProvider>
    </ThemeProvider>
  );
}