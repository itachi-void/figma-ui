import { createContext, useContext, useState, useCallback, useRef, ReactNode, useEffect } from 'react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'driver' | 'route' | 'citizen' | 'system' | 'alert';
  timestamp: Date;
  read: boolean;
  icon?: string;
}

interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1', title: 'Ahmed Hassan Started Route', message: 'Driver Ahmed Hassan started Downtown Cairo Route #12', type: 'info', category: 'driver', timestamp: new Date(Date.now() - 2 * 60000), read: false, icon: '🚛',
  },
  {
    id: '2', title: 'New Pickup Request', message: 'New pickup request from Zamalek area – 12 bottles', type: 'success', category: 'citizen', timestamp: new Date(Date.now() - 5 * 60000), read: false, icon: '📦',
  },
  {
    id: '3', title: 'Route Completed', message: 'Mohamed Ali completed Maadi – Road 9 route successfully', type: 'success', category: 'route', timestamp: new Date(Date.now() - 10 * 60000), read: false, icon: '✅',
  },
  {
    id: '4', title: 'System Alert', message: 'Collection center in Nasr City is at 90% capacity', type: 'warning', category: 'alert', timestamp: new Date(Date.now() - 20 * 60000), read: true, icon: '⚠️',
  },
  {
    id: '5', title: 'New Citizen Registered', message: 'Sara Mohamed joined RecycleHub from Giza', type: 'info', category: 'citizen', timestamp: new Date(Date.now() - 35 * 60000), read: true, icon: '👤',
  },
];

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const idRef = useRef(100);

  // Simulate real-time notifications
  useEffect(() => {
    const LIVE_MESSAGES = [
      { title: 'Driver Location Updated', message: 'Omar Khaled is now in Dokki area', type: 'info' as const, category: 'driver' as const, icon: '📍' },
      { title: 'Pickup Completed', message: '18 bottles collected from Heliopolis zone', type: 'success' as const, category: 'route' as const, icon: '✅' },
      { title: 'New Citizen Points', message: 'Ahmed Hassan earned 500 loyalty points', type: 'success' as const, category: 'citizen' as const, icon: '🏆' },
      { title: 'Route Deviation', message: 'Karim Said deviated from planned route', type: 'warning' as const, category: 'alert' as const, icon: '⚠️' },
      { title: 'Collection Center Full', message: 'Giza center is at 95% capacity – dispatch needed', type: 'error' as const, category: 'alert' as const, icon: '🔴' },
    ];

    const interval = setInterval(() => {
      const msg = LIVE_MESSAGES[Math.floor(Math.random() * LIVE_MESSAGES.length)];
      setNotifications(prev => [{
        ...msg,
        id: String(++idRef.current),
        timestamp: new Date(),
        read: false,
      }, ...prev.slice(0, 29)]);
    }, 25000); // New notification every 25 seconds

    return () => clearInterval(interval);
  }, []);

  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications(prev => [{
      ...n,
      id: String(++idRef.current),
      timestamp: new Date(),
      read: false,
    }, ...prev.slice(0, 29)]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}
