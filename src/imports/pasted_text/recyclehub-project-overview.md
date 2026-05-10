# 📋 وصف المشروع الكامل - RecycleHub
## نظام إعادة تدوير الزجاجات الذكية

---

## 🎯 نظرة عامة
تطبيق ويب شامل لإدارة إعادة تدوير الزجاجات الذكية باسم **RecycleHub** يدعم 3 أنواع مستخدمين (Admin/Manager/User) مع لوحة تحكم كاملة وبوابة للمواطنين.

---

## 🛠️ التقنيات المستخدمة

```json
{
  "react": "^18.3.1",
  "typescript": "^5.6.3",
  "react-router": "^7.13.1",
  "lucide-react": "latest",
  "tailwindcss": "^4.0.0"
}
```

**ملاحظة:** تجنب استخدام Recharts أو Motion/Framer Motion للأداء!

---

## 📁 هيكل المشروع

```
src/
├── app/
│   ├── App.tsx                          # Main app component
│   ├── routes.tsx                       # Router configuration
│   │
│   ├── pages/
│   │   ├── LandingPageSimple.tsx       # صفحة الهبوط
│   │   └── dashboard/                   # صفحات Dashboard (12 صفحة)
│   │       ├── Overview.tsx
│   │       ├── SmartAlerts.tsx
│   │       ├── Resources.tsx
│   │       ├── Performance.tsx
│   │       ├── Reports.tsx
│   │       ├── Drivers.tsx
│   │       ├── Routes.tsx
│   │       ├── Citizens.tsx
│   │       ├── Centers.tsx
│   │       ├── Analytics.tsx
│   │       ├── Settings.tsx
│   │       └── Admin.tsx
│   │
│   ├── citizen-portal/
│   │   └── CitizenPortalPage.tsx       # بوابة المواطنين
│   │
│   ├── dashboard/
│   │   └── layout.tsx                   # Dashboard layout (Header + Sidebar)
│   │
│   ├── components/
│   │   ├── SettingsModal.tsx           # Modal الإعدادات (5 tabs)
│   │   ├── AddDriverDialog.tsx         # Modal إضافة سائق
│   │   └── LiveMapView.tsx             # Placeholder للخرائط
│   │
│   └── contexts/
│       └── RoleContext.tsx             # Role management (Admin/Manager/User)
│
├── styles/
│   ├── theme.css                        # Tailwind base + variables
│   ├── fonts.css                        # Font imports
│   └── z-index.css                      # Z-index management
│
├── main.tsx                             # Entry point
└── index.html                           # HTML template
```

---

## 🏗️ البنية التفصيلية

### 1️⃣ **صفحة الهبوط (Landing Page)** 
**المسار:** `/`  
**الملف:** `/src/app/pages/LandingPageSimple.tsx`

#### المحتوى:
- **Header:**
  - Logo RecycleHub (أيقونة Recycle + النص)
  - Navigation links: Features, About, Contact
  - زر "Dashboard" → يروح لـ `/dashboard`

- **Hero Section:**
  - عنوان رئيسي: "Smart Bottle Recycling System"
  - نص توضيحي
  - أزرار CTA: "Get Started" + "Learn More"
  - صورة hero (استخدم unsplash_tool)

- **Stats Section (4 إحصائيات):**
  ```
  1. Bottles Recycled: 2.5M+
  2. Active Citizens: 50K+
  3. Points Awarded: 125M
  4. CO₂ Saved: 1.2K tons
  ```

- **Features Section (3 ميزات):**
  ```
  1. QR Code Verification - أيقونة QrCode
  2. Live Dashboard - أيقونة BarChart3
  3. Instant Rewards - أيقونة Award
  ```

- **CTA Section:**
  - "Ready to start recycling?"
  - زر "Join Now"

- **Footer:**
  - Copyright © 2024 RecycleHub
  - Links: Privacy, Terms, Contact

---

### 2️⃣ **بوابة المواطنين (Citizen Portal)**
**المسار:** `/citizen-portal`  
**الملف:** `/src/app/citizen-portal/CitizenPortalPage.tsx`

#### المحتوى:
- **Header:**
  - Logo + اسم المستخدم + أيقونة Logout

- **Stats Cards (3 كروت):**
  ```
  1. Bottles Recycled: 156 (أيقونة Package)
  2. Points Earned: 4,680 (أيقونة Award)
  3. This Month: 24 (أيقونة TrendingUp)
  ```

- **Action Buttons (2 أزرار كبيرة):**
  ```
  1. 📷 Scan Bottle → يفتح QR scanner (placeholder)
  2. 🎁 View Rewards → يعرض المكافآت
  ```

- **Recent Activity (جدول):**
  ```
  Columns: Date, Bottles, Points, Location
  - 5-10 rows من البيانات التجريبية
  ```

- **Quick Links:**
  - My Profile
  - Leaderboard
  - Help & Support

---

### 3️⃣ **لوحة التحكم (Dashboard)**
**المسار:** `/dashboard/*`  
**الملف:** `/src/app/dashboard/layout.tsx`

---

## 📐 Dashboard Layout Structure

### **Fixed Header** (h-16, z-50)
```tsx
Components:
├── Toggle Sidebar Button (Menu icon)
├── Logo (Sparkles icon + "RecycleHub")
├── Search Bar (lg:visible only)
│   └── Icon: Search
│   └── Placeholder: "Search..."
│   └── Kbd: "⌘K"
├── Home Link → "/" (Home icon)
├── Notifications Button (Bell icon + red dot badge)
└── User Avatar (gradient background + "A")
```

### **Notification Panel** (slideout من اليمين)
```tsx
When opened:
├── Backdrop (bg-black/20)
├── Panel (w-96, right side)
│   ├── Header: "Notifications" + Close button (X)
│   └── List (3 notifications):
│       └── Each: Title, Description, Time
```

### **Fixed Sidebar** (w-64, z-40)
```tsx
Items (10 main pages):
1. Overview       → emerald     → LayoutDashboard
2. Smart Alerts   → red         → Bell
3. Resources      → blue        → Package
4. Performance    → purple      → TrendingUp
5. Reports        → orange      → FileText
6. Drivers        → cyan        → Users
7. Routes         → pink        → MapPin
8. Citizens       → indigo      → UsersRound
9. Centers        → teal        → Building2
10. Analytics     → violet      → BarChart3

Divider (border-t)

Role Switcher (dropdown):
├── Button: Shield icon + Current role (Admin/Manager/User)
└── Dropdown menu (3 options)

Admin Panel (visible only for Admin role):
└── Link to /dashboard/admin

Settings 1 (Link to /dashboard/settings):
└── Settings icon

Settings 2 (Opens SettingsModal):
└── Zap icon

Logout Button (red):
└── LogOut icon
```

**Active State:**
- Background: `bg-gradient-to-r from-slate-500 via-slate-600 to-gray-600`
- Text: `text-white`
- Shadow: `shadow-lg`

---

## 📄 صفحات Dashboard (12 صفحة)

### **1. Overview** `/dashboard/overview`

#### Stats Cards (5 كروت):
```
1. Total Collections: 12,345 (Package icon)
2. Active Drivers: 48 (Users icon)
3. Points Awarded: 125,400 (Award icon)
4. Revenue: $45,230 (DollarSign icon)
5. Efficiency: 94.2% (TrendingUp icon)
```

#### Quick Actions (3 أزرار):
```
1. Add Driver → opens AddDriverDialog
2. Create Route → navigate to /dashboard/routes
3. Generate Report → navigate to /dashboard/reports
```

#### Recent Activities (Table):
```
Columns: Time, Activity, User, Status
- 5 rows من الأنشطة الأخيرة
```

---

### **2. Smart Alerts** `/dashboard/smart-alerts`

#### Filter Tabs:
```
All (badge: total count)
Critical (badge: red)
Warning (badge: yellow)
Info (badge: blue)
```

#### Alerts List:
```
Each alert card:
├── Priority badge (Critical/Warning/Info)
├── Title
├── Description
├── Time ago
└── Action button
```

#### Mock Alerts (10 alerts):
```
Critical:
- Bin #145 is full
- Driver not responding
- System overload detected

Warning:
- Route delay expected
- Low bottle inventory
- Maintenance due

Info:
- New citizen registered
- Report generated
- Route completed
```

---

### **3. Resources** `/dashboard/resources`

#### Resource Cards (4 كروت):
```
1. Bottles
   - Total: 45,230
   - Available: 23,100
   - In Transit: 12,450
   - Processed: 9,680
   - Progress bar

2. Bins
   - Total: 250
   - Active: 238
   - Full: 8
   - Maintenance: 4
   - Progress bar

3. Vehicles
   - Total: 45
   - On Route: 32
   - Available: 10
   - Maintenance: 3
   - Progress bar

4. Staff
   - Total: 156
   - Active: 142
   - On Leave: 10
   - Off Duty: 4
   - Progress bar
```

---

### **4. Performance** `/dashboard/performance`

#### Metrics (4 كروت):
```
1. Collection Rate: 94.2% (↑ 5.3%)
2. Response Time: 12.5 min (↓ 2.1 min)
3. Satisfaction: 4.8/5.0 (↑ 0.3)
4. Efficiency: 89.7% (↑ 3.2%)
```

#### Performance Table:
```
Columns: Driver, Collections, Time, Efficiency, Rating
- 10 rows من بيانات السائقين
```

---

### **5. Reports** `/dashboard/reports`

#### Filter Bar:
```
Date Range Picker (من - إلى)
Report Type Dropdown
Status Filter
```

#### Reports Table:
```
Columns: Name, Type, Date, Status, Actions
- Download button
- View button
- Delete button
```

#### Report Types:
```
1. Daily Collection Report
2. Weekly Performance Report
3. Monthly Revenue Report
4. Driver Activity Report
5. Citizen Engagement Report
6. Environmental Impact Report
```

---

### **6. Drivers** `/dashboard/drivers`

#### Header:
```
Search bar
Filter dropdown (Status, Location)
"Add Driver" button → opens AddDriverDialog
```

#### Driver Cards Grid:
```
Each card:
├── Avatar (gradient)
├── Name + Status badge (Active/Inactive/On Route)
├── Contact info:
│   ├── Phone icon + number
│   ├── Mail icon + email
│   └── MapPin icon + location
├── Stats (3 metrics):
│   ├── Collections: 245
│   ├── Efficiency: 94%
│   └── Rating: 4.8/5
└── Actions:
    ├── View Details
    ├── Assign Route
    └── Contact
```

#### Mock Drivers (12 سائق):
```
Names: أحمد محمد، محمود علي، خالد حسن، etc.
Status: Active, On Route, Inactive
Locations: Cairo, Giza, Alexandria, etc.
```

---

### **7. Routes** `/dashboard/routes`

#### Header:
```
Search bar
Filter (Status, Driver)
"New Route" button
```

#### Routes Table:
```
Columns:
- Route Name
- Driver Name
- Stops Count
- Distance (km)
- Duration
- Status (Active/Completed/Scheduled)
- Actions (View/Edit/Delete)
```

#### Mock Routes (15 مسار):
```
Route #101: Cairo Downtown
Route #102: Giza District
Route #103: Nasr City
etc.
```

---

### **8. Citizens** `/dashboard/citizens`

#### Header:
```
Search bar
Filter (Level, Activity)
Export button
```

#### Citizens Table:
```
Columns:
- Avatar
- Name
- Email
- Points
- Bottles
- Level (Platinum/Gold/Silver/Bronze)
- Actions (View/Contact)
```

#### Level Badges:
```
Platinum: bg-slate-500 (5000+ points)
Gold: bg-amber-500 (3000-4999 points)
Silver: bg-gray-400 (1000-2999 points)
Bronze: bg-orange-700 (0-999 points)
```

#### Mock Citizens (20 مواطن):
```
Names: محمد أحمد، فاطمة علي، أميرة حسن، etc.
Points: 150 - 8500
Bottles: 12 - 520
```

---

### **9. Centers** `/dashboard/centers`

#### Header:
```
Search bar
Filter (Status, Region)
"Add Center" button
```

#### Centers Grid:
```
Each card:
├── Name + Status badge
├── Location (MapPin icon)
├── Capacity bar:
│   └── Current / Maximum
├── Stats:
│   ├── Today: 234 bottles
│   ├── This Week: 1,245
│   └── This Month: 4,680
└── Actions:
    ├── View Details
    ├── View on Map
    └── Manage
```

#### Map Section:
```
Placeholder map with center markers
(Use LiveMapView component)
```

#### Mock Centers (8 مراكز):
```
1. Cairo Central Hub
2. Giza Collection Center
3. Nasr City Point
4. Maadi Recycling Hub
5. Heliopolis Center
6. 6th October Collection
7. Zamalek Drop Point
8. Mohandessin Center
```

---

### **10. Analytics** `/dashboard/analytics`

#### Time Range Selector:
```
This Week / This Month / This Year
Export button
```

#### Stats (4 كروت):
```
1. Total Revenue: $129,700 (↑ 18.2%)
2. Bottles Collected: 43,300 (↑ 24.5%)
3. Active Citizens: 3,000+ (↑ 12.8%)
4. Growth Rate: 22.5% (↑ 5.3%)
```

#### Monthly Trends Table:
```
Columns: Month, Bottles, Revenue, Citizens
- Jan to Jun data
```

#### Summary Cards (3 gradient cards):
```
1. Total Bottles: 43,300 (emerald gradient)
2. Total Revenue: $129,700 (blue gradient)
3. Total Citizens: 720 (purple gradient)
```

**ملاحظة:** بدون Recharts! استخدم جداول بسيطة فقط.

---

### **11. Settings** `/dashboard/settings`

#### Sections (4 أقسام):

**1. Notifications:**
```
Toggle switches:
- Email Notifications
- Push Notifications
- SMS Alerts
- Weekly Reports
```

**2. Appearance:**
```
Radio buttons:
- Light Mode (default)
- Dark Mode
- System Default
```

**3. Language:**
```
Dropdown:
- العربية (Arabic)
- English
- Français
```

**4. Quick Settings Cards:**
```
1. Account Security (Shield icon)
2. Data Backup (Database icon)
3. Export Data (Download icon)
4. System Preferences (Settings icon)
```

---

### **12. Admin** `/dashboard/admin`
**Visible only for Admin role!**

#### System Status Cards (4 كروت):
```
1. Server Status: Online (green)
2. Database: Healthy (green)
3. API Response: 45ms (green)
4. Uptime: 99.9% (green)
```

#### Server Components (6 cards):
```
1. Web Server: Running ✅
2. Database: Connected ✅
3. Cache Server: Active ✅
4. Queue Workers: 4/4 ✅
5. Storage: 245GB/500GB
6. Memory: 8.2GB/16GB
```

#### Recent Alerts (5 alerts):
```
System alerts with severity levels
```

#### Quick Actions (4 أزرار):
```
1. Restart Server
2. Clear Cache
3. Run Backup
4. View Logs
```

---

## 🧩 Components التفصيلية

### **SettingsModal.tsx**
Modal كامل مع 5 tabs:

#### Tabs:
```
1. Profile (User icon - emerald)
   - Name, Email, Phone inputs
   - Avatar upload
   - Save button

2. Notifications (Bell icon - blue)
   - Email toggle
   - Push toggle
   - SMS toggle
   - Report frequency

3. Security (Shield icon - red)
   - Change Password
   - Two-Factor Authentication
   - Active Sessions
   - Security Log

4. Appearance (Palette icon - purple)
   - Theme selector
   - Font size slider
   - Color scheme
   - Layout density

5. Data (Database icon - orange)
   - Export Data
   - Import Data
   - Clear Cache
   - Delete Account
```

---

### **AddDriverDialog.tsx**
Modal لإضافة سائق جديد:

```tsx
Form Fields:
├── Full Name (required)
├── Email (required)
├── Phone (required)
├── Address
├── License Number (required)
├── License Expiry Date
├── Vehicle Type (dropdown)
├── Vehicle Plate Number
└── Emergency Contact

Buttons:
├── Cancel
└── Add Driver
```

---

### **LiveMapView.tsx**
Placeholder بسيط للخريطة:

```tsx
<div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
  <div className="text-center">
    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <p className="text-gray-600">Map View Placeholder</p>
    <p className="text-sm text-gray-500">Integration with maps coming soon</p>
  </div>
</div>
```

**ملاحظة:** تجنب استخدام Leaflet - ثقيل جداً!

---

## 🎨 نظام الألوان الكامل

### **Primary Gradients:**
```css
Emerald: from-emerald-500 to-teal-500
Blue: from-blue-500 to-cyan-500
Purple: from-purple-500 to-pink-500
Orange: from-amber-500 to-orange-500
Red: from-red-500 to-rose-500
```

### **Active States:**
```css
Sidebar Active: from-slate-500 via-slate-600 to-gray-600
Button Hover: hover:brightness-110
Card Hover: hover:shadow-lg
```

### **Status Colors:**
```css
Success: text-green-600, bg-green-50
Warning: text-amber-600, bg-amber-50
Error: text-red-600, bg-red-50
Info: text-blue-600, bg-blue-50
```

### **Level Badges:**
```css
Platinum: bg-slate-500 text-white
Gold: bg-amber-500 text-white
Silver: bg-gray-400 text-white
Bronze: bg-orange-700 text-white
```

---

## 🔧 Context & State Management

### **RoleContext.tsx**
```tsx
Type: 'admin' | 'manager' | 'user'

Features:
- useState for role
- Default: 'manager'
- userName computed from role
- useRole hook للوصول من أي component

Usage:
const { role, setRole, userName } = useRole();
```

---

## 📊 Mock Data Structure

### **Drivers Mock Data:**
```typescript
interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive' | 'on-route';
  collections: number;
  efficiency: number;
  rating: number;
  avatar?: string;
}

// 12 drivers
```

### **Routes Mock Data:**
```typescript
interface Route {
  id: string;
  name: string;
  driver: string;
  stops: number;
  distance: string;
  duration: string;
  status: 'active' | 'completed' | 'scheduled';
}

// 15 routes
```

### **Citizens Mock Data:**
```typescript
interface Citizen {
  id: string;
  name: string;
  email: string;
  points: number;
  bottles: number;
  level: 'platinum' | 'gold' | 'silver' | 'bronze';
  joinDate: string;
}

// 20 citizens
```

### **Centers Mock Data:**
```typescript
interface Center {
  id: string;
  name: string;
  location: string;
  capacity: number;
  current: number;
  status: 'active' | 'full' | 'maintenance';
  stats: {
    today: number;
    week: number;
    month: number;
  }
}

// 8 centers
```

---

## 🎯 Performance Optimizations

### **✅ Applied:**
1. Direct imports (NO lazy loading)
2. CSS transitions only (NO Motion)
3. Minimal external dependencies
4. Simple tables (NO Recharts)
5. No DevTools blocker
6. No external CDN links
7. Optimized images (unsplash)

### **❌ Avoid:**
1. Framer Motion / Motion
2. React Spring
3. Recharts (ثقيل)
4. Leaflet (ثقيل)
5. Heavy animations
6. Large libraries
7. Lazy loading مع Suspense

---

## 📱 Responsive Design

### **Breakpoints:**
```css
sm: 640px   → Mobile
md: 768px   → Tablet
lg: 1024px  → Desktop
xl: 1280px  → Large Desktop
```

### **Sidebar Behavior:**
- Desktop (lg+): Always visible
- Mobile: Toggle with Menu button
- Smooth transition: `transition-transform duration-300`

### **Grid Layouts:**
```css
Stats: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## 🚀 Getting Started

### **1. Create Project:**
```bash
# Use Figma Make or Vite
npm create vite@latest recyclehub -- --template react-ts
```

### **2. Install Dependencies:**
```bash
npm install react-router lucide-react
```

### **3. Setup Tailwind:**
```bash
npm install -D tailwindcss@next @tailwindcss/vite@next
```

### **4. Copy Structure:**
- Follow the folder structure above
- Create all components
- Add mock data
- Test each page

---

## ✅ Checklist

### **Core Pages:**
- [ ] Landing Page
- [ ] Citizen Portal
- [ ] Dashboard Layout
- [ ] Overview
- [ ] Smart Alerts
- [ ] Resources
- [ ] Performance
- [ ] Reports
- [ ] Drivers
- [ ] Routes
- [ ] Citizens
- [ ] Centers
- [ ] Analytics
- [ ] Settings
- [ ] Admin

### **Components:**
- [ ] SettingsModal (5 tabs)
- [ ] AddDriverDialog
- [ ] LiveMapView (placeholder)
- [ ] RoleContext

### **Features:**
- [ ] Role Switcher
- [ ] Notification Panel
- [ ] Search Bars
- [ ] Filter Dropdowns
- [ ] Responsive Sidebar
- [ ] Mock Data
- [ ] CSS Transitions

---

## 🎓 Final Notes

### **Do's:**
✅ Use CSS transitions  
✅ Keep it simple  
✅ Direct imports  
✅ Mock all data  
✅ Responsive design  
✅ Clean code  

### **Don'ts:**
❌ Motion/Framer Motion  
❌ Recharts  
❌ Leaflet maps  
❌ Lazy loading  
❌ Heavy animations  
❌ External CDNs  

---

## 📞 Support

إذا واجهت أي مشكلة:
1. تحقق من console logs
2. راجع هيكل الملفات
3. تأكد من imports صحيحة
4. استخدم Web Preview للاختبار

---

**Good luck! 🚀**
