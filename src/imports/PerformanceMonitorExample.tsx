/**
 * PerformanceMonitorExample.tsx
 * 
 * مثال عملي لاستخدام PerformanceMonitor في التطبيق
 * 
 * طريقة الاستخدام:
 * 1. استورد هذا المكون في App.tsx
 * 2. ضعه في أي مكان في التطبيق
 * 3. سيظهر زر في الزاوية السفلية اليسرى
 * 4. اضغط على الزر لعرض/إخفاء شاشة المراقبة
 */

import { useState } from 'react';
import { PerformanceMonitor, PerformanceMonitorToggle } from './PerformanceMonitor';

export function PerformanceMonitorExample() {
  const [monitorEnabled, setMonitorEnabled] = useState(false);

  // فقط في وضع التطوير
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* زر التفعيل/التعطيل */}
      <PerformanceMonitorToggle onToggle={setMonitorEnabled} />
      
      {/* شاشة المراقبة */}
      {monitorEnabled && <PerformanceMonitor />}
    </>
  );
}

/**
 * استخدام في App.tsx:
 * 
 * import { PerformanceMonitorExample } from './components/PerformanceMonitorExample';
 * 
 * function App() {
 *   return (
 *     <div>
 *       <PerformanceMonitorExample />
 *       // بقية التطبيق
 *     </div>
 *   );
 * }
 */

/**
 * أو استخدام مباشر:
 * 
 * import { PerformanceMonitor } from './components/PerformanceMonitor';
 * 
 * function App() {
 *   return (
 *     <div>
 *       {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
 *       // بقية التطبيق
 *     </div>
 *   );
 * }
 */

/**
 * تخصيص PerformanceMonitor:
 * 
 * // تفعيل/تعطيل يدوي
 * <PerformanceMonitor enabled={true} />
 * 
 * // مع state
 * const [showMonitor, setShowMonitor] = useState(false);
 * {showMonitor && <PerformanceMonitor />}
 */

/**
 * قراءة النتائج:
 * 
 * FPS (Frames Per Second):
 * - أخضر (>= 55): ممتاز ✅
 * - أصفر (30-54): مقبول ⚠️
 * - أحمر (< 30): ضعيف ❌
 * 
 * Memory (الذاكرة):
 * - أخضر (< 100 MB): ممتاز ✅
 * - أصفر (100-200 MB): مقبول ⚠️
 * - أحمر (> 200 MB): مرتفع ❌
 * 
 * Load Time (وقت التحميل):
 * - جيد: < 2000 ms (2 ثانية)
 * - مقبول: 2000-4000 ms
 * - ضعيف: > 4000 ms
 */

/**
 * نصائح للتحسين:
 * 
 * إذا كان FPS منخفض (<30):
 * - استخدم <FloatingParticles reduced={true} />
 * - قلل عدد الرسوم المتحركة النشطة
 * - تحقق من وجود loops لا نهائية في useEffect
 * 
 * إذا كانت الذاكرة مرتفعة (>200 MB):
 * - تحقق من memory leaks
 * - استخدم React.memo للمكونات الثقيلة
 * - تأكد من cleanup في useEffect
 * 
 * إذا كان وقت التحميل طويل (>4s):
 * - تأكد من استخدام lazy loading
 * - فحص حجم bundle (npm run build)
 * - استخدم code splitting
 */
