/**
 * Color System for RecycleHub Dashboard
 * Centralized color definitions for consistent theming across the application
 */

// Status Colors - للحالات المختلفة
export const statusColors = {
  success: {
    bg: 'bg-green-50 dark:bg-green-950/50',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
    gradient: 'from-green-500 via-emerald-500 to-green-600',
    icon: 'text-green-600 dark:text-green-400',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/50',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-800',
    gradient: 'from-yellow-500 via-amber-500 to-yellow-600',
    icon: 'text-yellow-600 dark:text-yellow-400',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950/50',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
    gradient: 'from-red-500 via-rose-500 to-red-600',
    icon: 'text-red-600 dark:text-red-400',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    gradient: 'from-blue-500 via-cyan-500 to-blue-600',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  neutral: {
    bg: 'bg-gray-50 dark:bg-gray-900/50',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700',
    gradient: 'from-gray-500 via-slate-500 to-gray-600',
    icon: 'text-gray-600 dark:text-gray-400',
  },
};

// Role-based Colors
export const roleColors = {
  admin: {
    primary: 'from-slate-500 via-gray-500 to-slate-600', // هادية ومحايدة
    secondary: 'from-blue-500 via-indigo-500 to-blue-600',
    accent: 'from-purple-500 via-violet-500 to-purple-600',
    bg: 'bg-slate-50 dark:bg-slate-950/50',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-800',
  },
  manager: {
    primary: 'from-emerald-500 via-teal-500 to-emerald-600', // واضحة للأداء
    secondary: 'from-blue-500 via-cyan-500 to-blue-600',
    accent: 'from-orange-500 via-amber-500 to-orange-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  user: {
    primary: 'from-emerald-500 via-teal-500 to-emerald-600', // مريحة
    secondary: 'from-blue-400 via-cyan-400 to-blue-500',
    accent: 'from-purple-400 via-violet-400 to-purple-500',
    bg: 'bg-teal-50 dark:bg-teal-950/50',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-200 dark:border-teal-800',
  },
};

// Typography Styles
export const typography = {
  h1: 'text-4xl md:text-5xl font-bold',
  h2: 'text-3xl md:text-4xl font-bold',
  h3: 'text-2xl md:text-3xl font-bold',
  h4: 'text-xl md:text-2xl font-bold',
  h5: 'text-lg md:text-xl font-semibold',
  h6: 'text-base md:text-lg font-semibold',
  body: 'text-base',
  bodyLarge: 'text-lg',
  bodySmall: 'text-sm',
  small: 'text-sm',
  tiny: 'text-xs',
  number: 'text-3xl md:text-4xl font-bold tabular-nums', // للأرقام
  numberLarge: 'text-4xl md:text-5xl font-bold tabular-nums',
  numberSmall: 'text-2xl md:text-3xl font-bold tabular-nums',
};

// Spacing System
export const spacing = {
  card: 'p-6',
  cardSmall: 'p-4',
  cardLarge: 'p-8',
  section: 'space-y-6',
  sectionSmall: 'space-y-4',
  sectionLarge: 'space-y-8',
  grid: 'gap-6',
  gridSmall: 'gap-4',
  gridLarge: 'gap-8',
  stack: 'flex flex-col gap-4',
  stackSmall: 'flex flex-col gap-2',
  stackLarge: 'flex flex-col gap-6',
};

// Button Variants
export const buttonVariants = {
  primary: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100',
  success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white',
  warning: 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white',
  danger: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white',
  ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
  outline: 'border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
};

// Card Variants
export const cardVariants = {
  default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm',
  elevated: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg',
  flat: 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl',
  gradient: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm',
  glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-sm',
};

// Badge Variants
export const badgeVariants = {
  success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800',
  error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800',
  info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
  neutral: 'bg-gray-100 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
  primary: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
};

// Collection Status Colors
export const collectionStatusColors = {
  pending: {
    ...statusColors.warning,
    label: 'Pending',
  },
  'in-progress': {
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    gradient: 'from-blue-500 via-cyan-500 to-blue-600',
    icon: 'text-blue-600 dark:text-blue-400',
    label: 'In Progress',
  },
  completed: {
    ...statusColors.success,
    label: 'Completed',
  },
  cancelled: {
    ...statusColors.error,
    label: 'Cancelled',
  },
};

// Recycling Center Status Colors
export const centerStatusColors = {
  active: {
    ...statusColors.success,
    label: 'Active',
  },
  inactive: {
    ...statusColors.neutral,
    label: 'Inactive',
  },
  maintenance: {
    ...statusColors.warning,
    label: 'Maintenance',
  },
};

// Driver Status Colors
export const driverStatusColors = {
  available: {
    ...statusColors.success,
    label: 'Available',
  },
  busy: {
    ...statusColors.warning,
    label: 'Busy',
  },
  offline: {
    ...statusColors.neutral,
    label: 'Offline',
  },
};

// Priority Colors
export const priorityColors = {
  low: {
    bg: 'bg-gray-50 dark:bg-gray-900/50',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700',
    icon: 'text-gray-600 dark:text-gray-400',
    label: 'Low',
  },
  medium: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/50',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    label: 'Medium',
  },
  high: {
    bg: 'bg-orange-50 dark:bg-orange-950/50',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800',
    icon: 'text-orange-600 dark:text-orange-400',
    label: 'High',
  },
  critical: {
    bg: 'bg-red-50 dark:bg-red-950/50',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    label: 'Critical',
  },
};

// Animation Classes
export const animations = {
  fadeIn: 'animate-fade-in',
  slideIn: 'animate-slide-in',
  slideUp: 'animate-slide-up',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  ping: 'animate-ping',
};

// Transition Classes
export const transitions = {
  fast: 'transition-all duration-150 ease-in-out',
  normal: 'transition-all duration-300 ease-in-out',
  slow: 'transition-all duration-500 ease-in-out',
  colors: 'transition-colors duration-200',
  transform: 'transition-transform duration-300',
  opacity: 'transition-opacity duration-200',
};

// Shadow Variants
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  inner: 'shadow-inner',
  none: 'shadow-none',
};

// Gradient Backgrounds
export const gradientBackgrounds = {
  primary: 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600',
  success: 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600',
  warning: 'bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-600',
  error: 'bg-gradient-to-br from-red-500 via-rose-500 to-pink-600',
  info: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600',
  dark: 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900',
  light: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
};

// Helper function to get status color
export function getStatusColor(status: string) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-');
  return collectionStatusColors[normalizedStatus as keyof typeof collectionStatusColors] || statusColors.neutral;
}

// Helper function to get role color
export function getRoleColor(role: string) {
  const normalizedRole = role.toLowerCase() as keyof typeof roleColors;
  return roleColors[normalizedRole] || roleColors.user;
}

// Helper function to get priority color
export function getPriorityColor(priority: string) {
  const normalizedPriority = priority.toLowerCase() as keyof typeof priorityColors;
  return priorityColors[normalizedPriority] || priorityColors.low;
}
