# دليل النشر - Deployment Guide

<div dir="rtl">

## نشر تطبيق RecycleHub

هذا الدليل يشرح كيفية نشر تطبيق RecycleHub على منصات مختلفة.

</div>

## 🚀 نشر على Vercel (الموصى به)

Vercel هي المنصة المثالية لنشر تطبيقات Next.js.

### الخطوات

1. **ربط مشروعك بـ Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **إنشاء حساب على Vercel**
   - اذهب إلى [vercel.com](https://vercel.com)
   - سجل دخول باستخدام GitHub/GitLab/Bitbucket

3. **استيراد المشروع**
   - اضغط على "New Project"
   - اختر repository الخاص بك
   - Vercel ستكتشف Next.js تلقائياً

4. **تكوين المشروع**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: next build
   Output Directory: .next
   Install Command: pnpm install
   ```

5. **إضافة Environment Variables** (إن وجدت)
   - اذهب إلى Settings > Environment Variables
   - أضف المتغيرات المطلوبة

6. **النشر**
   - اضغط على "Deploy"
   - انتظر حتى يكتمل البناء
   - احصل على الرابط النهائي

### تحديثات تلقائية
- كل push إلى main branch سيتم نشره تلقائياً
- Pull requests تحصل على preview deployments

## 🔷 نشر على Netlify

### الخطوات

1. **إنشاء netlify.toml**
   ```toml
   [build]
     command = "pnpm build"
     publish = ".next"
   
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **ربط المشروع**
   - اذهب إلى [netlify.com](https://netlify.com)
   - اضغط على "Add new site"
   - اختر "Import an existing project"
   - اختر Git provider وrepository

3. **تكوين Build Settings**
   ```
   Build command: pnpm build
   Publish directory: .next
   ```

4. **النشر**
   - اضغط على "Deploy site"

## ☁️ نشر على AWS (Amazon Web Services)

### استخدام AWS Amplify

1. **تثبيت Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. **تهيئة المشروع**
   ```bash
   amplify init
   ```

3. **إضافة Hosting**
   ```bash
   amplify add hosting
   ```

4. **النشر**
   ```bash
   amplify publish
   ```

## 🐳 نشر باستخدام Docker

### إنشاء Dockerfile

```dockerfile
# Base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
RUN corepack enable pnpm && pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### إنشاء docker-compose.yml

```yaml
version: '3.8'

services:
  recyclehub:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### البناء والتشغيل

```bash
# بناء الصورة
docker build -t recyclehub .

# تشغيل الحاوية
docker run -p 3000:3000 recyclehub

# أو استخدام docker-compose
docker-compose up -d
```

## 🖥️ نشر على VPS (Virtual Private Server)

### متطلبات السيرفر

- Ubuntu 20.04+ / CentOS 8+
- Node.js 18+
- Nginx (اختياري)
- PM2 لإدارة العمليات

### الخطوات

1. **تثبيت Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **تثبيت pnpm**
   ```bash
   npm install -g pnpm
   ```

3. **تثبيت PM2**
   ```bash
   npm install -g pm2
   ```

4. **رفع المشروع**
   ```bash
   git clone YOUR_REPO_URL
   cd recyclehub
   pnpm install
   pnpm build
   ```

5. **تشغيل التطبيق مع PM2**
   ```bash
   pm2 start npm --name "recyclehub" -- start
   pm2 save
   pm2 startup
   ```

6. **تكوين Nginx (اختياري)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **تفعيل SSL (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## 🔒 متغيرات البيئة (Environment Variables)

### للإنتاج

```env
# Public Variables (accessible in browser)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Private Variables (server-side only)
DATABASE_URL=your_database_url
API_SECRET_KEY=your_secret_key
```

### إدارة المتغيرات

#### Vercel
- Dashboard > Settings > Environment Variables

#### Netlify
- Site settings > Build & deploy > Environment

#### VPS
- إنشاء ملف `.env.local`
- **لا تضيف `.env.local` إلى Git!**

## ⚡ تحسينات الأداء

### 1. تفعيل Static Generation

```tsx
// في /src/app/page.tsx
export const dynamic = 'force-static';

export default function Page() {
  // ...
}
```

### 2. Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/images/logo.png"
  alt="Logo"
  width={500}
  height={300}
  priority
/>
```

### 3. تفعيل Compression

#### في next.config.js
```javascript
const nextConfig = {
  compress: true,
  // ...
};
```

### 4. CDN للأصول الثابتة

```javascript
const nextConfig = {
  assetPrefix: 'https://cdn.yourdomain.com',
  // ...
};
```

## 📊 المراقبة (Monitoring)

### Vercel Analytics
```bash
pnpm add @vercel/analytics
```

```tsx
// في /src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Google Analytics

```tsx
// في /src/app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## 🔐 الأمان

### Headers الأمنية

```javascript
// في next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
        ],
      },
    ];
  },
};
```

## 🔄 التحديثات المستمرة

### GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## ✅ قائمة التحقق قبل النشر

- [ ] تم اختبار التطبيق محلياً
- [ ] تم تحديث Environment Variables
- [ ] تم إضافة .gitignore
- [ ] تم اختبار البناء (`pnpm build`)
- [ ] تم تحسين الصور
- [ ] تم إضافة meta tags للـ SEO
- [ ] تم اختبار الأداء
- [ ] تم إعداد المراقبة والتحليلات
- [ ] تم تكوين Headers الأمنية
- [ ] تم اختبار على متصفحات مختلفة
- [ ] تم اختبار على أجهزة مختلفة

## 📞 الدعم

للمساعدة في النشر:
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Discussions](https://github.com/discussions)

---

<div dir="rtl">
نشر موفق! 🚀
</div>
