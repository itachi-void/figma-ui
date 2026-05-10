import { CheckCircle, X, AlertCircle, Info, CircleX } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, isOpen, onClose, duration = 750 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 75);
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
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
      icon: CircleX,
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

  if (!isOpen) return null;

  return (
    <div className={`fixed top-4 right-4 z-[100] transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className={`flex items-center gap-3 ${bg} ${border} border rounded-xl shadow-lg px-4 py-3 min-w-[300px] max-w-md transition-transform hover:scale-105`}>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        
        <p className={`flex-1 ${text} font-medium text-sm`}>{message}</p>
        
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 75);
          }}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/5 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
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