# AISRI Coach Website - Deployment Guide

Complete guide to deploy your premium Next.js website to production.

## Quick Deploy (Recommended)

### Vercel (Easiest - 1 minute)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/aisri-website
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Click "Deploy"
   - Done! 🎉

### Environment Variables on Vercel

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_API_URL` = your API endpoint
   - `NEXT_PUBLIC_BACKEND_URL` = your backend URL

## Alternative Deployment Options

### Docker + Nginx (Production Server)

**Step 1: Create Dockerfile**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

**Step 2: Build & Push to Registry**
```bash
docker build -t aisri-website:latest .
docker tag aisri-website:latest myregistry/aisri-website:latest
docker push myregistry/aisri-website:latest
```

**Step 3: Deploy with Docker**
```bash
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com \
  myregistry/aisri-website:latest
```

### Nginx Configuration

```nginx
upstream nextjs {
  server localhost:3000;
}

server {
  listen 80;
  server_name aisricoach.com www.aisricoach.com;
  
  # Redirect to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name aisricoach.com www.aisricoach.com;
  
  # SSL certificates (get from Let's Encrypt)
  ssl_certificate /etc/letsencrypt/live/aisricoach.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/aisricoach.com/privkey.pem;
  
  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;
  
  # Gzip compression
  gzip on;
  gzip_types text/plain text/css text/javascript application/javascript;
  
  location / {
    proxy_pass http://nextjs;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  
  # Cache static assets
  location /_next/static {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

### AWS (EC2 + ELB)

```bash
# 1. SSH into EC2
ssh -i your-key.pem ec2-user@your-instance

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clone repository
git clone https://github.com/yourusername/aisri-website
cd aisri-website

# 4. Install & Build
npm install
npm run build

# 5. Run with PM2
sudo npm install -g pm2
pm2 start "npm start" --name "aisri-website"
pm2 startup
pm2 save

# 6. Configure SSL with Let's Encrypt
sudo certbot certonly --standalone -d aisricoach.com

# 7. Setup reverse proxy with Nginx (see above)
```

### DigitalOcean App Platform

1. Connect GitHub repository
2. Select Next.js in build settings
3. Set environment variables
4. Deploy

### Cloudflare Pages

```bash
# Install Wrangler
npm install -g wrangler

# Deploy
wrangler pages publish .next
```

## Pre-Deployment Checklist

- [ ] Update all placeholder text and links
- [ ] Add real API endpoints
- [ ] Configure analytics (Google Analytics, Mixpanel, etc.)
- [ ] Test contact form integration
- [ ] Verify environment variables
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit
- [ ] Set up error tracking (Sentry)
- [ ] Configure CDN/caching strategy
- [ ] Add SSL certificate
- [ ] Setup automatic backups
- [ ] Configure monitoring/alerts

## Performance Optimization

### Image Optimization
```typescript
import Image from 'next/image';

export default function OptimizedImage() {
  return (
    <Image
      src="/hero-image.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority // Load critical images first
    />
  );
}
```

### Code Splitting
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./heavy'), {
  loading: () => <p>Loading...</p>,
});
```

### Font Optimization
```typescript
// In layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
```

## Monitoring & Analytics

### Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
```

```typescript
// app/layout.tsx
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Google Analytics
```typescript
// lib/analytics.ts
export const gtag = {
  config: (gaId: string) => {
    if (typeof window !== 'undefined') {
      window.gtag?.('config', gaId);
    }
  },
};
```

## Database Integration (Optional)

### Connect to Backend API

```typescript
// lib/api.ts
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export async function submitContact(data: ContactFormData) {
  return api.post('/contact', data);
}
```

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## Post-Deployment

1. **Setup Domain**
   - Point DNS to your hosting
   - Setup SSL certificate

2. **Email Notifications**
   - Setup contact form email integration
   - Configure transactional email service (SendGrid, Mailgun, etc.)

3. **Analytics**
   - Enable Google Search Console
   - Setup Google Analytics
   - Monitor performance with Vercel Analytics

4. **Monitoring**
   - Setup uptime monitoring (UptimeRobot, Pingdom)
   - Configure error alerts
   - Monitor API response times

5. **Backups**
   - Regular database backups
   - Code backups in version control
   - Content backups

## Troubleshooting

### Port Already in Use
```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Build Fails
```bash
# Clear cache
rm -rf .next
npm run build
```

### Out of Memory
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=2048 npm run build
```

## Support & Documentation

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)

---

**Your website is ready to go live!** Choose your deployment platform and follow the steps above.
