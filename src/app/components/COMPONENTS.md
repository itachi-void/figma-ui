# RecycleHub Components

جميع المكونات المضافة للمشروع بدون استخدام Motion/Framer Motion - تستخدم فقط CSS Transitions.

## المكونات المتوفرة

### 1. AddDriverDialog
نافذة حوار لإضافة سائق جديد مع نموذج تحقق كامل.

**الاستخدام:**
```tsx
import { AddDriverDialog } from './components';

<AddDriverDialog 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onAdd={(driver) => console.log(driver)}
/>
```

### 2. AnimatedCounter
عداد متحرك يعرض الأرقام بشكل متحرك.

**الاستخدام:**
```tsx
import AnimatedCounter from './components/AnimatedCounter';

<AnimatedCounter value={2500} />
```

### 3. ChatPanel
لوحة محادثة مع السائقين تدعم المحادثات المتعددة.

**الاستخدام:**
```tsx
import { ChatPanel } from './components';
import { ChatProvider } from './contexts/ChatContext';

// في App.tsx أو في أي مكون parent
<ChatProvider>
  <ChatPanel />
</ChatProvider>
```

### 4. DetailsDialog
نافذة حوار لعرض تفاصيل السائق أو النشاط.

**الاستخدام:**
```tsx
import { DetailsDialog } from './components';

<DetailsDialog 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  type="driver"
  data={driverData}
/>
```

### 5. EmptyState
حالة فارغة لعرض رسالة عندما لا توجد بيانات.

**الاستخدام:**
```tsx
import EmptyState from './components/EmptyState';
import { Package } from 'lucide-react';

<EmptyState
  icon={Package}
  title="No items found"
  description="Start by adding your first item"
  actionLabel="Add Item"
  onAction={() => console.log('Add clicked')}
/>
```

### 6. ExportDialog
نافذة حوار لتصدير التقارير بصيغ مختلفة.

**الاستخدام:**
```tsx
import { ExportDialog } from './components';

<ExportDialog 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

### 7. ScrollReveal
مكون wrapper لإظهار المحتوى عند التمرير.

**الاستخدام:**
```tsx
import { ScrollReveal } from './components';

<ScrollReveal direction="up" delay={0.2}>
  <div>Content to reveal</div>
</ScrollReveal>
```

**Props:**
- `direction`: 'up' | 'down' | 'left' | 'right'
- `delay`: number (بالثواني)
- `once`: boolean (افتراضي: true)

### 8. SettingsModal
نافذة إعدادات شاملة مع 5 تبويبات.

**الاستخدام:**
```tsx
import { SettingsModal } from './components';

<SettingsModal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

**التبويبات:**
- Profile: معلومات المستخدم
- Notifications: إعدادات التنبيهات
- Security: إعدادات الأمان
- Appearance: إعدادات المظهر
- Data: إعدادات البيانات والخصوصية

### 9. Toast
إشعارات منبثقة مع hook مخصص.

**الاستخدام:**
```tsx
import { Toast, useToast } from './components';

function MyComponent() {
  const { toast, showToast, hideToast } = useToast();
  
  return (
    <>
      <button onClick={() => showToast('Success message', 'success')}>
        Show Toast
      </button>
      
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
}
```

**الأنواع:** 'success' | 'error' | 'warning' | 'info'

### 10. WidgetCustomizerModal
نافذة لتخصيص عرض الويدجيت في لوحة التحكم.

**الاستخدام:**
```tsx
import WidgetCustomizerModal from './components/WidgetCustomizerModal';

<WidgetCustomizerModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  availableWidgets={widgets}
  hiddenWidgets={hiddenWidgets}
  setHiddenWidgets={setHiddenWidgets}
/>
```

## الميزات العامة

- ✅ جميع المكونات تستخدم CSS Transitions فقط
- ✅ لا يوجد استخدام لـ Motion أو Framer Motion
- ✅ تصميم responsive
- ✅ دعم Dark Mode (حيث ينطبق)
- ✅ Accessibility support (ARIA labels, roles)
- ✅ TypeScript support كامل
- ✅ تأثيرات smooth وسلسة

## الـ CSS Animations المستخدمة

جميع الـ animations مُعرّفة في `/src/styles/theme.css`:
- `fadeIn` - ظهور تدريجي
- `fadeInUp` - ظهور مع حركة للأعلى
- `scaleIn` - ظهور مع تكبير
