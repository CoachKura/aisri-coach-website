# Setup Guide - AISRI Coach Website

Complete setup instructions for development and deployment.

## For Developers

### Prerequisites
- Node.js 18+ (https://nodejs.org)
- Git (https://git-scm.com)
- Code editor (VS Code recommended)

### Windows Setup

```powershell
# 1. Clone or navigate to project
cd aisri-website

# 2. Install dependencies
npm install

# 3. Create environment file
Copy-Item .env.example -Destination .env.local

# 4. Start development server
npm run dev
```

Open http://localhost:3000

### macOS/Linux Setup

```bash
cd aisri-website
npm install
cp .env.example .env.local
npm run dev
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Format code
npm run format (if configured)

# Lint code
npm run lint (if configured)
```

## Project Structure

```
aisri-website/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with Navbar & Footer
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   ├── contact/
│   │   └── page.tsx         # Contact page
│   └── privacy/
│       └── page.tsx         # Privacy page
├── components/              # Reusable components
│   ├── Navbar.tsx          # Navigation bar
│   ├── Footer.tsx          # Footer
│   ├── Card.tsx            # Feature card component
│   └── AnimatedCircle.tsx  # AISRI score display
├── public/                  # Static assets
├── node_modules/           # Dependencies
├── .env.example            # Environment template
├── .gitignore
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project metadata & dependencies
```

## Customizing Content

### Update Home Page Text

Edit `app/page.tsx`:
```typescript
// Hero section
<h1>Your new title</h1>
<p>Your new subtitle</p>

// Feature cards
<Card title="New Feature" description="Description here" />
```

### Change Colors

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#YOUR_HEX_COLOR',
      secondary: '#YOUR_HEX_COLOR',
    },
  },
}
```

### Update Navigation Links

Edit `components/Navbar.tsx`:
```typescript
const navItems = [
  { label: 'Your Link', href: '/your-page' },
];
```

## Adding New Pages

**Create a new route:**
```bash
# Create directory
mkdir app/your-page

# Create page file
# app/your-page/page.tsx
export default function YourPage() {
  return <div>Your content</div>;
}
```

The page is automatically available at `/your-page`

## Styling Components

### Using Tailwind CSS

```typescript
<div className="bg-green-600 text-white p-4 rounded-lg">
  Styled with Tailwind
</div>
```

### Using CSS Modules

```typescript
import styles from './Component.module.css';

export default function Component() {
  return <div className={styles.container}>Content</div>;
}
```

### Using Global CSS

Edit `app/globals.css` to add global styles.

## Adding Animations

### Framer Motion

```typescript
import { motion } from 'framer-motion';

export default function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Animated content
    </motion.div>
  );
}
```

## Form Integration

### Contact Form Setup

Currently the contact form logs to console. To make it work:

**Option 1: Email Service (SendGrid)**
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req: Request) {
  const { name, email, message } = await req.json();
  
  await sgMail.send({
    to: 'hello@aisricoach.com',
    from: 'noreply@aisricoach.com',
    subject: `New message from ${name}`,
    text: message,
  });
  
  return Response.json({ success: true });
}
```

**Option 2: Backend API**
```typescript
const response = await fetch('/api/contact', {
  method: 'POST',
  body: JSON.stringify({ name, email, message }),
});
```

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

- `NEXT_PUBLIC_*` - Exposed to browser
- Other variables - Server-side only

## Deployment Checklist

Before deploying:
- [ ] Update all contact information
- [ ] Configure environment variables
- [ ] Test all links and forms
- [ ] Optimize images
- [ ] Test on mobile
- [ ] Run Lighthouse audit
- [ ] Setup analytics
- [ ] Configure error tracking
- [ ] Setup monitoring

See `DEPLOYMENT.md` for detailed deployment instructions.

## Common Issues

### Port 3000 Already in Use

```powershell
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Module Not Found

```bash
npm install
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
npm run type-check  # Check TypeScript errors
rm -rf .next        # Clear build cache
npm run build       # Try building again
```

## Performance Tips

1. **Lazy Load Heavy Components**
   ```typescript
   import dynamic from 'next/dynamic';
   const HeavyComponent = dynamic(() => import('./heavy'));
   ```

2. **Optimize Images**
   - Use Next.js Image component
   - Compress images before uploading
   - Use WebP format

3. **Code Splitting**
   - Next.js handles automatically
   - Use dynamic imports for large features

4. **Caching**
   - Configure cache headers
   - Use Vercel Edge Caching

## Testing Locally

### Browser DevTools
- Check Network tab for slow requests
- Use Lighthouse for performance audit
- Check Console for errors

### Mobile Testing
```bash
# Get your local IP
ipconfig getifaddr en0  # macOS
hostname -I             # Linux
ipconfig                # Windows

# Access on phone
http://YOUR_IP:3000
```

## Next Steps

1. **Customize Content** - Update text, colors, and images
2. **Setup Backend** - Connect to your AISRI backend API
3. **Configure Forms** - Integrate email service
4. **Deploy** - Follow `DEPLOYMENT.md`
5. **Monitor** - Setup analytics and error tracking

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

**You're all set!** Start developing with `npm run dev` 🚀
