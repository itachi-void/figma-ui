import { motion } from "motion/react";
import { X, Check } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  availableWidgets: any[];
  hiddenWidgets: string[];
  setHiddenWidgets: (widgets: string[]) => void;
}

export default function WidgetCustomizerModal({ isOpen, onClose, availableWidgets, hiddenWidgets, setHiddenWidgets }: Props) {
  if (!isOpen) return null;

  const toggleWidget = (label: string) => {
    if (hiddenWidgets.includes(label)) {
      setHiddenWidgets(hiddenWidgets.filter(w => w !== label));
    } else {
      setHiddenWidgets([...hiddenWidgets, label]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Customize Dashboard</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-500 mb-4">Select which metrics you want to display on your dashboard overview.</p>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {availableWidgets.map((widget) => {
              const isVisible = !hiddenWidgets.includes(widget.label);
              return (
                <div 
                  key={widget.label}
                  onClick={() => toggleWidget(widget.label)}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${isVisible ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${isVisible ? 'bg-emerald-500 border-emerald-500' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'}`}>
                      {isVisible && <Check className="w-4 h-4 text-white" />}
                      {!isVisible && <div className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className={`font-semibold ${isVisible ? 'text-emerald-900 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>
                        {widget.label}
                      </p>
                    </div>
                  </div>
                  <widget.icon className={`w-5 h-5 ${isVisible ? 'text-emerald-600 dark:text-emerald-500' : 'text-gray-400'}`} />
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
