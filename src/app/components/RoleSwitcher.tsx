import { motion, AnimatePresence } from 'motion/react';
import { Shield, Users, Truck, User } from 'lucide-react';
import { useRole } from '@/app/contexts/RoleContext';

const roleConfigs = [
  {
    id: 'admin',
    label: 'Admin',
    icon: Shield,
    activeBg: 'bg-blue-500',
    activeText: 'text-white',
    inactiveBg: 'bg-blue-50',
    inactiveText: 'text-blue-700',
    hoverBg: 'hover:bg-blue-100',
  },
  {
    id: 'manager',
    label: 'Manager',
    icon: Users,
    activeBg: 'bg-purple-500',
    activeText: 'text-white',
    inactiveBg: 'bg-purple-50',
    inactiveText: 'text-purple-700',
    hoverBg: 'hover:bg-purple-100',
  },
  {
    id: 'driver',
    label: 'Driver',
    icon: Truck,
    activeBg: 'bg-green-500',
    activeText: 'text-white',
    inactiveBg: 'bg-green-50',
    inactiveText: 'text-green-700',
    hoverBg: 'hover:bg-green-100',
  },
  {
    id: 'citizen',
    label: 'Citizen',
    icon: User,
    activeBg: 'bg-orange-500',
    activeText: 'text-white',
    inactiveBg: 'bg-orange-50',
    inactiveText: 'text-orange-700',
    hoverBg: 'hover:bg-orange-100',
  },
] as const;

export default function RoleSwitcher() {
  const { role, setRole } = useRole();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-4"
      >
        <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
          Demo: Switch Role
        </div>
        
        <div className="flex gap-2">
          {roleConfigs.map((r) => {
            const Icon = r.icon;
            const isActive = role === r.id;

            return (
              <motion.button
                key={r.id}
                onClick={() => setRole(r.id as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? `${r.activeBg} ${r.activeText} shadow-lg`
                    : `${r.inactiveBg} ${r.inactiveText} ${r.hoverBg}`
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-bold">{r.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
