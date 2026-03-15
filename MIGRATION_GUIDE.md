# دليل التحويل من Vite إلى Next.js
# Migration Guide: Vite to Next.js

<div dir="rtl">

## نظرة عامة

هذا الدليل يوثق خطوات تحويل مشروع RecycleHub من Vite إلى Next.js 15 مع App Router.

</div>

## 🔄 الخطوات الرئيسية

### 1. تحديث package.json

#### قبل (Vite)
```json
{
  "scripts": {
    "build": "vite build"
  },
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-router": "^7.13.1",
    "react-router-dom": "^7.13.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.1.12",
    "@vitejs/plugin-react": "4.7.0",
    "vite": "6.3.5"
  }
}
```

#### بعد (Next.js)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.1.6",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "tailwindcss": "4.1.12"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "eslint": "^9",
    "eslint-config-next": "^15.1.6",
    "typescript": "^5.7.2"
  }
}
```

**ملاحظات**:
- ✅ تم إزالة `react-router` و `react-router-dom`
- ✅ تم إزالة Vite وإضافة Next.js
- ✅ تم نقل `react` و `react-dom` إلى dependencies
- ✅ تم إضافة TypeScript types

### 2. إنشاء ملفات التكوين

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react', 'recharts', 'react-leaflet', 'leaflet'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    };
    return config;
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};

export default nextConfig;
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 3. هيكل المشروع

#### قبل (Vite)
```
/src
  /app
    App.tsx                 # Entry point with React Router
    /components
    /pages
    /layouts
      DashboardLayout.tsx   # Layout with Outlet
```

#### بعد (Next.js)
```
/src
  /app
    layout.tsx              # Root layout
    page.tsx                # Home page
    /dashboard
      layout.tsx            # Dashboard layout
      /overview
        page.tsx
      /routes
        page.tsx
    /citizen-portal
      page.tsx
    /components             # Shared components
    /pages                  # Legacy page components (reused)
```

### 4. تحديث الملفات الرئيسية

#### Root Layout (/src/app/layout.tsx)
```tsx
import type { Metadata } from 'next';
import { RoleProvider } from '@/app/contexts/RoleContext';
import { Toaster } from 'sonner';
import '@/styles/index.css';

export const metadata: Metadata = {
  title: 'RecycleHub - Smart Bottle Recycling System',
  description: 'نظام إعادة تدوير الزجاجات الذكية',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <RoleProvider>
          <Toaster position="top-right" />
          {children}
        </RoleProvider>
      </body>
    </html>
  );
}
```

#### Home Page (/src/app/page.tsx)
```tsx
import LandingPage from '@/app/pages/LandingPage';

export default function Home() {
  return <LandingPage />;
}
```

#### Dashboard Layout (/src/app/dashboard/layout.tsx)
```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
// ... components

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Layout logic...
  
  return (
    <div>
      {/* Sidebar with navigation */}
      <main>{children}</main>
    </div>
  );
}
```

### 5. تحويل التنقل (Navigation)

#### قبل (React Router)
```tsx
import { Link, useLocation } from 'react-router';

function Navigation() {
  const location = useLocation();
  const isActive = location.pathname === '/dashboard/overview';
  
  return (
    <Link to="/dashboard/overview">
      Overview
    </Link>
  );
}
```

#### بعد (Next.js)
```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Navigation() {
  const pathname = usePathname();
  const isActive = pathname === '/dashboard/overview';
  
  return (
    <Link href="/dashboard/overview">
      Overview
    </Link>
  );
}
```

**التغييرات**:
- ✅ `'use client'` directive للمكونات التفاعلية
- ✅ `Link` من `next/link` بدلاً من `react-router`
- ✅ `href` بدلاً من `to`
- ✅ `usePathname()` بدلاً من `useLocation()`

### 6. تحويل المكونات

#### إضافة 'use client' Directive

**متى نستخدمها؟**
- المكونات التي تستخدم hooks (useState, useEffect, etc.)
- المكونات التي تستخدم event handlers
- المكونات التي تستخدم browser APIs
- المكونات التي تستخدم Context

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'motion/react';

export default function Component() {
  const [state, setState] = useState(false);
  
  return (
    <motion.div onClick={() => setState(true)}>
      Click me
    </motion.div>
  );
}
```

### 7. معالجة Leaflet (Maps)

#### مشكلة SSR مع Leaflet
Leaflet لا يعمل مع Server-Side Rendering، لذا نحتاج:

```tsx
'use client';

import { useEffect, useState } from 'react';

export function LiveMapView() {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient) return;
    
    // Dynamic import على جانب العميل فقط
    import('leaflet').then((leaflet) => {
      setL(leaflet);
      // Initialize map...
    });
  }, [isClient]);
  
  if (!isClient) {
    return <div>Loading map...</div>;
  }
  
  return <div ref={mapContainer} />;
}
```

### 8. تحديث CSS Imports

#### قبل (Vite)
```tsx
// في vite.config.ts
import tailwindcss from '@tailwindcss/vite';
```

#### بعد (Next.js)
```tsx
// في /src/app/layout.tsx
import '@/styles/index.css';

// في /src/styles/index.css
@import './fonts.css';
@import './tailwind.css';
@import './theme.css';
@import 'leaflet/dist/leaflet.css';
@import './leaflet-fix.css';
```

### 9. Environment Variables

#### قبل (Vite)
```
VITE_API_URL=http://localhost:3000
```

```tsx
const apiUrl = import.meta.env.VITE_API_URL;
```

#### بعد (Next.js)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

```tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

**ملاحظات**:
- ✅ استخدم `NEXT_PUBLIC_` للمتغيرات العامة
- ✅ المتغيرات بدون `NEXT_PUBLIC_` متاحة فقط server-side

## 📊 ملخص الفروقات

| الميزة | Vite | Next.js |
|--------|------|---------|
| Routing | React Router | App Router (built-in) |
| SSR | ❌ No | ✅ Yes |
| File-based routing | ❌ No | ✅ Yes |
| API Routes | ❌ No | ✅ Yes |
| Image Optimization | ❌ No | ✅ Yes |
| Code Splitting | Manual | Automatic |
| Build Speed | ⚡ Very Fast | Fast |
| Production Optimizations | Good | Excellent |

## ✅ قائمة التحقق

- [x] تحديث package.json
- [x] إنشاء next.config.js
- [x] إنشاء tsconfig.json
- [x] إنشاء /src/app/layout.tsx
- [x] إنشاء /src/app/page.tsx
- [x] تحويل routing إلى App Router
- [x] إضافة 'use client' للمكونات التفاعلية
- [x] تحديث imports (Link, usePathname)
- [x] معالجة Leaflet SSR
- [x] تحديث CSS imports
- [x] إزالة React Router dependencies
- [x] اختبار جميع الصفحات
- [x] اختبار الخريطة التفاعلية
- [x] اختبار الرسوم المتحركة

## 🚀 الخطوات التالية

1. **تثبيت Dependencies**
   ```bash
   pnpm install
   ```

2. **تشغيل Development Server**
   ```bash
   pnpm dev
   ```

3. **البناء للإنتاج**
   ```bash
   pnpm build
   pnpm start
   ```

## 🐛 المشاكل الشائعة وحلولها

### 1. Leaflet لا يعمل
**المشكلة**: خطأ "window is not defined"

**الحل**:
```tsx
'use client';

const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

useEffect(() => {
  if (!isClient) return;
  import('leaflet').then((L) => {
    // Initialize map
  });
}, [isClient]);
```

### 2. Framer Motion أخطاء SSR
**المشكلة**: Hydration errors

**الحل**: استخدم `'use client'` directive

```tsx
'use client';

import { motion } from 'motion/react';
```

### 3. Context لا يعمل
**المشكلة**: Context values undefined

**الحل**: تأكد من وجود `'use client'` في:
- Context Provider
- Components using useContext

## 📚 مصادر إضافية

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs)
- [React Leaflet SSR Guide](https://react-leaflet.js.org/docs/start-setup/)

---

<div dir="rtl">
تم التحويل بنجاح ✅
</div>
