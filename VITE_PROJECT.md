# ✅ RecycleHub - Vite + React Project

## 🚀 This is NOW a Vite Project!

The project has been **fully converted back to Vite + React** with React Router.

## 📦 How to Run

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## 🏗️ Project Structure

```
RecycleHub/
├── index.html              ✅ Entry HTML (Vite)
├── vite.config.ts          ✅ Vite configuration
├── src/
│   ├── main.tsx            ✅ Entry point
│   ├── app/
│   │   ├── App.tsx         ✅ Main component with React Router
│   │   ├── pages/          ✅ Page components
│   │   ├── components/     ✅ Reusable components
│   │   ├── dashboard/      ✅ Dashboard with routing
│   │   └── contexts/       ✅ React contexts
│   └── styles/             ✅ Global styles
└── package.json            ✅ Vite dependencies
```

## ⚡ Technology Stack

- **Build Tool**: Vite 6.3.5
- **Framework**: React 18.3.1
- **Router**: React Router DOM 6.28.1
- **Styling**: Tailwind CSS 4.1.12
- **Animations**: Motion (Framer Motion)
- **Maps**: Leaflet + React Leaflet
- **UI Components**: Radix UI

## 🎯 Features

- ✅ Smart Bottle Recycling System
- ✅ Real-time Cairo map with 6 drivers, 6 zones, 10 centers, 40+ locations
- ✅ Advanced animations (particles, typewriter, counters, progress bars)
- ✅ Multi-role dashboard (Admin, Manager, User)
- ✅ QR code verification
- ✅ Route management
- ✅ Live tracking
- ✅ Rewards system
- ✅ Analytics and reports

## 📍 Routes

### Public Routes
- `/` - Landing page
- `/citizen-portal` - Citizen portal

### Dashboard Routes
- `/dashboard/overview` - Overview
- `/dashboard/smart-alerts` - Smart alerts
- `/dashboard/resources` - Resources
- `/dashboard/performance` - Performance metrics
- `/dashboard/reports` - Reports
- `/dashboard/drivers` - Drivers management
- `/dashboard/routes` - Routes planning
- `/dashboard/citizens` - Citizens management
- `/dashboard/centers` - Collection centers
- `/dashboard/analytics` - Analytics
- `/dashboard/settings` - Settings
- `/dashboard/admin` - Admin panel (admin only)

## 🔧 Development

```bash
# Install
pnpm install

# Dev server
pnpm dev
# Opens at http://localhost:5173

# Build
pnpm build

# Preview build
pnpm preview
```

## ✅ What Changed from Next.js

| Feature | Next.js | Vite + React |
|---------|---------|--------------|
| Entry | `/src/app/page.tsx` | `/src/main.tsx` |
| Router | App Router | React Router DOM |
| Build | Next.js | Vite |
| Routing | File-based | Component-based |
| Links | `<Link href>` from next/link | `<Link to>` from react-router-dom |
| Navigation | `usePathname()` | `useLocation()` |
| Layouts | `{children}` prop | `<Outlet />` |

## 🎨 Styling

Tailwind CSS v4 with:
- Custom theme in `/src/styles/theme.css`
- Custom fonts in `/src/styles/fonts.css`
- Vite plugin `@tailwindcss/vite`

## 🗺️ Map Integration

Uses Leaflet with:
- High-resolution satellite imagery
- Real Cairo data (6 drivers, 6 zones, 10 centers)
- Interactive markers and routing
- CSS loaded in `index.html`

## 📚 Key Files

| File | Purpose |
|------|---------|
| `/index.html` | HTML entry point |
| `/vite.config.ts` | Vite configuration |
| `/src/main.tsx` | React entry point |
| `/src/app/App.tsx` | Main app with routing |
| `/src/app/dashboard/layout.tsx` | Dashboard shell |
| `/package.json` | Dependencies & scripts |

## 🛠️ Scripts

```json
{
  "dev": "vite",           // Development server
  "build": "vite build",   // Production build
  "preview": "vite preview" // Preview production build
}
```

## ✨ Status

✅ **Fully functional Vite + React project**  
✅ **No Next.js dependencies**  
✅ **Clean Vite configuration**  
✅ **React Router for navigation**  
✅ **All features working**

---

**Updated**: March 13, 2026  
**Framework**: Vite + React  
**Status**: Production Ready 🚀
