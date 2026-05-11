# 🛣️ كيفية إضافة المسارات (Routes Integration)

## 📍 موقع ملف التوجيه (Routes File)
```
src/app/routes.tsx   ← هنا تضيف المسارات الجديدة
```

---

## ✅ **الطريقة الأولى: إضافة البسيطة**

### الخطوة 1: استيراد المكونات الجديدة

أضف هذه الأسطر في أعلى ملف `src/app/routes.tsx`:

```typescript
// في الأعلى مع الاستيرادات الأخرى
const AccountPage = lazyWithDelay(() => import('./pages/AccountPage'));
const AdminDashboard = lazyWithDelay(() => import('./components/AdminDashboard'));
```

### الخطوة 2: إضافة المسارات

أضف هذه المسارات في مصفوفة المسارات (قبل `path: '*'`):

```typescript
{
  path: '/account',
  Component: AccountPage,
},
{
  path: '/admin',
  Component: AdminDashboard,
},
```

---

## 📋 **الملف كامل بعد التعديل**

```typescript
import { createBrowserRouter, redirect } from 'react-router';
import { lazy } from 'react';

// Helper function to add 0.5 second delay to lazy loading
const lazyWithDelay = (importFunc: () => Promise<any>) => {
  return lazy(() =>
    Promise.all([
      importFunc(),
      new Promise(resolve => setTimeout(resolve, 125))
    ]).then(([moduleExports]) => moduleExports)
  );
};

// Lazy load pages for better performance with 0.5 second delay
const LandingPage = lazyWithDelay(() => import('./pages/LandingPage'));
const CitizenPortalPage = lazyWithDelay(() => import('./citizen-portal/page'));
const AccountPage = lazyWithDelay(() => import('./pages/AccountPage'));         // ✨ جديد
const AdminDashboard = lazyWithDelay(() => import('./components/AdminDashboard')); // ✨ جديد
const NotFoundPage = lazyWithDelay(() => import('./pages/NotFound'));

// ... باقي الـ imports

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/account',                  // ✨ جديد
    Component: AccountPage,            // ✨ جديد
  },
  {
    path: '/admin',                    // ✨ جديد
    Component: AdminDashboard,         // ✨ جديد
  },
  {
    path: '/citizen-portal',
    Component: CitizenPortalPage,
  },
  {
    path: '/dashboard',
    Component: DashboardLayout,
    children: [
      // ... باقي المسارات
    ],
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
]);
```

---

## 🧭 **الخطوات الفعلية**

### 1️⃣ افتح `src/app/routes.tsx`

### 2️⃣ أضف الاستيرادات (بعد السطر 15 تقريباً):

```typescript
const AccountPage = lazyWithDelay(() => import('./pages/AccountPage'));
const AdminDashboard = lazyWithDelay(() => import('./components/AdminDashboard'));
```

### 3️⃣ أضف المسارات (بعد `path: '/'` مباشرة):

```typescript
{
  path: '/account',
  Component: AccountPage,
},
{
  path: '/admin',
  Component: AdminDashboard,
},
```

### 4️⃣ احفظ الملف

### 5️⃣ اختبر في المتصفح:
```
http://localhost:5173/account
http://localhost:5173/admin
```

---

## 🔒 **إصدار آمن مع حماية المسارات** (اختياري)

إذا أردت حماية مسار الإدارة فقط للمسؤولين:

```typescript
// إضافة مكون حماية
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;

  // تحقق من الصلاحيات
  if (!token || user?.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// ثم استخدمه:
{
  path: '/admin',
  element: (
    <ProtectedAdminRoute>
      <AdminDashboard />
    </ProtectedAdminRoute>
  ),
},
```

---

## 🔗 **روابط الوصول السريع**

بعد إضافة المسارات، يمكنك الوصول إلى:

| الصفحة | الرابط |
|-------|--------|
| صفحة الحساب | `http://localhost:5173/account` |
| لوحة الإدارة | `http://localhost:5173/admin` |
| الصفحة الرئيسية | `http://localhost:5173` |
| بوابة المواطن | `http://localhost:5173/citizen-portal` |
| لوحة التحكم | `http://localhost:5173/dashboard` |

---

## 🎯 **للتحقق من نجاح الإضافة**

1. ✅ لا توجد أخطاء في console
2. ✅ الصفحة تحمل عند فتح الرابط
3. ✅ المكونات تظهر بشكل صحيح
4. ✅ تسجيل الدخول يعمل
5. ✅ الإدارة تحمل البيانات

---

## 📝 **نصائح إضافية**

### إذا واجهت مشاكل:

**❌ Error: "Cannot find module"**
- تأكد من المسار صحيح
- تأكد من وجود الملف فعلاً

**❌ Component not showing**
- تحقق من console للأخطاء
- تأكد من استيراد آخر التحديثات

**❌ Token not working**
- تأكد من تسجيل الدخول أولاً
- تفقد localStorage في DevTools

---

## ✨ **تم الانتهاء!**

المسارات جاهزة الآن للاستخدام في التطبيق! 🎉
