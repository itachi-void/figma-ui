
📋 وصف المشروع الكامل - RecycleHub
نظرة عامة
تطبيق ويب شامل لإعادة تدوير الزجاجات الذكية باسم RecycleHub باستخدام:

⚛️ React 18 + TypeScript
🎨 Tailwind CSS v4
🚦 React Router v7
📊 Recharts (للرسوم البيانية)
🎭 Lucide React (للأيقونات)
🏗️ البنية الأساسية
1️⃣ صفحة الهبوط (Landing Page)
صفحة رئيسية بسيطة تحتوي على:

Header مع شعار RecycleHub وزر Dashboard
Hero section مع عنوان "Smart Bottle Recycling"
إحصائيات سريعة (Bottles Recycled, Active Citizens, Points, CO₂ Saved)
Features section (QR Verification, Live Dashboard, Instant Rewards)
CTA section
Footer بسيط
المسار: /

2️⃣ بوابة المواطنين (Citizen Portal)
صفحة للمواطنين تحتوي على:

Dashboard بسيط مع إحصائيات (Bottles Recycled, Points Earned, This Month)
زر "Scan Bottle" للمسح
زر "View Rewards" للمكافآت
History للنشاطات السابقة
المسار: /citizen-portal

3️⃣ لوحة التحكم (Dashboard)
نظام dashboard كامل مع:

Layout Structure:
Fixed Header: يحتوي على:

زر toggle للـ sidebar
شعار RecycleHub
Search bar
أيقونة Home
أيقونة Notifications (مع notification panel)
Avatar المستخدم
Fixed Sidebar: يحتوي على:

قائمة الصفحات (10 صفحات رئيسية)
Role Switcher (Admin/Manager/User)
Admin Panel link (للـ admin فقط)
Settings links (2 أزرار)
Logout button
صفحات Dashboard (13 صفحة):
Overview (/dashboard/overview)

Stats cards (5 كروت)
Recent activities list
Quick actions buttons
Collection trends chart بسيط
Smart Alerts (/dashboard/smart-alerts)

Alerts list حسب الأولوية (Critical, Warning, Info)
فلترة حسب النوع
إحصائيات الـ alerts
Resources (/dashboard/resources)

جدول الموارد (Bottles, Bins, Vehicles, Staff)
Status indicators
Progress bars
Performance (/dashboard/performance)

Performance metrics
Charts للأداء
Comparison data
Reports (/dashboard/reports)

قائمة التقارير
أزرار Generate/Download
فلترة حسب التاريخ
Drivers (/dashboard/drivers)

قائمة السائقين
معلومات كل سائق (Name, Phone, Email, Location)
إحصائيات (Collections, Efficiency, Rating)
Search & Filter
زر Add Driver (مع dialog)
Routes (/dashboard/routes)

قائمة المسارات
معلومات كل مسار (Name, Driver, Stops, Distance, Duration, Status)
Search & Filter
زر New Route
Citizens (/dashboard/citizens)

قائمة المواطنين
معلومات كل مواطن (Name, Email, Points, Bottles, Level)
Levels: Platinum, Gold, Silver, Bronze
Search & Filter
Centers (/dashboard/centers)

قائمة مراكز التجميع
معلومات كل مركز (Name, Location, Capacity, Status)
خريطة (placeholder)
Analytics (/dashboard/analytics)

Deep analytics
جدول بيانات بسيط (بدون Recharts للأداء)
إحصائيات متقدمة
Settings (/dashboard/settings)

Notification preferences
Appearance settings
Language selector
Quick settings cards
Admin (/dashboard/admin)

System status
Server components monitoring
Recent alerts
Quick actions
🎨 التصميم والألوان
Gradient Colors:
Primary: from-emerald-500 to-teal-500
Secondary: from-blue-500 to-cyan-500
Accent: from-purple-500 to-pink-500
Warning: from-amber-500 to-orange-500
Active States:
Active sidebar item: from-slate-500 via-slate-600 to-gray-600
🔧 Components المطلوبة
1. Reusable Components:
LoadingSpinner - loader بسيط
Toast - notification toast
EmptyState - empty state placeholder
LiveMapView - placeholder للخرائط
AddDriverDialog - modal لإضافة سائق
SettingsModal - modal للإعدادات
PerformanceMonitor - performance tracker (اختياري)
📦 Dependencies المطلوبة:
{
  "lucide-react": "latest",
  "react-router": "^7.13.1",
  "recharts": "latest" (اختياري - يمكن استخدام جداول بسيطة بدلاً منه)
}
🚀 Features الأساسية:
✅ Responsive Design - يعمل على mobile و desktop
✅ Role-based Access - 3 أدوار (Admin, Manager, User)
✅ Simple Navigation - React Router v7
✅ Clean UI - Tailwind CSS بدون animations ثقيلة
✅ Fast Loading - بدون lazy loading معقد
✅ Search & Filter - في الصفحات المطلوبة
✅ Mock Data - بيانات تجريبية لكل الصفحات
🎯 الأولويات:
الأداء أولاً - بدون Motion/Framer Motion
CSS Transitions فقط - للـ hover effects
بدون External CDN - كل شيء local
Direct Imports - بدون lazy loading معقد
📝 ملاحظات مهمة:
استخدم CSS transitions بدلاً من Motion
كل الـ data mock (تجريبي)
الـ maps placeholder (مش حقيقية)
RTL support في index.html
بدون React DevTools (للأداء)