# FleetMap Component

خريطة تفاعلية لعرض السائقين والمسارات ومراكز التجميع والمجتمعات.

## الموقع
- **Component:** `/src/app/components/maps/FleetMap.tsx`
- **Types:** `/src/app/components/maps/types.ts`
- **Index:** `/src/app/components/maps/index.ts`

## المميزات
- ✅ عرض السائقين على الخريطة
- ✅ عرض المسارات مع OSRM routing
- ✅ عرض مراكز التجميع
- ✅ عرض المجتمعات
- ✅ Tooltips تفاعلية
- ✅ Click events لكل عنصر
- ✅ استخدام Leaflet & OpenStreetMap

## الاستخدام

### Import
```tsx
import { FleetMap } from './components/maps';
import type { Driver, Route, Center, Community } from './components/maps';
```

أو من components مباشرة:
```tsx
import { FleetMap, Driver, Route, Center, Community } from './components';
```

### Basic Example
```tsx
import { FleetMap } from './components';

const drivers: Driver[] = [
  {
    id: 'D001',
    name: 'Ahmed Hassan',
    status: 'active',
    load: 75,
    vehicleType: 'Truck',
    lat: 30.0444,
    lng: 31.2357,
  },
];

const routes: Route[] = [
  {
    id: 'R001',
    name: 'Downtown Route',
    status: 'in_progress',
    stops: [],
    coordinates: [
      [30.0444, 31.2357],
      [30.0622, 31.2469],
    ],
  },
];

const centers: Center[] = [
  {
    id: 'C001',
    name: 'Main Collection Center',
    type: 'Primary',
    currentLoad: 850,
    capacity: 1000,
    lat: 30.0444,
    lng: 31.2357,
  },
];

const communities: Community[] = [
  {
    id: 'COM001',
    name: 'Green Warriors',
    members: 150,
    totalBottles: 5000,
    level: 3,
    isJoined: true,
    lat: 30.0622,
    lng: 31.2469,
  },
];

function MyMap() {
  return (
    <FleetMap
      role="admin"
      center={[30.0444, 31.2357]}
      zoom={13}
      height="600px"
      drivers={drivers}
      routes={routes}
      centers={centers}
      communities={communities}
      onDriverClick={(driver) => console.log('Driver clicked:', driver)}
      onRouteClick={(route) => console.log('Route clicked:', route)}
      onCenterClick={(center) => console.log('Center clicked:', center)}
      onCommunityClick={(community) => console.log('Community clicked:', community)}
    />
  );
}
```

## Props

### FleetMapProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `role` | `string` | ✅ | - | دور المستخدم (admin/manager/driver/citizen) |
| `currentUserId` | `string` | ❌ | - | معرف المستخدم الحالي |
| `center` | `[number, number]` | ✅ | - | مركز الخريطة [lat, lng] |
| `zoom` | `number` | ✅ | - | مستوى التكبير (1-20) |
| `height` | `string` | ✅ | - | ارتفاع الخريطة (مثل: '600px' أو '100vh') |
| `drivers` | `Driver[]` | ✅ | - | قائمة السائقين |
| `routes` | `Route[]` | ✅ | - | قائمة المسارات |
| `centers` | `Center[]` | ✅ | - | قائمة مراكز التجميع |
| `communities` | `Community[]` | ✅ | - | قائمة المجتمعات |
| `onDriverClick` | `(driver: Driver) => void` | ✅ | - | عند النقر على سائق |
| `onRouteClick` | `(route: Route) => void` | ✅ | - | عند النقر على مسار |
| `onCenterClick` | `(center: Center) => void` | ✅ | - | عند النقر على مركز |
| `onCommunityClick` | `(community: Community) => void` | ✅ | - | عند النقر على مجتمع |
| `theme` | `'dark' \| 'light'` | ❌ | - | ثيم الخريطة (للاستخدام المستقبلي) |
| `showLayerControl` | `boolean` | ❌ | - | إظهار التحكم بالطبقات (للاستخدام المستقبلي) |
| `showLegend` | `boolean` | ❌ | - | إظهار المفتاح (للاستخدام المستقبلي) |

## Types

### Driver
```tsx
interface Driver {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'on_route' | string;
  load: number;               // 0-100
  vehicleType?: string;
  lat: number;
  lng: number;
}
```

### Route
```tsx
interface Route {
  id: string;
  name: string;
  status: 'planned' | 'in_progress' | 'completed' | string;
  stops: any[];
  distance?: number;          // in km
  duration?: number;          // in minutes
  coordinates: [number, number][];  // [[lat, lng], [lat, lng], ...]
}
```

### Center
```tsx
interface Center {
  id: string;
  name: string;
  type: string;               // 'Primary' | 'Secondary' | etc
  currentLoad: number;
  capacity: number;
  operatingHours?: string;
  lat: number;
  lng: number;
}
```

### Community
```tsx
interface Community {
  id: string;
  name: string;
  members: number;
  totalBottles: number;
  level: number;
  isJoined?: boolean;
  lat: number;
  lng: number;
}
```

## Advanced Example

```tsx
import { useState } from 'react';
import { FleetMap, Driver, Route } from './components';

function AdvancedMap() {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  const handleDriverClick = (driver: Driver) => {
    setSelectedDriver(driver);
    console.log('Driver details:', driver);
    // يمكن فتح modal أو sidebar بتفاصيل السائق
  };

  const handleRouteClick = (route: Route) => {
    setSelectedRoute(route);
    console.log('Route details:', route);
    // يمكن فتح modal أو sidebar بتفاصيل المسار
  };

  return (
    <div className="relative">
      <FleetMap
        role="admin"
        center={[30.0444, 31.2357]}
        zoom={13}
        height="calc(100vh - 200px)"
        drivers={drivers}
        routes={routes}
        centers={centers}
        communities={communities}
        onDriverClick={handleDriverClick}
        onRouteClick={handleRouteClick}
        onCenterClick={(center) => console.log(center)}
        onCommunityClick={(community) => console.log(community)}
      />
      
      {selectedDriver && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
          <h3>{selectedDriver.name}</h3>
          <p>Status: {selectedDriver.status}</p>
          <p>Load: {selectedDriver.load}%</p>
        </div>
      )}
    </div>
  );
}
```

## ملاحظات

### OSRM Routing
- المكون يستخدم OSRM API للحصول على مسارات واقعية على الطرق
- في حالة فشل API، يتم استخدام خطوط مستقيمة بين النقاط
- OSRM API مجاني ولا يحتاج API key

### Leaflet Icons
- حالياً يستخدم الأيقونات الافتراضية
- يمكن تخصيص الأيقونات باستخدام `L.divIcon` أو `L.icon`

### Performance
- الخريطة تعيد رسم العناصر عند تغيير البيانات
- للأداء الأفضل، استخدم `useMemo` للبيانات الكبيرة

### Cairo Coordinates
مركز القاهرة الافتراضي:
```tsx
center={[30.0444, 31.2357]} // Tahrir Square
```

## التخصيص المستقبلي

يمكن إضافة:
- ✨ أيقونات مخصصة لكل نوع
- ✨ طبقات متعددة (traffic, weather)
- ✨ Clustering للعناصر الكثيرة
- ✨ Drawing tools (رسم مسارات جديدة)
- ✨ Heatmap للمناطق الأكثر نشاطاً
- ✨ Real-time tracking

## Dependencies

```json
{
  "leaflet": "^1.9.x",
  "@types/leaflet": "^1.9.x"
}
```

تأكد من تثبيت:
```bash
npm install leaflet @types/leaflet
```

## CSS

يتم استيراد CSS الخاص بـ Leaflet تلقائياً:
```tsx
import 'leaflet/dist/leaflet.css';
```
