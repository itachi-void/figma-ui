# دليل حل المشاكل - Troubleshooting Guide

<div dir="rtl">

## الأخطاء الشائعة وحلولها

</div>

## ❌ خطأ: "Cannot import vite from project"

### الوصف
```
ViteStartServerError: Cannot import vite from project: Error: ENOENT: no such file or directory
```

### السبب
النظام لا يزال يحاول البحث عن Vite على الرغم من التحويل إلى Next.js.

### الحل

#### الخطوة 1: حذف ذاكرة التخزين المؤقت
```bash
rm -rf node_modules
rm -rf .next
rm -rf package-lock.json
rm -rf yarn.lock
rm -rf pnpm-lock.yaml
```

#### الخطوة 2: تثبيت الاعتماديات من جديد
```bash
pnpm install
# أو
npm install
```

#### الخطوة 3: تشغيل Next.js
```bash
pnpm dev
# أو
npm run dev
```

### ملاحظات
- **لا تحاول** تثبيت Vite - المشروع الآن يستخدم Next.js
- الملفات `/vite.config.ts` و `/src/app/App.tsx` موجودة لكن معطلة
- تأكد من وجود `next` في `dependencies` في `package.json`

---

## ❌ خطأ: "Module not found: Can't resolve 'react-router'"

### الوصف
```
Module not found: Can't resolve 'react-router' or 'react-router-dom'
```

### السبب
بعض الملفات لا تزال تحاول استخدام React Router القديم.

### الحل

#### تحقق من الملفات
ابحث عن أي ملفات تحتوي على:
```tsx
import { Link } from 'react-router';
import { useLocation } from 'react-router';
```

#### استبدلها بـ:
```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
```

#### مثال كامل:
```tsx
// ❌ قديم (React Router)
import { Link, useLocation } from 'react-router';

function Navigation() {
  const location = useLocation();
  return <Link to="/dashboard">Dashboard</Link>;
}

// ✅ جديد (Next.js)
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Navigation() {
  const pathname = usePathname();
  return <Link href="/dashboard">Dashboard</Link>;
}
```

---

## ❌ خطأ: Hydration mismatch

### الوصف
```
Error: Hydration failed because the initial UI does not match what was rendered on the server.
```

### السبب
مكون يستخدم browser APIs أو random values أثناء SSR.

### الحل

#### 1. إضافة 'use client'
```tsx
'use client';

import { useState } from 'react';

export default function Component() {
  const [state, setState] = useState(false);
  return <div>{state}</div>;
}
```

#### 2. تأخير التحميل للمكونات Client-side
```tsx
'use client';

import { useState, useEffect } from 'react';

export default function Component() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) return null;
  
  return <div>Client-side content</div>;
}
```

---

## ❌ خطأ: الخريطة لا تظهر (Leaflet)

### الوصف
الخريطة لا تظهر أو تظهر رسالة خطأ "window is not defined".

### السبب
Leaflet لا يدعم SSR ويحتاج تحميل ديناميكي.

### الحل

```tsx
'use client';

import { useEffect, useState, useRef } from 'react';

export function LiveMapView() {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient || !mapContainer.current) return;
    
    // Dynamic import - client-side only
    import('leaflet').then((leaflet) => {
      setL(leaflet);
      
      // Fix default icon
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      
      // Initialize map
      const map = leaflet.map(mapContainer.current).setView([30.0444, 31.2357], 12);
      
      // Add tile layer
      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    });
  }, [isClient]);
  
  if (!isClient) {
    return <div>Loading map...</div>;
  }
  
  return <div ref={mapContainer} className="h-[600px] w-full" />;
}
```

#### تأكد من استيراد CSS
في `/src/styles/index.css`:
```css
@import 'leaflet/dist/leaflet.css';
```

---

## ❌ خطأ: Motion/Framer Motion

### الوصف
```
Error: Cannot find module 'framer-motion'
```

### السبب
المشروع يستخدم `motion` وليس `framer-motion`.

### الحل

#### استخدم Import الصحيح:
```tsx
// ✅ صحيح
import { motion } from 'motion/react';

// ❌ خطأ
import { motion } from 'framer-motion';
```

---

## ❌ خطأ: Failed to compile

### الوصف
```
./src/app/... 
Module parse failed: Unexpected token
```

### الأسباب المحتملة والحلول

#### 1. ملف TypeScript غير صحيح
تأكد من:
- استخدام `.tsx` للملفات مع JSX
- استخدام `.ts` للملفات بدون JSX

#### 2. Import غير صحيح
```tsx
// ✅ صحيح
import Component from './Component';
import { helper } from './utils';

// ❌ خطأ
import Component from './Component.tsx'; // لا تضيف امتداد الملف
```

#### 3. استخدام غير صحيح لـ export
```tsx
// ✅ صحيح
export default function Page() {}
export function Component() {}

// ❌ خطأ - في Page Routes يجب default export
function Page() {}
export { Page };
```

---

## ❌ خطأ: CSS لا يعمل

### الوصف
الأنماط لا تظهر أو Tailwind لا يعمل.

### الحل

#### 1. تحقق من `/src/styles/index.css`
يجب أن يحتوي على:
```css
@import './fonts.css';
@import './tailwind.css';
@import './theme.css';
@import 'leaflet/dist/leaflet.css';
@import './leaflet-fix.css';
```

#### 2. تحقق من `/src/styles/tailwind.css`
يجب أن يحتوي على:
```css
@import "tailwindcss";
```

#### 3. تأكد من import في layout.tsx
```tsx
import '@/styles/index.css';
```

---

## ❌ خطأ: Path alias '@' لا يعمل

### الوصف
```
Module not found: Can't resolve '@/...'
```

### الحل

#### تحقق من `tsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### تحقق من `next.config.js`
```javascript
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    };
    return config;
  },
};
```

---

## ❌ خطأ: Port 3000 already in use

### الوصف
```
Error: listen EADDRINUSE: address already in use :::3000
```

### الحل

#### الخيار 1: إيقاف العملية الأخرى
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### الخيار 2: استخدام port مختلف
```bash
PORT=3001 pnpm dev
# أو
npm run dev -- -p 3001
```

---

## ❌ خطأ: Build fails

### الوصف
```
Error occurred prerendering page "..."
```

### الحل

#### 1. تحقق من جميع الصفحات
كل ملف `page.tsx` يجب أن يحتوي على default export:
```tsx
export default function Page() {
  return <div>Content</div>;
}
```

#### 2. إذا كانت الصفحة تستخدم client features
```tsx
'use client';

export default function Page() {
  return <div>Content</div>;
}
```

#### 3. للصفحات الديناميكية
```tsx
export const dynamic = 'force-dynamic';

export default function Page() {
  return <div>Content</div>;
}
```

---

## 🔍 تشخيص عام للمشاكل

### خطوات التشخيص

1. **افحص Console**
   ```bash
   # في Terminal
   pnpm dev
   
   # في Browser
   F12 > Console
   ```

2. **تحقق من Network**
   ```
   F12 > Network > تأكد من تحميل جميع الموارد
   ```

3. **امسح Cache**
   ```bash
   rm -rf .next
   pnpm dev
   ```

4. **أعد تثبيت Dependencies**
   ```bash
   rm -rf node_modules
   pnpm install
   ```

5. **تحقق من الملفات الأساسية**
   - `/src/app/layout.tsx` موجود
   - `/src/app/page.tsx` موجود
   - `/next.config.js` موجود
   - `/package.json` يحتوي على `next`

---

## 📞 الحصول على المزيد من المساعدة

### الموارد المفيدة

1. **Next.js Documentation**
   - [https://nextjs.org/docs](https://nextjs.org/docs)
   - [App Router Guide](https://nextjs.org/docs/app)

2. **Troubleshooting Guide**
   - [Common Errors](https://nextjs.org/docs/messages)

3. **Stack Overflow**
   - ابحث عن رسالة الخطأ
   - استخدم tags: `nextjs`, `react`, `typescript`

4. **GitHub Issues**
   - [Next.js Issues](https://github.com/vercel/next.js/issues)

---

## ✅ قائمة التحقق السريعة

عند مواجهة أي مشكلة، تحقق من:

- [ ] تم حذف `node_modules` وإعادة التثبيت
- [ ] تم حذف `.next` folder
- [ ] `package.json` يحتوي على `next` في dependencies
- [ ] لا توجد أخطاء في `pnpm dev` terminal
- [ ] `'use client'` موجود في المكونات التفاعلية
- [ ] imports صحيحة (Next.js وليس React Router)
- [ ] CSS files مستوردة بشكل صحيح
- [ ] Leaflet يتم تحميله ديناميكياً
- [ ] Motion من 'motion/react' وليس 'framer-motion'

---

<div dir="rtl">
إذا لم تحل هذه الخطوات المشكلة، يرجى فتح Issue مع:
- رسالة الخطأ الكاملة
- الخطوات التي اتبعتها
- إصدارات الحزم (`pnpm list` أو `npm list`)
</div>
