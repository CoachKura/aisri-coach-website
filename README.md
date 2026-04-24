# AISRI Coach - Premium Next.js Website

A modern, production-ready marketing website for AISRI Coach - AI-Powered Performance Coaching platform.

## Features

✨ **Modern UI Design**
- Dark theme with glassmorphism effects
- Smooth Framer Motion animations
- Responsive design (mobile-first)
- Premium visual hierarchy

🎨 **Premium Components**
- Animated AISRI circular score display
- Feature cards with hover effects
- How-it-works step flow
- Contact form
- Footer with links

🚀 **Performance Optimized**
- Next.js 14 with App Router
- Static optimization
- Image optimization
- SEO friendly

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd aisri-website
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```
aisri-website/
├── app/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   ├── contact/
│   │   └── page.tsx       # Contact page
│   └── privacy/
│       └── page.tsx       # Privacy page
├── components/
│   ├── Navbar.tsx         # Navigation bar
│   ├── Footer.tsx         # Footer
│   ├── Card.tsx           # Feature card
│   └── AnimatedCircle.tsx # AISRI score display
├── public/                # Static assets
├── tailwind.config.js     # Tailwind config
└── package.json
```

## Pages

- **Home** (`/`) - Landing page with hero, features, how-it-works
- **Contact** (`/contact`) - Contact form and contact info
- **Privacy** (`/privacy`) - Privacy policy

## Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:
- Primary: `#10B981` (Green)
- Secondary: `#8B5CF6` (Purple)
- Accent: `#F59E0B` (Amber)

### Content
- Update hero section in `app/page.tsx`
- Modify feature cards in features section
- Edit footer links in `components/Footer.tsx`

### Animations
- Control animation delays and durations in component files
- Modify Tailwind animations in `tailwind.config.js`

## Technologies

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Language:** TypeScript
- **Deployment:** Vercel (recommended)

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

```bash
docker build -t aisri-website .
docker run -p 3000:3000 aisri-website
```

## Performance Tips

1. **Images:** Compress and optimize all images
2. **Fonts:** Use system fonts or optimize web fonts
3. **Code Splitting:** Next.js handles this automatically
4. **Lazy Loading:** Use `next/dynamic` for heavy components

## SEO

- Meta tags configured in `layout.tsx`
- Open Graph tags for social sharing
- Responsive design for mobile indexing
- Structured data ready to implement

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT - Feel free to use for your project

## Support

For issues or questions:
1. Check Next.js docs: https://nextjs.org/docs
2. Tailwind docs: https://tailwindcss.com/docs
3. Framer Motion: https://www.framer.com/motion/

---

**Ready to deploy!** Start with Vercel for the best experience.
