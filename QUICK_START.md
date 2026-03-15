# 🚀 البدء السريع - Quick Start

<div dir="rtl">

## تشغيل المشروع في 3 خطوات بسيطة

</div>

## 📋 الخطوات

### 1️⃣ التثبيت
```bash
pnpm install
```

### 2️⃣ التشغيل
```bash
pnpm dev
```

### 3️⃣ الفتح
افتح المتصفح على: **http://localhost:3000**

---

## ✅ هل يعمل؟

إذا رأيت الصفحة الرئيسية لـ RecycleHub، مبروك! 🎉

---

## ❌ لا يعمل؟

### حل سريع (99% من المشاكل)

```bash
# 1. احذف كل شيء
rm -rf node_modules .next package-lock.json yarn.lock pnpm-lock.yaml

# 2. ثبّت من جديد
pnpm install

# 3. شغّل المشروع
pnpm dev
```

### لا يزال لا يعمل؟

اقرأ:
1. **SETUP_INSTRUCTIONS.md** - تعليمات مفصلة
2. **TROUBLESHOOTING.md** - حلول لجميع المشاكل

---

## 🗺️ الصفحات الرئيسية

بعد التشغيل، جرّب هذه الصفحات:

| الصفحة | الرابط |
|--------|--------|
| الصفحة الرئيسية | [http://localhost:3000](http://localhost:3000) |
| بوابة المواطنين | [http://localhost:3000/citizen-portal](http://localhost:3000/citizen-portal) |
| لوحة التحكم | [http://localhost:3000/dashboard](http://localhost:3000/dashboard) |
| إدارة المسارات | [http://localhost:3000/dashboard/routes](http://localhost:3000/dashboard/routes) |
| إدارة السائقين | [http://localhost:3000/dashboard/drivers](http://localhost:3000/dashboard/drivers) |
| التحليلات | [http://localhost:3000/dashboard/analytics](http://localhost:3000/dashboard/analytics) |

---

## 🎯 الميزات الرئيسية

### ✨ صفحة الهبوط
- رسوم متحركة احترافية
- جزيئات طافية في الخلفية
- تأثير الآلة الكاتبة
- عدادات متحركة

### 🗺️ خريطة القاهرة التفاعلية
- **6 سائقين** بمركبات حقيقية
- **10 نقاط تجميع** في القاهرة
- **6 مسارات** نشطة
- تحديث كل **4 ثوانٍ**
- صور أقمار صناعية عالية الدقة

### 📊 لوحة التحكم
- **10 صفحات** متكاملة
- نظام **أدوار** (Admin/Manager/User)
- **مخططات تفاعلية** (Recharts)
- **تقارير** شاملة
- **تحليلات** متقدمة

---

## 🛠️ الأوامر المتاحة

```bash
# التطوير
pnpm dev          # تشغيل development server

# البناء
pnpm build        # بناء للإنتاج
pnpm start        # تشغيل production server

# الفحص
pnpm lint         # فحص الأخطاء

# التنظيف
rm -rf .next      # حذف build cache
```

---

## 📱 التصفح على الجوال

```bash
# احصل على IP address الخاص بك
# Linux/Mac
ifconfig | grep "inet "

# Windows
ipconfig

# ثم افتح على الجوال:
http://YOUR_IP:3000
```

---

## 🎨 التكنولوجيا المستخدمة

- **Framework**: Next.js 15 (App Router)
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS 4
- **Animation**: Motion (Framer Motion)
- **Maps**: Leaflet + React-Leaflet
- **Charts**: Recharts
- **Icons**: Lucide React

---

## 📚 للمزيد من التفاصيل

| الملف | الوصف |
|-------|--------|
| **README.md** | دليل شامل للمشروع |
| **SETUP_INSTRUCTIONS.md** | تعليمات الإعداد التفصيلية |
| **TROUBLESHOOTING.md** | حل جميع المشاكل |
| **MIGRATION_GUIDE.md** | دليل التحويل من Vite |
| **DEPLOYMENT.md** | دليل النشر |
| **CAIRO_DATA.md** | بيانات القاهرة الحقيقية |

---

## 💡 نصيحة

عند التطوير، افتح:
- **Terminal** - لمراقبة أخطاء البناء
- **Browser Console (F12)** - لمراقبة أخطاء JavaScript
- **Browser Network (F12)** - لمراقبة تحميل الموارد

---

<div dir="rtl">

## 🎉 استمتع بالتطوير!

المشروع جاهز للعمل. ابدأ التطوير واستكشف الميزات!

</div>
