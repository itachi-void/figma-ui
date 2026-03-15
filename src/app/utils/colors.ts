// Status Colors - للحالات المختلفة
export const statusColors = {
  success: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    gradient: 'from-green-500 via-emerald-500 to-green-600',
    icon: 'text-green-600',
  },
  warning: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    gradient: 'from-yellow-500 via-amber-500 to-yellow-600',
    icon: 'text-yellow-600',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    gradient: 'from-red-500 via-rose-500 to-red-600',
    icon: 'text-red-600',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    gradient: 'from-blue-500 via-cyan-500 to-blue-600',
    icon: 'text-blue-600',
  },
  neutral: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    gradient: 'from-gray-500 via-slate-500 to-gray-600',
    icon: 'text-gray-600',
  },
};

// Role-based Colors
export const roleColors = {
  admin: {
    primary: 'from-slate-500 via-gray-500 to-slate-600', // هادية ومحايدة
    secondary: 'from-blue-500 via-indigo-500 to-blue-600',
    accent: 'from-purple-500 via-violet-500 to-purple-600',
  },
  manager: {
    primary: 'from-emerald-500 via-teal-500 to-emerald-600', // واضحة للأداء
    secondary: 'from-blue-500 via-cyan-500 to-blue-600',
    accent: 'from-orange-500 via-amber-500 to-orange-600',
  },
  user: {
    primary: 'from-emerald-500 via-teal-500 to-emerald-600', // مريحة
    secondary: 'from-blue-400 via-cyan-400 to-blue-500',
    accent: 'from-purple-400 via-violet-400 to-purple-500',
  },
};

// Typography Styles
export const typography = {
  h1: 'text-4xl md:text-5xl font-bold',
  h2: 'text-3xl md:text-4xl font-bold',
  h3: 'text-2xl md:text-3xl font-bold',
  h4: 'text-xl md:text-2xl font-bold',
  h5: 'text-lg md:text-xl font-semibold',
  body: 'text-base',
  small: 'text-sm',
  tiny: 'text-xs',
  number: 'text-3xl md:text-4xl font-bold tabular-nums', // للأرقام
};

// Spacing System
export const spacing = {
  card: 'p-6',
  cardSmall: 'p-4',
  section: 'space-y-6',
  grid: 'gap-6',
  gridSmall: 'gap-4',
};
