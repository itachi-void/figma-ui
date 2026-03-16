import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

export interface ActivityEntry {
  id: string;
  action: string;
  user: string;
  userRole: 'admin' | 'driver' | 'citizen' | 'system';
  target: string;
  details: string;
  timestamp: Date;
  category: 'route' | 'driver' | 'citizen' | 'system' | 'alert' | 'collection';
  severity: 'low' | 'medium' | 'high';
}

interface ActivityLogContextType {
  activities: ActivityEntry[];
  logActivity: (a: Omit<ActivityEntry, 'id' | 'timestamp'>) => void;
}

const ActivityLogContext = createContext<ActivityLogContextType | null>(null);

const INITIAL_ACTIVITIES: ActivityEntry[] = [
  { id: '1', action: 'Route Started', user: 'Ahmed Hassan', userRole: 'driver', target: 'RT-001 Downtown Cairo', details: 'Driver started collection route through Tahrir Square area', timestamp: new Date(Date.now() - 2 * 60000), category: 'route', severity: 'low' },
  { id: '2', action: 'Route Completed', user: 'Youssef Mahmoud', userRole: 'driver', target: 'RT-004 Maadi Route', details: 'Completed 18 stops, collected 54 collection points', timestamp: new Date(Date.now() - 8 * 60000), category: 'route', severity: 'low' },
  { id: '3', action: 'New Pickup Request', user: 'Sara Mohamed', userRole: 'citizen', target: 'Zamalek Zone', details: 'Requested pickup of 12 bottles from 26th July Street', timestamp: new Date(Date.now() - 15 * 60000), category: 'collection', severity: 'low' },
  { id: '4', action: 'Capacity Alert', user: 'System', userRole: 'system', target: 'Nasr City Center', details: 'Collection center reached 90% capacity – auto-alert dispatched', timestamp: new Date(Date.now() - 22 * 60000), category: 'alert', severity: 'high' },
  { id: '5', action: 'Driver Status Changed', user: 'Admin', userRole: 'admin', target: 'Karim Said', details: 'Changed status from available to on-leave', timestamp: new Date(Date.now() - 35 * 60000), category: 'driver', severity: 'medium' },
  { id: '6', action: 'Citizen Registered', user: 'System', userRole: 'system', target: 'New Citizen', details: 'Ahmed Mostafa registered from Giza – Bronze tier assigned', timestamp: new Date(Date.now() - 50 * 60000), category: 'citizen', severity: 'low' },
  { id: '7', action: 'Route Cancelled', user: 'Admin', userRole: 'admin', target: 'RT-005 Giza Route', details: 'Route cancelled due to vehicle maintenance issue', timestamp: new Date(Date.now() - 65 * 60000), category: 'route', severity: 'high' },
  { id: '8', action: 'Loyalty Points Awarded', user: 'System', userRole: 'system', target: 'Ahmed Hassan (citizen)', details: '500 points awarded for reaching 1250 bottles milestone', timestamp: new Date(Date.now() - 80 * 60000), category: 'citizen', severity: 'low' },
  { id: '9', action: 'Export Generated', user: 'Admin', userRole: 'admin', target: 'Monthly Report', details: 'PDF report exported for February 2026', timestamp: new Date(Date.now() - 95 * 60000), category: 'system', severity: 'low' },
  { id: '10', action: 'Driver Rating', user: 'Omar Ali', userRole: 'citizen', target: 'Mohamed Ali', details: 'Citizen rated driver 5⭐ after Zamalek pickup', timestamp: new Date(Date.now() - 110 * 60000), category: 'driver', severity: 'low' },
];

export function ActivityLogProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<ActivityEntry[]>(INITIAL_ACTIVITIES);
  const idRef = useRef(200);

  const logActivity = useCallback((a: Omit<ActivityEntry, 'id' | 'timestamp'>) => {
    setActivities(prev => [{
      ...a,
      id: String(++idRef.current),
      timestamp: new Date(),
    }, ...prev.slice(0, 99)]);
  }, []);

  return (
    <ActivityLogContext.Provider value={{ activities, logActivity }}>
      {children}
    </ActivityLogContext.Provider>
  );
}

export function useActivityLog() {
  const ctx = useContext(ActivityLogContext);
  if (!ctx) throw new Error('useActivityLog must be used within ActivityLogProvider');
  return ctx;
}
