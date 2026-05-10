import { RouterProvider } from 'react-router';
import { RoleProvider } from './contexts/RoleContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { ActivityLogProvider } from './contexts/ActivityLogContext';
import { ChatProvider } from './contexts/ChatContext';
import { WalletProvider } from './contexts/WalletContext';
import { TicketsProvider } from './contexts/TicketsContext';
import { PickupProvider } from './contexts/PickupContext';
import { DriversProvider } from './contexts/DriversContext';
import { B2BProvider } from './contexts/B2BContext';
import { AlertsConfigProvider } from './contexts/AlertsConfigContext';

export default function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <RoleProvider>
          <AlertsConfigProvider>
            <WalletProvider>
              <TicketsProvider>
                <NotificationsProvider>
                  <ActivityLogProvider>
                    <ChatProvider>
                      <DriversProvider>
                        <PickupProvider>
                          <B2BProvider>
                            <Suspense fallback={
                              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
                                <LoadingSpinner />
                              </div>
                            }>
                              <RouterProvider router={router} />
                            </Suspense>
                            <Toaster />
                          </B2BProvider>
                        </PickupProvider>
                      </DriversProvider>
                    </ChatProvider>
                  </ActivityLogProvider>
                </NotificationsProvider>
              </TicketsProvider>
            </WalletProvider>
          </AlertsConfigProvider>
        </RoleProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}