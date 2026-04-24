# Windows Quick Start - AISRI Website

## ✅ Step 1: Navigate to Website

```powershell
cd E:\AISRi_Coach_System\aisri-website
```

## ✅ Step 2: Start Development Server

```powershell
npm run dev
```

**You should see:**
```
▲ Next.js 14.1.0
- Local:        http://localhost:3000
```

✅ **Open browser:** http://localhost:3000

## 🛑 Stop Server

Press `Ctrl + C` in PowerShell

---

## 📝 Customize Your Website

### Change Home Page Text

Edit: `app/page.tsx`

Find these lines and update:
```typescript
<h1>
  Train Smarter.
  <br />
  <span className="gradient-text">Run Injury-Free.</span>
</h1>

<p>
  Real-time AISRI scoring, biomechanics analysis, and adaptive training powered by AI.
</p>
```

### Change Colors

Edit: `tailwind.config.js`

Find the `colors` section and update:
```javascript
primary: '#10B981',      // Green - change this to your color
secondary: '#8B5CF6',    // Purple - change this to your color
accent: '#F59E0B',       // Amber - change this to your color
```

### Update Navigation Links

Edit: `components/Navbar.tsx`

Find:
```typescript
const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Athletes', href: '#athletes' },
  { label: 'Contact', href: '/contact' },
];
```

Change labels and hrefs as needed.

---

## 🧪 Test Your Changes

1. Make changes to any file
2. Save the file
3. **Next.js auto-reloads** - no restart needed!
4. Refresh browser to see changes

---

## 🚀 Deploy to Production (Easy Options)

### Option 1: Vercel (Recommended - Easiest)

**Method A: Using Web Browser (Easiest)**
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Connect your GitHub repository
5. Click "Deploy"
6. ✅ Done! Your site is live

**Method B: Using CLI**
```powershell
# Install Vercel CLI
npm install -g vercel@latest

# Deploy
vercel
```

### Option 2: Netlify (Also Easy)

1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "New site from Git"
4. Select your repository
5. Click "Deploy"
6. ✅ Done!

### Option 3: GitHub Pages (Free)

1. Push code to GitHub
2. In repo settings → Pages
3. Select "main" branch
4. ✅ Your site is live at `username.github.io/aisri-website`

### Option 4: Local Build (For Testing)

```powershell
# Build for production
npm run build

# Start production server
npm run start
```

Then open http://localhost:3000

---

## 🔧 If Something Goes Wrong

### Error: "npm not found"
```powershell
# Reinstall Node.js from https://nodejs.org
# Make sure to add to PATH during installation
```

### Error: Port 3000 already in use
```powershell
# Find what's using the port
netstat -ano | findstr :3000

# Kill the process (replace PID with the number)
taskkill /PID <PID> /F
```

### Error: "Module not found"
```powershell
# Delete and reinstall
rmdir node_modules -Force -Recurse
npm install
npm run dev
```

### Clear cache
```powershell
rmdir .next -Force -Recurse
npm run dev
```

---

## 📱 Test on Phone

```powershell
# Get your computer's IP
ipconfig

# Look for "IPv4 Address" like 192.168.1.XXX

# On phone, visit:
# http://192.168.1.XXX:3000
```

---

## 📚 File Locations (For Reference)

| What to Change | File Path |
|---|---|
| Home page content | `app/page.tsx` |
| Contact page | `app/contact/page.tsx` |
| Privacy page | `app/privacy/page.tsx` |
| Navigation links | `components/Navbar.tsx` |
| Footer links | `components/Footer.tsx` |
| Colors | `tailwind.config.js` |
| Global styles | `app/globals.css` |

---

## 🎯 Next Steps

1. **Run locally:** `npm run dev`
2. **Customize:** Edit files to your liking
3. **Test:** Open http://localhost:3000
4. **Deploy:** Use Vercel (easiest)
5. **Done!** Your website is live 🎉

---

## 💡 Pro Tips

- Changes save automatically (hot reload)
- No need to restart server when editing
- Check browser console for errors (F12)
- Mobile view: F12 → Click phone icon
- Test form submission logs to console

---

**Need help?**
- Check README.md for full documentation
- Check SETUP_GUIDE.md for advanced setup
- Visit Next.js docs: https://nextjs.org/docs
