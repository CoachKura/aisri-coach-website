# Quick Commands - Copy & Paste

## 🚀 Start Development (Use This!)

```powershell
cd E:\AISRi_Coach_System\aisri-website
npm run dev
```

Then open: **http://localhost:3000**

---

## 📦 Install Dependencies (First Time Only)

```powershell
npm install
```

---

## 🏗️ Build for Production

```powershell
npm run build
```

---

## ▶️ Run Production Build

```powershell
npm run start
```

---

## 🧹 Clean & Reinstall

```powershell
rmdir node_modules -Force -Recurse
rm package-lock.json
npm install
npm run dev
```

---

## 🌐 Deploy to Vercel (Easiest)

### Option A: Web Browser (Recommended)
1. Go to https://vercel.com
2. Click "New Project"
3. Connect GitHub
4. Deploy ✅

### Option B: Command Line
```powershell
npm install -g vercel
vercel
```

---

## 📱 Test on Phone

```powershell
ipconfig
# Copy IPv4 Address (e.g., 192.168.1.100)
# On phone: http://192.168.1.100:3000
```

---

## 🔍 Troubleshooting

### Port Already in Use
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Clear Everything
```powershell
rmdir node_modules -Force -Recurse
rmdir .next -Force -Recurse
npm install
npm run dev
```

---

## 📂 Edit These Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Home page (hero, features) |
| `app/contact/page.tsx` | Contact page |
| `components/Navbar.tsx` | Navigation |
| `tailwind.config.js` | Colors |

---

**That's it!** Use `npm run dev` to get started 🚀
