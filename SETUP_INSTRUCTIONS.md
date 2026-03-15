# تعليمات الإعداد - Setup Instructions

<div dir="rtl">

## إعداد المشروع بعد التحويل من Vite إلى Next.js

</div>

## 🚀 خطوات البدء السريع

### 1. تنظيف ذاكرة التخزين المؤقت

```bash
# حذف node_modules إذا كانت موجودة
rm -rf node_modules

# حذف ملفات القفل القديمة
rm -rf package-lock.json yarn.lock pnpm-lock.yaml

# حذف مجلد .next إذا كان موجوداً
rm -rf .next
```

### 2. تثبيت الاعتماديات

```bash
# باستخدام pnpm (مُوصى به)
pnpm install

# أو باستخدام npm
npm install

# أو باستخدام yarn
yarn install
```

### 3. تشغيل بيئة التطوير

```bash
# باستخدام pnpm
pnpm dev

# أو باستخدام npm
npm run dev

# أو باستخدام yarn
yarn dev
```

### 4. فتح المتصفح

افتح المتصفح على: [http://localhost:3000](http://localhost:3000)

## 🔧 حل المشاكل الشائعة

### المشكلة: خطأ "Cannot import vite"

**الحل:**
```bash
# تأكد من حذف node_modules وإعادة التثبيت
rm -rf node_modules .next
pnpm install
```

### المشكلة: خطأ "Module not found: Can't resolve 'leaflet'"

**الحل:**
```bash
# تثبيت leaflet وtypes الخاصة به
pnpm add leaflet @types/leaflet react-leaflet
```

### المشكلة: خطأ Hydration في المتصفح

**السبب:** بعض المكونات تحاول استخدام browser APIs أثناء SSR

**الحل:** تأكد من وجود `'use client'` في أول سطر من المكونات التالية:
- جميع المكونات التي تستخدم `useState`, `useEffect`
- جميع المكونات التي تستخدم Motion (framer-motion)
- جميع المكونات التي تستخدم Leaflet
- جميع المكونات التي تستخدم Context

### المشكلة: الخريطة لا تظهر

**الحل:**
1. تأكد من استيراد CSS الخاص بـ Leaflet في `/src/styles/index.css`:
```css
@import 'leaflet/dist/leaflet.css';
```

2. تأكد من أن المكون `LiveMapView` يحتوي على:
```tsx
'use client';

const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

if (!isClient) return <div>Loading...</div>;
```

### المشكلة: خطأ في Motion/Framer Motion

**الحل:**
تأكد من استخدام import الصحيح:
```tsx
import { motion } from 'motion/react';
```

وليس:
```tsx
import { motion } from 'framer-motion'; // ❌ خطأ
```

## 📂 التحقق من الملفات الأساسية

تأكد من وجود الملفات التالية:

```
✅ /next.config.js
✅ /tsconfig.json
✅ /next-env.d.ts
✅ /.eslintrc.json
✅ /package.json (مع Next.js scripts)
✅ /src/app/layout.tsx
✅ /src/app/page.tsx
✅ /src/app/dashboard/layout.tsx
```

## 🧹 ملفات قديمة (يمكن تجاهلها)

الملفات التالية من Vite القديم ولكن لا تؤثر على عمل Next.js:
- `/vite.config.ts` - تم تعطيله
- `/src/app/App.tsx` - تم تعطيله
- لا تحذفهم (محميين) لكن لن يتم استخدامهم

## 🎯 التحقق من عمل كل شيء

### 1. اختبار الصفحة الرئيسية
- افتح: `http://localhost:3000`
- يجب أن ترى صفحة Landing مع رسوم متحركة

### 2. اختبار بوابة المواطنين
- افتح: `http://localhost:3000/citizen-portal`
- يجب أن ترى صفحة بوابة المواطنين

### 3. اختبار لوحة التحكم
- افتح: `http://localhost:3000/dashboard/overview`
- يجب أن ترى لوحة التحكم مع Sidebar

### 4. اختبار الخريطة
- اذهب إلى: `http://localhost:3000/dashboard/routes`
- يجب أن ترى خريطة القاهرة التفاعلية مع المركبات المتحركة

## 🔍 فحص Console للأخطاء

افتح Developer Tools (F12) وتحقق من:

### في Console:
- لا يجب أن تكون هناك أخطاء حمراء
- تحذيرات بسيطة مقبولة

### في Network:
- تأكد من تحميل Leaflet CSS و JS
- تأكد من تحميل خرائط الأقمار الصناعية من ArcGIS

## 🚀 البناء للإنتاج

```bash
# بناء المشروع
pnpm build

# تشغيل الإنتاج
pnpm start
```

### التحقق من البناء

يجب أن ترى:
```
✓ Creating an optimized production build
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

## 📊 مقاييس الأداء

بعد البناء، تحقق من:
- First Load JS: يجب أن يكون أقل من 200KB للصفحات الرئيسية
- Static pages: يجب أن تكون معظم الصفحات static
- Server pages: فقط الصفحات التي تحتاج dynamic content

## 🌐 المتصفحات المدعومة

- Chrome/Edge: الإصدارات الأحدث
- Firefox: الإصدارات الأحدث  
- Safari: 14+
- Mobile browsers: معظم المتصفحات الحديثة

## 💡 نصائح للتطوير

1. **Hot Reload:** Next.js يدعم Hot Reload تلقائياً
2. **TypeScript:** تحقق من الأخطاء باستخدام IDE
3. **Console:** راقب console للتحذيرات
4. **Network:** راقب Network tab لتحميل الموارد
5. **Performance:** استخدم Lighthouse لتحليل الأداء

## 📞 الحصول على المساعدة

إذا واجهت مشاكل:

1. **تحقق من هذا الملف** - معظم الحلول موجودة هنا
2. **اقرأ MIGRATION_GUIDE.md** - دليل تفصيلي للتحويل
3. **راجع next.config.js** - تأكد من التكوين الصحيح
4. **افحص Console** - ابحث عن رسائل الخطأ التفصيلية
5. **أعد التثبيت** - في بعض الأحيان حذف node_modules يحل المشكلة

## ✅ قائمة التحقق النهائية

- [ ] تم حذف node_modules القديمة
- [ ] تم تشغيل `pnpm install` بنجاح
- [ ] تم تشغيل `pnpm dev` بدون أخطاء
- [ ] الصفحة الرئيسية تعمل
- [ ] لوحة التحكم تعمل
- [ ] الخريطة تظهر وتعمل
- [ ] المركبات تتحرك على الخريطة
- [ ] الرسوم المتحركة تعمل
- [ ] لا توجد أخطاء في Console

---

<div dir="rtl">
إذا اكتملت جميع النقاط أعلاه، مبروك! 🎉 المشروع جاهز للاستخدام
</div>
