# UI Components Library

مجموعة شاملة من مكونات واجهة المستخدم المبنية على **Radix UI** و **Tailwind CSS v4**.

## المكونات المُضافة ✅

### 1. **Accordion** ✅
- **الموقع:** `/src/app/components/ui/accordion.tsx`
- **الوصف:** قوائم قابلة للطي والتوسيع
- **المكتبة:** @radix-ui/react-accordion
- **الاستخدام:**
```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui';

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

### 2. **Alert** ✅
- **الموقع:** `/src/app/components/ui/alert.tsx`
- **الوصف:** رسائل تنبيه مع أنواع مختلفة
- **Variants:** default, destructive
- **الاستخدام:**
```tsx
import { Alert, AlertTitle, AlertDescription } from './components/ui';
import { AlertCircle } from 'lucide-react';

<Alert variant="destructive">
  <AlertCircle />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please log in again.
  </AlertDescription>
</Alert>
```

---

### 3. **AlertDialog** ✅
- **الموقع:** `/src/app/components/ui/alert-dialog.tsx`
- **الوصف:** نوافذ حوارية للتأكيد
- **المكتبة:** @radix-ui/react-alert-dialog
- **الاستخدام:**
```tsx
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from './components/ui';

<AlertDialog>
  <AlertDialogTrigger>Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

### 4. **AspectRatio** ✅
- **الموقع:** `/src/app/components/ui/aspect-ratio.tsx`
- **الوصف:** حاوية بنسبة عرض/ارتفاع محددة
- **المكتبة:** @radix-ui/react-aspect-ratio
- **الاستخدام:**
```tsx
import { AspectRatio } from './components/ui';

<AspectRatio ratio={16 / 9}>
  <img src="..." alt="..." className="object-cover w-full h-full" />
</AspectRatio>
```

---

### 5. **Avatar** ✅
- **الموقع:** `/src/app/components/ui/avatar.tsx`
- **الوصف:** صورة مستخدم مع fallback
- **المكتبة:** @radix-ui/react-avatar
- **الاستخدام:**
```tsx
import { Avatar, AvatarImage, AvatarFallback } from './components/ui';

<Avatar>
  <AvatarImage src="https://..." alt="@username" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

---

### 6. **Badge** ✅
- **الموقع:** `/src/app/components/ui/badge.tsx`
- **الوصف:** شارات ملونة للحالات
- **Variants:** default, secondary, destructive, outline
- **الاستخدام:**
```tsx
import { Badge } from './components/ui';

<Badge>New</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Draft</Badge>
```

---

### 7. **Breadcrumb** ✅
- **الموقع:** `/src/app/components/ui/breadcrumb.tsx`
- **الوصف:** مسار التنقل
- **الاستخدام:**
```tsx
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './components/ui';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Dashboard</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

### 8. **Button** ✅
- **الموقع:** `/src/app/components/ui/button.tsx`
- **الوصف:** أزرار بأنماط متعددة
- **Variants:** default, destructive, outline, secondary, ghost, link
- **Sizes:** default, sm, lg, icon
- **الاستخدام:**
```tsx
import { Button } from './components/ui';

<Button>Click me</Button>
<Button variant="outline" size="lg">Large Button</Button>
<Button variant="ghost" size="icon"><Plus /></Button>
```

---

### 9. **Calendar** ✅
- **الموقع:** `/src/app/components/ui/calendar.tsx`
- **الوصف:** تقويم لاختيار التواريخ
- **المكتبة:** react-day-picker
- **الاستخدام:**
```tsx
import { Calendar } from './components/ui';
import { useState } from 'react';

const [date, setDate] = useState<Date | undefined>(new Date());

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
/>
```

---

### 10. **Card** ✅
- **الموقع:** `/src/app/components/ui/card.tsx`
- **الوصف:** بطاقات للمحتوى
- **Components:** Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction
- **الاستخدام:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

## المكتبات المطلوبة

تأكد من تثبيت المكتبات التالية:

```bash
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-slot class-variance-authority clsx tailwind-merge react-day-picker
```

---

## التصدير المركزي

يمكنك استيراد جميع المكونات من `/src/app/components/ui/index.ts`:

```tsx
import { 
  Accordion, 
  Alert, 
  AlertDialog, 
  Avatar, 
  Badge, 
  Breadcrumb, 
  Button, 
  Calendar, 
  Card 
} from './components/ui';
```

---

## الميزات الرئيسية

✅ **Radix UI Primitives** - مكونات accessible ومستقرة  
✅ **Tailwind CSS v4** - تصميم حديث ومرن  
✅ **TypeScript** - أنواع كاملة ومحددة  
✅ **Class Variance Authority** - أنماط متعددة سهلة  
✅ **Accessible** - ARIA labels ودعم keyboard  
✅ **Dark Mode Ready** - دعم كامل للوضع الداكن  
✅ **Customizable** - سهولة التخصيص عبر className  

---

## المكونات الموجودة مسبقاً

المكونات التالية كانت موجودة في المشروع:
- Carousel
- Chart
- Checkbox
- Collapsible
- Command
- ContextMenu
- Dialog
- Drawer
- DropdownMenu
- Form
- HoverCard
- Input
- InputOTP
- Label
- Menubar
- NavigationMenu
- Pagination
- Popover
- Progress
- RadioGroup
- Resizable
- ScrollArea
- Select
- Separator
- Sheet
- Sidebar
- Skeleton
- Slider
- Sonner
- Switch
- Table
- Tabs
- Textarea
- Toggle
- ToggleGroup
- Tooltip

---

## الخلاصة

تم إضافة **10 مكونات UI جديدة** بنجاح! ✅

**المكونات الجديدة:**
1. Accordion
2. Alert
3. AlertDialog
4. AspectRatio
5. Avatar
6. Badge
7. Breadcrumb
8. Button
9. Calendar
10. Card

**المكونات الكلية:** 50+ مكوناً جاهزاً للاستخدام!

جميع المكونات:
- ✅ مبنية على Radix UI
- ✅ متوافقة مع Tailwind CSS v4
- ✅ TypeScript كامل
- ✅ Accessible
- ✅ Customizable
- ✅ Production-ready

**UI Components Library جاهزة! 🎨✨**
