import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PerformanceStats {
  fps: number;
  memory: number;
  loadTime: number;
}

/**
 * PerformanceMonitor - مكون لمراقبة الأداء (للتطوير فقط)
 * 
 * استخدام:
 * import { PerformanceMonitor } from './components/PerformanceMonitor';
 * 
 * // في App.tsx أو أي صفحة
 * {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
 */
export function PerformanceMonitor({ enabled = true }: { enabled?: boolean }) {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    memory: 0,
    loadTime: 0,
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const updateStats = (currentTime: number) => {
      frameCount++;
      
      const delta = currentTime - lastTime;
      
      // تحديث FPS كل ثانية
      if (delta >= 1000) {
        const currentFPS = Math.round((frameCount * 1000) / delta);
        
        // الحصول على استخدام الذاكرة (إذا كان متاحاً)
        const memory = (performance as any).memory
          ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
          : 0;

        // وقت التحميل
        const loadTime = performance.timing
          ? performance.timing.loadEventEnd - performance.timing.navigationStart
          : 0;

        setStats({
          fps: currentFPS,
          memory,
          loadTime: Math.round(loadTime),
        });

        frameCount = 0;
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(updateStats);
    };

    animationFrameId = requestAnimationFrame(updateStats);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  // تحديد لون FPS بناءً على الأداء
  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-600';
    if (fps >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  // تحديد لون الذاكرة بناءً على الاستخدام
  const getMemoryColor = (memory: number) => {
    if (memory < 100) return 'text-green-600';
    if (memory < 200) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 bg-black/90 backdrop-blur-lg text-white rounded-lg shadow-2xl overflow-hidden"
          style={{ minWidth: '200px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 flex items-center justify-between">
            <h3 className="text-xs font-bold">Performance Monitor</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Stats */}
          <div className="p-4 space-y-3">
            {/* FPS */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-300">FPS:</span>
              <motion.span
                key={stats.fps}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className={`text-sm font-bold ${getFPSColor(stats.fps)}`}
              >
                {stats.fps}
              </motion.span>
            </div>

            {/* Memory (if available) */}
            {stats.memory > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Memory:</span>
                <motion.span
                  key={stats.memory}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className={`text-sm font-bold ${getMemoryColor(stats.memory)}`}
                >
                  {stats.memory} MB
                </motion.span>
              </div>
            )}

            {/* Load Time */}
            {stats.loadTime > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Load:</span>
                <span className="text-sm font-bold text-blue-400">
                  {stats.loadTime} ms
                </span>
              </div>
            )}

            {/* Performance Tips */}
            {stats.fps < 30 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 pt-2 border-t border-gray-700"
              >
                <p className="text-xs text-yellow-400">
                  ⚠️ Low FPS detected
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try reducing particles or disabling animations
                </p>
              </motion.div>
            )}

            {stats.memory > 200 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 pt-2 border-t border-gray-700"
              >
                <p className="text-xs text-red-400">
                  ⚠️ High memory usage
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Consider reducing component complexity
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-900 px-4 py-2 text-center">
            <p className="text-xs text-gray-500">
              Dev Mode Only
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Toggle button للـ Performance Monitor
 * يمكن وضعه في أي مكان في التطبيق
 */
export function PerformanceMonitorToggle({
  onToggle,
}: {
  onToggle: (enabled: boolean) => void;
}) {
  const [enabled, setEnabled] = useState(false);

  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    onToggle(newState);
  };

  return (
    <motion.button
      onClick={handleToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`fixed bottom-4 left-4 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors ${
        enabled
          ? 'bg-emerald-600 text-white'
          : 'bg-gray-800 text-gray-400'
      }`}
      title="Toggle Performance Monitor"
    >
      📊
    </motion.button>
  );
}
