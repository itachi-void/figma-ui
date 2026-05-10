import { useState, useEffect, useRef, useCallback, startTransition } from 'react';
import { Search, X, Navigation, Users, MapPin, Route, BarChart3, Settings, Bell, Truck, Home } from 'lucide-react';
import { useNavigate } from 'react-router';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  icon: typeof Search;
  category: string;
}

const ALL_ITEMS: SearchResult[] = [
  { id: '1', title: 'Overview', subtitle: 'Dashboard home page', path: '/dashboard/overview', icon: Home, category: 'Pages' },
  { id: '2', title: 'Drivers', subtitle: 'Manage collection drivers', path: '/dashboard/drivers', icon: Truck, category: 'Pages' },
  { id: '3', title: 'Routes', subtitle: 'Plan and monitor routes with live map', path: '/dashboard/routes', icon: Route, category: 'Pages' },
  { id: '4', title: 'Citizens', subtitle: 'Citizen accounts and loyalty points', path: '/dashboard/citizens', icon: Users, category: 'Pages' },
  { id: '5', title: 'Analytics', subtitle: 'Charts, trends and predictive reports', path: '/dashboard/analytics', icon: BarChart3, category: 'Pages' },
  { id: '6', title: 'Smart Alerts', subtitle: 'System alerts and notifications', path: '/dashboard/smart-alerts', icon: Bell, category: 'Pages' },
  { id: '7', title: 'Centers', subtitle: 'Collection center management', path: '/dashboard/centers', icon: MapPin, category: 'Pages' },
  { id: '8', title: 'Performance', subtitle: 'Efficiency KPIs and metrics', path: '/dashboard/performance', icon: BarChart3, category: 'Pages' },
  { id: '9', title: 'Reports', subtitle: 'Export and generate reports', path: '/dashboard/reports', icon: Navigation, category: 'Pages' },
  { id: '10', title: 'Settings', subtitle: 'System and account settings', path: '/dashboard/settings', icon: Settings, category: 'Pages' },
  { id: '11', title: 'Ahmed Hassan', subtitle: 'Driver · DRV-001 · Active', path: '/dashboard/drivers', icon: Truck, category: 'Drivers' },
  { id: '12', title: 'Mohamed Ali', subtitle: 'Driver · DRV-002 · Active', path: '/dashboard/drivers', icon: Truck, category: 'Drivers' },
  { id: '13', title: 'Downtown Cairo Route', subtitle: 'RT-001 · Active · 12.3 km', path: '/dashboard/routes', icon: Route, category: 'Routes' },
  { id: '14', title: 'Maadi Route', subtitle: 'RT-004 · Completed · 10.8 km', path: '/dashboard/routes', icon: Route, category: 'Routes' },
];

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = query.length >= 1
    ? ALL_ITEMS.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : ALL_ITEMS.filter(item => item.category === 'Pages');

  const open = useCallback(() => { setIsOpen(true); setQuery(''); }, []);
  const close = useCallback(() => { setIsOpen(false); setQuery(''); }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 75);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? close() : open();
      }
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, open, close]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 13);
  }, [isOpen]);

  const handleSelect = (item: SearchResult) => {
    startTransition(() => navigate(item.path));
    close();
  };

  // Group results by category
  const grouped = results.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={open}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500 text-sm transition-all border border-gray-200 hover:scale-105 active:scale-95"
        title="Global Search (Ctrl+K)"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs text-gray-400 font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className={`fixed inset-0 bg-black/50 z-[9999] flex items-start justify-center pt-20 px-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          onClick={close}
        >
          <div
            className={`w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4'}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search pages, drivers, routes..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 text-gray-900 placeholder-gray-400 text-sm outline-none bg-transparent"
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 hover:bg-gray-100 rounded-md transition-all">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-400 font-mono">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto p-2">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-2">
                  <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">{category}</p>
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-green-50 group-hover:bg-green-100 flex items-center justify-center flex-shrink-0 transition-colors">
                          <Icon className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                          <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
              {results.length === 0 && (
                <div className="py-12 text-center">
                  <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No results for "{query}"</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>ESC close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}