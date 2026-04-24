# AISRI Coach Website - Features & Components

## Pages

### Home Page (`/`)
- **Hero Section**
  - Large animated title with gradient text
  - Subtitle: "Train Smarter. Run Injury-Free."
  - Call-to-action buttons
  - Circular AISRI score visualization with animations

- **Features Section**
  - 4 feature cards with icons and hover effects
  - Glassmorphism design
  - Smooth animations on scroll

- **How It Works Section**
  - 4-step process flow
  - Gradient connectors between steps
  - Responsive grid layout

- **Athlete Section**
  - Testimonial-style content
  - Statistics cards
  - Multiple column layout

- **CTA Section**
  - Final call-to-action
  - Premium glassmorphism card

### Contact Page (`/contact`)
- Contact form with fields:
  - Name
  - Email
  - Message
- Contact information cards:
  - Email
  - Location
  - Support availability

### Privacy Page (`/privacy`)
- Privacy policy content
- 7 main sections
- Responsive typography

## Components

### Navbar (`components/Navbar.tsx`)
- Fixed position (sticky)
- Brand logo and name
- Navigation links
- Mobile menu (hamburger)
- CTA button
- Smooth animations
- Responsive design

### Footer (`components/Footer.tsx`)
- Brand section
- Product links
- Company links
- Social media links
- Copyright notice
- Terms/Privacy links
- Dark theme styling

### Card (`components/Card.tsx`)
- Icon support
- Title and description
- Hover animations
- Gradient background on hover
- Learn more indicator
- Customizable gradient
- Delay support for staggered animations

### AnimatedCircle (`components/AnimatedCircle.tsx`)
- SVG-based circular progress indicator
- Animated score display
- Status indicators:
  - Recovery (Red)
  - Moderate (Amber)
  - Ready (Green)
- 3 size options: sm, md, lg
- Floating animation
- Glow effect
- Dynamic gradient strokes

## Design Features

### Dark Theme
- `#111827` base color
- Gradient backgrounds
- White text with transparency variations
- Green accent color (`#10B981`)

### Glassmorphism
- Semi-transparent backgrounds
- Blur effects (10-32px)
- Border with transparency
- Hover state changes

### Animations
- Framer Motion integration
- Scroll-triggered animations
- Hover effects
- Staggered animations for groups
- Smooth transitions

### Responsive Design
- Mobile-first approach
- Tailwind CSS responsive utilities
- Hidden elements on small screens
- Adjusted sizing for different viewports
- Mobile menu for navigation

### Typography
- Gradient text for headings
- Consistent sizing hierarchy
- Good contrast ratio
- Readable line heights

## CSS Features

### Gradients
```css
/* Text gradient */
.gradient-text {
  background: linear-gradient(135deg, #10B981 0%, #8B5CF6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Background gradient */
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}
```

### Animations
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.5); }
}
```

### Custom Scrollbar
- Styled scrollbar track
- Green thumb color
- Hover effects

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary | #10B981 | Buttons, accents, links |
| Secondary | #8B5CF6 | Gradients, secondary elements |
| Accent | #F59E0B | Highlights, attention |
| Dark 900 | #111827 | Main background |
| Dark 800 | #1F2937 | Secondary background |
| Gray 400 | #9CA3AF | Secondary text |
| Gray 300 | #D1D5DB | Borders |

## Breakpoints

| Name | Width |
|------|-------|
| Mobile | < 640px |
| Tablet | 640px - 1024px |
| Desktop | > 1024px |
| Large Desktop | > 1280px |

## Performance Optimizations

- Image lazy loading support
- CSS optimizations with Tailwind
- Code splitting with dynamic imports
- Static generation where possible
- Optimized animations (GPU-accelerated)
- Responsive images ready

## SEO Features

- Meta tags configuration
- Open Graph tags
- Responsive meta viewport
- Semantic HTML structure
- Heading hierarchy (h1, h2, h3)
- Alt text support for images

## Accessibility Features

- Focus visible styles
- Semantic HTML
- Color contrast compliance
- ARIA labels ready
- Keyboard navigation
- Smooth animations (respects prefers-reduced-motion concept)

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Android)
- CSS Grid support
- Flexbox support
- Backdrop filter support (with fallbacks)
- SVG support

## Future Enhancement Ideas

- [ ] Dark mode toggle
- [ ] Blog section
- [ ] Team page
- [ ] Pricing page
- [ ] User dashboard
- [ ] Email newsletter signup
- [ ] Live chat support
- [ ] Analytics integration
- [ ] A/B testing setup
- [ ] Multi-language support

---

**This website is production-ready and fully customizable!**
