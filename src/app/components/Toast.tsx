import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, X, AlertCircle, Info, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, isOpen, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
    },
    error: {
      icon: XCircle,
      color: 'from-red-500 to-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
    },
    warning: {
      icon: AlertCircle,
      color: 'from-yellow-500 to-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-900',
    },
    info: {
      icon: Info,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
    },
  };

  const { icon: Icon, color, bg, border, text } = config[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '50%' }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -50, x: '50%' }}
          className="fixed top-4 right-4 z-[100]"
        >
          <motion.div
            className={`flex items-center gap-3 ${bg} ${border} border rounded-xl shadow-lg px-4 py-3 min-w-[300px] max-w-md`}
            whileHover={{ scale: 1.02 }}
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            
            <p className={`flex-1 ${text} font-medium text-sm`}>{message}</p>
            
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/5 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to use toast
export function useToast() {
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: ToastType;
  }>({
    isOpen: false,
    message: '',
    type: 'info',
  });

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ isOpen: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, isOpen: false });
  };

  return { toast, showToast, hideToast };
}