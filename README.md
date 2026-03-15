# RecycleHub - نظام إعادة تدوير الزجاجات الذكية

<div dir="rtl">

## ⚡ هذا المشروع يستخدم Vite + React

تم تحويل المشروع بالكامل إلى **Vite + React** مع **React Router DOM**.

</div>

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Technology Stack

- **⚡ Vite** 6.3.5 - Lightning-fast build tool
- **⚛️ React** 18.3.1 - UI library
- **🛣️ React Router DOM** 6.28.1 - Client-side routing
- **🎨 Tailwind CSS** 4.1.12 - Utility-first CSS
- **✨ Motion** (Framer Motion) - Animations
- **🗺️ Leaflet** - Interactive maps
- **🎯 TypeScript** - Type safety

## 🏗️ Project Structure

```
RecycleHub/
├── index.html                 # Entry HTML
├── vite.config.ts             # Vite configuration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
│
├── src/
│   ├── main.tsx               # Application entry point
│   ├── app/
│   │   ├── App.tsx            # Main component with routing
│   │   ├── pages/             # Page components
│   │   │   └── LandingPage.tsx
│   │   ├── dashboard/         # Dashboard
│   │   │   ├── layout.tsx     # Dashboard layout
│   │   │   ├── overview/      # Overview page
│   │   │   ├── smart-alerts/  # Smart alerts
│   │   │   ├── resources/     # Resources
│   │   │   ├── performance/   # Performance
│   │   │   ├── reports/       # Reports
│   │   │   ├── drivers/       # Drivers management
│   │   │   ├── routes/        # Route planning
│   │   │   ├── citizens/      # Citizens management
│   │   │   ├── centers/       # Collection centers
│   │   │   ├── analytics/     # Analytics
│   │   │   ├── settings/      # Settings
│   │   │   └── admin/         # Admin panel
│   │   ├── citizen-portal/    # Public citizen portal
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # React contexts
│   │   └── utils/             # Utilities
│   └── styles/                # Global styles
│       ├── theme.css          # Theme variables
│       └── fonts.css          # Font imports
```

## 🗺️ Routes

### Public Routes
- `/` - Landing page with advanced animations
- `/citizen-portal` - Citizen interaction portal

### Dashboard Routes (Protected)
- `/dashboard/overview` - System overview
- `/dashboard/smart-alerts` - Real-time alerts
- `/dashboard/resources` - Resource management
- `/dashboard/performance` - Performance metrics
- `/dashboard/reports` - Comprehensive reports
- `/dashboard/drivers` - Driver management (6 drivers)
- `/dashboard/routes` - Route optimization (6 zones)
- `/dashboard/citizens` - Citizen management
- `/dashboard/centers` - Collection centers (10 centers)
- `/dashboard/analytics` - Advanced analytics
- `/dashboard/settings` - Settings page
- `/dashboard/admin` - Admin panel (admin role only)

## 🎯 Features

### Core Features
- ✅ **Smart Bottle Collection** - QR code verification
- ✅ **Real-time Tracking** - Live driver locations
- ✅ **Route Optimization** - AI-powered route planning
- ✅ **Rewards System** - Gamification for citizens
- ✅ **Multi-role Dashboard** - Admin, Manager, User roles
- ✅ **Analytics & Reports** - Comprehensive data insights

### Map Integration
- ✅ **Real Cairo Data** - 6 drivers, 6 zones, 10 centers, 40+ locations
- ✅ **High-res Satellite Imagery** - OpenStreetMap satellite tiles
- ✅ **Interactive Markers** - Custom icons for drivers and centers
- ✅ **Live Updates** - Real-time position tracking
- ✅ **Route Visualization** - Optimized collection routes

### Advanced Animations
- ✅ **Floating Particles** - Background particle effects
- ✅ **Typewriter Effect** - Animated text reveals
- ✅ **Animated Counters** - Number counting animations
- ✅ **Progress Bars** - Smooth progress indicators
- ✅ **Hover Effects** - Interactive UI elements
- ✅ **Mouse Tracking** - Cursor-following effects
- ✅ **Smooth Transitions** - Page and component transitions

## 🛠️ Development

### Install Dependencies
```bash
pnpm install
```

### Run Development Server
```bash
pnpm dev
```
Opens at [http://localhost:5173](http://localhost:5173)

### Build for Production
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

## 📝 Key Technologies

### Frontend Framework
- **Vite** - Fast build tool with HMR
- **React 18** - Latest React with concurrent features
- **TypeScript** - Type-safe development

### Routing
- **React Router DOM v6** - Declarative routing
- Component-based route definitions
- Nested routes with `<Outlet />`
- Dynamic navigation with `useLocation()`

### Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **@tailwindcss/vite** - Vite plugin for Tailwind
- Custom theme configuration
- CSS variables for theming

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Motion** (Framer Motion) - Animation library
- **Recharts** - Chart library
- **React Slick** - Carousel component

### Maps & Location
- **Leaflet** - Interactive map library
- **React Leaflet** - React components for Leaflet
- OpenStreetMap satellite tiles
- Custom marker clustering

### Form Handling
- **React Hook Form** - Performant form library
- **Zod** - Schema validation (if needed)

### Data Management
- **React Context API** - State management
- Custom hooks for data fetching
- Role-based access control

## 🎨 Styling System

### Tailwind CSS v4
The project uses Tailwind CSS v4 with the Vite plugin:

```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### Theme Configuration
Custom theme in `/src/styles/theme.css`:
- Color variables
- Font families
- Spacing scale
- Border radius
- Shadows

### Font System
Custom fonts in `/src/styles/fonts.css`:
- Primary font: Inter
- Arabic support: Cairo
- Font weight variations

## 🗺️ Cairo Map Data

### Drivers (6)
Real Cairo drivers with routes covering:
- Nasr City
- Maadi
- Heliopolis
- 6th October
- New Cairo
- Downtown Cairo

### Zones (6)
Geographic zones mapped to Cairo districts:
- North Zone
- South Zone
- East Zone
- West Zone
- Central Zone
- Outer Zone

### Collection Centers (10)
Strategic locations across Cairo:
- Main Collection Hub (Downtown)
- Nasr City Center
- Maadi Collection Point
- And 7 more...

### Locations (40+)
Pickup points distributed across all zones

## 📊 Dashboard Features

### Overview
- Real-time statistics
- Collection metrics
- Performance indicators
- Recent activities

### Smart Alerts
- Bin capacity warnings
- Route optimization alerts
- Driver status updates
- System notifications

### Resources
- Inventory management
- Equipment tracking
- Supply chain monitoring

### Performance
- Driver performance metrics
- Collection efficiency
- Response time analytics
- Goal tracking

### Reports
- Daily/Weekly/Monthly reports
- Export to PDF/Excel
- Custom report builder
- Historical data analysis

### Drivers
- Driver management
- Route assignments
- Performance tracking
- Communication tools

### Routes
- Route optimization
- Zone management
- Schedule planning
- Real-time adjustments

### Citizens
- User registration
- Reward points
- Activity history
- Engagement metrics

### Centers
- Center management
- Capacity monitoring
- Maintenance scheduling
- Resource allocation

### Analytics
- Advanced data visualization
- Trend analysis
- Predictive insights
- Custom dashboards

## 🔐 Role-Based Access

### Admin
- Full system access
- User management
- System configuration
- Access to admin panel

### Manager
- Dashboard access
- Report generation
- Driver management
- Limited system settings

### User
- View-only dashboard
- Personal statistics
- Reward tracking
- Basic reports

## 🎭 Animation System

### Motion (Framer Motion)
```typescript
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Animation Features
- Page transitions with `<AnimatePresence>`
- Hover and tap gestures
- Scroll-triggered animations
- Complex orchestrated sequences
- Physics-based spring animations

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Adaptive layouts for tablets
- **Desktop Optimized** - Full-featured desktop experience
- **Touch Friendly** - Touch-optimized interactions

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 📚 Documentation Files

- 📄 `VITE_PROJECT.md` - Vite project details
- 📄 `QUICK_START.md` - Quick start guide
- 📄 `TROUBLESHOOTING.md` - Common issues and solutions

## 🐛 Troubleshooting

### Vite Dev Server Issues
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml dist
pnpm install
pnpm dev
```

### Build Errors
```bash
# Type check
pnpm tsc --noEmit

# Build
pnpm build
```

### Map Not Loading
- Check internet connection
- Ensure Leaflet CSS is loaded in `index.html`
- Verify map container has explicit height

## 📄 License

This project is for educational and demonstration purposes.

## 👥 Contributors

RecycleHub Development Team

---

<div dir="rtl">

## 🎯 الخلاصة

المشروع الآن:
- ✅ **Vite + React** بالكامل
- ✅ **React Router DOM** للتنقل
- ✅ **لا يوجد Next.js نهائياً**
- ✅ **جميع الميزات تعمل**
- ✅ **جاهز للإنتاج**

للتشغيل:
```bash
pnpm install
pnpm dev
```

</div>

---

**Updated**: March 13, 2026  
**Framework**: Vite + React  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
