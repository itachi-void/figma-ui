# RecycleHub Components - Part 2

المكونات الإضافية المضافة بدون Motion/Framer Motion

## المكونات المضافة ✅

### 1. FilterDialog
نافذة حوار لتصفية البيانات بمعايير متعددة.

**الموقع:** `/src/app/components/FilterDialog.tsx`

**الاستخدام:**
```tsx
import { FilterDialog } from './components/FilterDialog';

<FilterDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onApply={(filters) => console.log(filters)}
/>
```

**الخيارات:**
- Date Range
- Region
- Status
- Category

---

### 2. FloatingParticles
جزيئات متحركة للخلفية (Canvas-based).

**الموقع:** `/src/app/components/FloatingParticles.tsx`

**الاستخدام:**
```tsx
import { FloatingParticles } from './components/FloatingParticles';

// Normal mode
<FloatingParticles />

// Reduced mode for better performance
<FloatingParticles reduced={true} />
```

**الميزات:**
- Wind effect
- Mouse repel effect
- Multiple shapes (circle, square, triangle)
- Pulse animation
- Color groups
- Performance optimized

---

### 3. LoadingSpinner
مؤشر تحميل بسيط.

**الموقع:** `/src/app/components/LoadingSpinner.tsx`

**الاستخدام:**
```tsx
import LoadingSpinner from './components/LoadingSpinner';

<LoadingSpinner size="md" />
// Sizes: 'sm' | 'md' | 'lg'
```

---

### 4. NotificationBell
جرس الإشعارات مع قائمة منسدلة.

**الموقع:** `/src/app/components/NotificationBell.tsx`
**Context:** `/src/app/contexts/NotificationsContext.tsx`

**الاستخدام:**
```tsx
import { NotificationBell } from './components/NotificationBell';
import { NotificationsProvider } from './contexts/NotificationsContext';

// في App.tsx
<NotificationsProvider>
  <NotificationBell />
</NotificationsProvider>
```

**الميزات:**
- Real-time notifications
- Unread count badge
- Mark as read
- Clear all
- Auto-generated notifications (simulated)

---

### 5. GlobalSearch
بحث عالمي في كل التطبيق (Ctrl+K).

**الموقع:** `/src/app/components/GlobalSearch.tsx`

**الاستخدام:**
```tsx
import { GlobalSearch } from './components/GlobalSearch';

<GlobalSearch />
```

**الميزات:**
- Keyboard shortcut: Ctrl+K (Cmd+K on Mac)
- Search across pages, drivers, routes
- Grouped results by category
- Instant navigation

---

## المكونات المتبقية (ملاحظات للتحويل)

### OnboardingTour
جولة تعريفية بالتطبيق.

**الاستخدام المقترح:**
- يمكن تحويلها بنفس نمط المكونات الأخرى
- استبدال motion.div بـ div عادية مع CSS transitions
- استبدال AnimatePresence بـ conditional rendering + useEffect

**مثال:**
```tsx
// بدلاً من
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

// استخدم
const [isVisible, setIsVisible] = useState(false);
useEffect(() => {
  if (isOpen) setIsVisible(true);
}, [isOpen]);

<div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
```

---

### LiveMapView
خريطة تفاعلية مع تتبع السائقين.

**التعقيد:** 
- يستخدم Leaflet (لا يحتاج تحويل)
- Motion فقط في بعض العناصر البسيطة
- يمكن إزالة motion.button واستبداله بـ button عادي

**الملفات:**
- `/src/app/components/LiveMapView.tsx`
- `/src/app/components/LiveMapView.css`

**ملاحظة:** هذا المكون كبير جداً (800+ سطر) ويحتاج:
1. استبدال motion components بـ regular components
2. استخدام CSS transitions للـ toggles
3. الـ Canvas animations تبقى كما هي

---

### PerformanceMonitor
أداة مراقبة الأداء (للتطوير فقط).

**الموقع:** `/src/app/components/PerformanceMonitor.tsx`

**الاستخدام:**
```tsx
import { PerformanceMonitor } from './components/PerformanceMonitor';

{process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
```

**يعرض:**
- FPS (Frames Per Second)
- Memory usage
- Load time
- Performance warnings

---

## تحديث App.tsx

إضافة NotificationsProvider:

```tsx
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { RoleProvider } from './contexts/RoleContext';
import { ChatProvider } from './contexts/ChatContext';
import { NotificationsProvider } from './contexts/NotificationsContext';

export default function App() {
  return (
    <RoleProvider>
      <ChatProvider>
        <NotificationsProvider>
          <RouterProvider router={router} />
        </NotificationsProvider>
      </ChatProvider>
    </RoleProvider>
  );
}
```

---

## تحديث index.ts

```tsx
// Add to /src/app/components/index.ts

export { FilterDialog } from './FilterDialog';
export type { FilterOptions } from './FilterDialog';

export { FloatingParticles } from './FloatingParticles';

export { GlobalSearch } from './GlobalSearch';

export { default as LoadingSpinner } from './LoadingSpinner';

export { NotificationBell } from './NotificationBell';
```

---

## CSS Animations المضافة

في `/src/styles/theme.css`:
- `fadeIn` - ظهور تدريجي
- `fadeInUp` - ظهور مع حركة للأعلى
- `scaleIn` - ظهور مع تكبير
- `wiggle` - هز للجرس

---

## نصائح للأداء

### FloatingParticles
```tsx
// للأجهزة الضعيفة
<FloatingParticles reduced={true} />
```

### Lazy Loading
```tsx
import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner';

const LiveMapView = lazy(() => import('./components/LiveMapView'));

<Suspense fallback={<LoadingSpinner />}>
  <LiveMapView />
</Suspense>
```

---

## الخلاصة

تم إضافة:
- ✅ 5 مكونات جديدة (FilterDialog, FloatingParticles, LoadingSpinner, NotificationBell, GlobalSearch)
- ✅ 2 Contexts (ChatContext, NotificationsContext)
- ✅ CSS animations
- ✅ جميع المكونات بدون Motion

المكونات المتبقية (OnboardingTour, LiveMapView, PerformanceMonitor) يمكن تحويلها بنفس النمط عند الحاجة.
