# ⚡ دليل سريع (Cheat Sheet)

## 🚀 البدء الفوري

```bash
# تثبيت
npm install

# تشغيل
npm run dev

# فتح في المتصفح
http://localhost:5173
```

---

## 🗺️ أين كل ملف؟

| الملف | الموقع |
|------|--------|
| **خدمة تسجيل الدخول** | `src/app/services/accountService.ts` |
| **خدمة المستخدمين** | `src/app/services/userService.ts` |
| **خدمة الإدارة** | `src/app/services/adminService.ts` |
| **نموذج تسجيل** | `src/app/components/LoginForm.tsx` |
| **نموذج مستخدم** | `src/app/components/UserForm.tsx` |
| **جدول المستخدمين** | `src/app/components/UsersList.tsx` |
| **لوحة الإدارة** | `src/app/components/AdminDashboard.tsx` |
| **مختبر API** | `src/app/components/APIDemo.tsx` |
| **صفحة الحساب** | `src/app/pages/AccountPage.tsx` |
| **ملف المسارات** | `src/app/routes.tsx` |

---

## 🔗 الروابط السريعة

| الصفحة | الرابط |
|--------|--------|
| تسجيل الدخول | `http://localhost:5173/account` |
| لوحة الإدارة | `http://localhost:5173/admin` |

---

## 📚 الملفات الموثقة

| الملف | المحتوى |
|------|---------|
| `QUICK_START.md` | 📖 ابدأ من هنا |
| `MAP_AR.md` | 📖 خريطة عربية سريعة |
| `ROUTES_SETUP.md` | 📖 إضافة المسارات |
| `VISUAL_MAP.md` | 📖 مخططات بصرية |
| `README_ACCOUNT_API.md` | 📖 دليل عام شامل |
| `API_INTEGRATION.md` | 📖 أمثلة تكامل |
| `API_TESTING_GUIDE.md` | 📖 اختبار وتصحيح |
| `INTEGRATION_EXAMPLES.md` | 📖 10 أمثلة عملية |
| `ADMIN_ENDPOINTS.md` | 📖 22 نقطة نهاية |
| `ADMIN_EXAMPLES.md` | 📖 أمثلة الإدارة |

---

## 💡 أمثلة كود سريعة

### تسجيل دخول
```typescript
import { accountService } from '@/app/services/accountService';

const response = await accountService.login({
  name: "admin",
  password: "password123",
  role: "Citizen"
});
```

### الحصول على المستخدمين
```typescript
import { userService } from '@/app/services/userService';

const users = await userService.getAllUsers();
```

### الإحصائيات
```typescript
import { getDashboardStats } from '@/app/services/adminService';

const stats = await getDashboardStats();
```

### استخدام مكون تسجيل
```typescript
import { LoginForm } from '@/app/components/LoginForm';

<LoginForm onSuccess={() => alert("تم!")} />
```

### استخدام مكون الإدارة
```typescript
import { AdminDashboard } from '@/app/components/AdminDashboard';

<AdminDashboard />
```

---

## ✅ قائمة التحقق

- [ ] شغلت `npm run dev`
- [ ] فتحت `http://localhost:5173`
- [ ] اختبرت `/account`
- [ ] اختبرت `/admin`
- [ ] قرأت `QUICK_START.md`
- [ ] أضفت المسارات إلى `routes.tsx`
- [ ] اختبرت التسجيل
- [ ] اختبرت الإحصائيات

---

## 🔐 بيانات الاختبار

| الحقل | القيمة |
|------|--------|
| اسم المستخدم | `admin` |
| كلمة المرور | `password123` |
| الدور | `Citizen` |

---

## 🆘 أسئلة سريعة

**س: من أين أبدأ؟**
ج: اقرأ `QUICK_START.md` ثم شغّل التطبيق

**س: كيف أضيف المسارات؟**
ج: اقرأ `ROUTES_SETUP.md`

**س: أين كل ملف؟**
ج: انظر في `MAP_AR.md`

**س: كيف أختبر الـ API؟**
ج: اقرأ `API_TESTING_GUIDE.md`

**س: أريد أمثلة كود؟**
ج: انظر في `INTEGRATION_EXAMPLES.md`

---

## 🎯 الخطوات التالية

1. **اقرأ** `QUICK_START.md` (5 دقائق)
2. **شغّل** التطبيق (1 دقيقة)
3. **اختبر** الصفحات (2 دقيقة)
4. **أضف** المسارات (2 دقيقة)
5. **طور** تطبيقك (∞)

---

## 📞 للمزيد من المساعدة

```
📖 الوثائق: اقرأ الملفات .md
💻 الكود: انظر في src/app/
🧪 الاختبار: استخدم مختبر API
```

---

**🎉 تم! أنت جاهز الآن!**
