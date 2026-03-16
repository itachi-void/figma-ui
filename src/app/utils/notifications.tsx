import { toast } from 'sonner';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const CriticalToast = ({ title, message, actionLabel, onAction }: any) => (
  <div className="flex flex-col gap-2 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl shadow-lg w-full">
    <div className="flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-bold text-red-900 dark:text-red-200">{title}</h3>
        <p className="text-sm text-red-700 dark:text-red-300 mt-1">{message}</p>
      </div>
    </div>
    {actionLabel && (
      <button 
        onClick={onAction}
        className="mt-2 w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

const WarningToast = ({ title, message }: any) => (
  <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900 rounded-xl shadow-lg w-full">
    <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
    <div className="flex-1">
      <h3 className="font-bold text-orange-900 dark:text-orange-200">{title}</h3>
      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">{message}</p>
    </div>
  </div>
);

const SuccessToast = ({ title, message }: any) => (
  <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl shadow-lg w-full">
    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
    <div className="flex-1">
      <h3 className="font-bold text-emerald-900 dark:text-emerald-200">{title}</h3>
      <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">{message}</p>
    </div>
  </div>
);

const InfoToast = ({ title, message }: any) => (
  <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-xl shadow-lg w-full">
    <Info className="w-5 h-5 text-blue-500 mt-0.5" />
    <div className="flex-1">
      <h3 className="font-bold text-blue-900 dark:text-blue-200">{title}</h3>
      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">{message}</p>
    </div>
  </div>
);

export const notify = {
  critical: (title: string, message: string, actionLabel?: string, onAction?: () => void) => {
    toast.custom((t) => (
      <CriticalToast 
        title={title} 
        message={message} 
        actionLabel={actionLabel} 
        onAction={() => {
          onAction?.();
          toast.dismiss(t);
        }} 
      />
    ), { duration: 6000 });
  },
  warning: (title: string, message: string) => {
    toast.custom(() => <WarningToast title={title} message={message} />, { duration: 4000 });
  },
  success: (title: string, message: string) => {
    toast.custom(() => <SuccessToast title={title} message={message} />, { duration: 3000 });
  },
  info: (title: string, message: string) => {
    toast.custom(() => <InfoToast title={title} message={message} />, { duration: 3000 });
  },
  // Backward compatibility methods for the rest of the app
  error: (title: string, message?: string) => {
    toast.custom((t) => (
      <CriticalToast title={title} message={message || 'An error occurred'} onAction={() => toast.dismiss(t)} />
    ), { duration: 6000 });
  }
};
