# 🚀 دليل البدء السريع - مواقع الملفات وطرق التشغيل

## 📁 **الخدمات (Services) - Backend Logic**

### 1. **خدمة الحساب (Account Service)**
- **الموقع**: `src/app/services/accountService.ts`
- **الوظيفة**: تسجيل الدخول والمصادقة
- **الاستخدام**:
```typescript
import { accountService } from '@/app/services/accountService';

// تسجيل دخول
const response = await accountService.login({
  name: "admin",
  password: "password123",
  role: "Citizen"
});
console.log(response.token); // JWT Token
```

---

### 2. **خدمة المستخدمين (User Service)**
- **الموقع**: `src/app/services/userService.ts`
- **الوظيفة**: إدارة المستخدمين CRUD
- **الاستخدام**:
```typescript
import { userService } from '@/app/services/userService';

// الحصول على كل المستخدمين
const users = await userService.getAllUsers();

// إنشاء مستخدم جديد
const newUser = await userService.createUser({
  FullName: "أحمد محمد",
  Email: "ahmed@example.com",
  Password: "Pass123!@",
  Address: "القاهرة، مصر - شارع النيل 123"
});

// تحديث مستخدم
await userService.updateUser({ userId: 1, FullName: "أحمد علي" });

// حذف مستخدم
await userService.deleteUser(1);
```

---

### 3. **خدمة الإدارة (Admin Service)**
- **الموقع**: `src/app/services/adminService.ts`
- **الوظيفة**: إدارة النظام والإحصائيات
- **الاستخدام**:
```typescript
import { adminService, getDashboardStats } from '@/app/services/adminService';

// الحصول على الإحصائيات
const stats = await getDashboardStats();

// الحصول على جميع الدراجين
const recyclers = await adminService.getRecyclerDetails();

// الحصول على جميع التذاكر
const tickets = await adminService.getSupportTickets();

// إنشاء فئة نفايات جديدة
await adminService.createWasteCategory({
  categoryName: "البلاستيك",
  pointsPerUnit: 10.5
});
```

---

## 🎨 **المكونات (Components) - Frontend UI**

### 1. **نموذج تسجيل الدخول (Login Form)**
- **الموقع**: `src/app/components/LoginForm.tsx`
- **المظهر**: نموذج تسجيل دخول بسيط
- **الاستخدام في المشروع**:
```typescript
// في أي صفحة تريد تسجيل دخول
import { LoginForm } from '@/app/components/LoginForm';

export function MyPage() {
  return (
    <LoginForm 
      onSuccess={() => console.log("تم تسجيل الدخول")}
      onError={(err) => console.error(err)}
    />
  );
}
```

---

### 2. **نموذج المستخدم (User Form)**
- **الموقع**: `src/app/components/UserForm.tsx`
- **المظهر**: نموذج إنشاء/تعديل مستخدم مع رفع صورة
- **الاستخدام**:
```typescript
import { UserForm } from '@/app/components/UserForm';

// إنشاء مستخدم جديد
<UserForm 
  mode="create"
  onSuccess={() => alert("تم إنشاء المستخدم")}
/>

// تعديل مستخدم موجود
<UserForm 
  mode="edit"
  userId={1}
  onSuccess={() => alert("تم التحديث")}
/>
```

---

### 3. **قائمة المستخدمين (Users List)**
- **الموقع**: `src/app/components/UsersList.tsx`
- **المظهر**: جدول بجميع المستخدمين مع تعديل وحذف
- **الاستخدام**:
```typescript
import { UsersList } from '@/app/components/UsersList';

<UsersList 
  onEdit={(user) => console.log("تعديل:", user)}
  onDelete={(id) => console.log("حذف:", id)}
/>
```

---

### 4. **لوحة المتحكم الإداري (Admin Dashboard)**
- **الموقع**: `src/app/components/AdminDashboard.tsx`
- **المظهر**: لوحة تحكم شاملة مع 5 تبويبات
- **التبويبات**:
  - 📊 نظرة عامة (Overview) - الإحصائيات
  - ♻️ الدراجون (Recyclers) - إدارة الدراجين
  - 👥 المستخدمون (Users) - إدارة المستخدمين
  - 🏷️ الفئات (Categories) - إدارة فئات النفايات
  - 🎫 التذاكر (Tickets) - تذاكر الدعم
- **الاستخدام**:
```typescript
import { AdminDashboard } from '@/app/components/AdminDashboard';

// استخدامها مباشرة (لا تحتاج props)
<AdminDashboard />
```

---

### 5. **صفحة الحساب الرئيسية (Account Page)**
- **الموقع**: `src/app/pages/AccountPage.tsx`
- **المظهر**: صفحة شاملة مع 4 تبويبات
- **التبويبات**:
  - 🔓 تسجيل الدخول (Login)
  - 📝 التسجيل (Register)
  - ✏️ تحديث الملف الشخصي (Edit Profile)
  - 📋 قائمة المستخدمين (Users List)
- **الاستخدام**:
```typescript
import { AccountPage } from '@/app/pages/AccountPage';

<AccountPage />
```

---

### 6. **مُختبِر API التفاعلي (API Demo)**
- **الموقع**: `src/app/components/APIDemo.tsx`
- **المظهر**: أداة اختبار الـ API مع أزرار اختبار
- **الاستخدام**:
```typescript
import { APIDemo } from '@/app/components/APIDemo';

<APIDemo />
```

---

## 📚 **ملفات التوثيق (Documentation)**

### 1. **README الرئيسي للحساب**
- **الموقع**: `README_ACCOUNT_API.md`
- **المحتوى**: شرح عام لكل الخدمات والمكونات

### 2. **دليل الدمج التفصيلي**
- **الموقع**: `API_INTEGRATION.md`
- **المحتوى**: أمثلة مفصلة لاستخدام API

### 3. **أمثلة التكامل**
- **الموقع**: `INTEGRATION_EXAMPLES.md`
- **المحتوى**: 10 أمثلة عملية للاستخدام

### 4. **دليل الاختبار والتصحيح**
- **الموقع**: `API_TESTING_GUIDE.md`
- **المحتوى**: كيفية اختبار API

### 5. **مرجع نقاط النهاية الإدارية**
- **الموقع**: `ADMIN_ENDPOINTS.md`
- **المحتوى**: توثيق كامل لـ 22 نقطة نهاية إدارية

### 6. **أمثلة الإدارة**
- **الموقع**: `ADMIN_EXAMPLES.md`
- **المحتوى**: أمثلة عملية لاستخدام الخدمات الإدارية

---

## 🛣️ **كيفية إضافة المسارات (Routes)**

أضف هذه المسارات إلى ملف التوجيه الخاص بك:

```typescript
// في src/app/routes.tsx أو src/App.tsx

import { AccountPage } from '@/app/pages/AccountPage';
import { AdminDashboard } from '@/app/components/AdminDashboard';

// أضف هذه المسارات:
<Route path="/account" element={<AccountPage />} />
<Route path="/admin" element={<AdminDashboard />} />
```

---

## 🧪 **اختبار سريع في المتصفح**

### الخطوة 1: افتح تطبيقك
```
http://localhost:5173
```

### الخطوة 2: اختبر صفحة الحساب
```
http://localhost:5173/account
```

### الخطوة 3: اختبر لوحة التحكم
```
http://localhost:5173/admin
```

---

## 📊 **الخريطة الكاملة للمشروع**

```
src/
├── app/
│   ├── services/
│   │   ├── accountService.ts      ← تسجيل الدخول
│   │   ├── userService.ts         ← إدارة المستخدمين
│   │   └── adminService.ts        ← إدارة النظام
│   │
│   ├── components/
│   │   ├── LoginForm.tsx          ← نموذج تسجيل الدخول
│   │   ├── UserForm.tsx           ← نموذج المستخدم
│   │   ├── UsersList.tsx          ← قائمة المستخدمين
│   │   ├── APIDemo.tsx            ← مُختبِر API
│   │   └── AdminDashboard.tsx     ← لوحة التحكم
│   │
│   └── pages/
│       └── AccountPage.tsx        ← صفحة الحساب الرئيسية
│
├── ADMIN_ENDPOINTS.md             ← توثيق نقاط النهاية الإدارية
├── ADMIN_EXAMPLES.md              ← أمثلة الإدارة
├── API_INTEGRATION.md             ← دليل التكامل
├── API_TESTING_GUIDE.md           ← دليل الاختبار
├── INTEGRATION_EXAMPLES.md        ← أمثلة التكامل
└── README_ACCOUNT_API.md          ← الدليل الرئيسي
```

---

## 🔐 **ملخص المصادقة**

1. **تسجيل الدخول**: `AccountPage` → `LoginForm` → `accountService.login()`
2. **حفظ التوكن**: يتم حفظه تلقائياً في `localStorage`
3. **الاستخدام**: جميع الخدمات تستخدم التوكن من `localStorage` تلقائياً

---

## ⚙️ **متطلبات التشغيل**

```bash
# تثبيت المكتبات
npm install

# تشغيل التطبيق
npm run dev

# بناء التطبيق
npm run build
```

---

## 📞 **للمساعدة**

- اقرأ `README_ACCOUNT_API.md` للفهم العام
- اقرأ `API_INTEGRATION.md` للأمثلة المفصلة
- اقرأ `ADMIN_EXAMPLES.md` للأمثلة الإدارية
- استخدم `APIDemo` لاختبار الـ API مباشرة

**تم! 🎉**
