# Veri Design System Guide

**Extracted from Production Veri MVP Codebase**  
**Version**: 2025-07-29  
**Source**: Live Replit Veri Application

## Quick Implementation

### 1. Copy these 3 CSS files to your project:
- `veri-design-tokens.css` - Core design variables and tokens
- `veri-components.css` - Pre-built component styles  
- `veri-utilities.css` - Utility classes and animations

### 2. Import in this order in your main CSS file:
```css
@import url('./veri-design-tokens.css');
@import url('./veri-components.css');
@import url('./veri-utilities.css');
```

### 3. Add Tailwind CSS integration (optional but recommended):
```js
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "termina": ['var(--font-termina)', 'system-ui', 'sans-serif'],
        "machina": ['var(--font-machina)', 'system-ui', 'sans-serif'], 
        "inter": ['var(--font-inter)', 'system-ui', 'sans-serif'],
        "sans": ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

## Core Design Tokens

### Brand Colors (Exact Veri Values)
```css
/* Primary Teal */
--veri-primary-500: hsl(158, 100%, 42%);    /* #00d6a2 */
--veri-primary-400: hsl(158, 79%, 36%);     /* Lighter */
--veri-primary-600: hsl(158, 100%, 39%);    /* Darker */

/* Purple Accent */
--veri-accent-violet-500: hsl(256, 100%, 67%); /* #8456ff */
--veri-accent-violet-400: hsl(256, 100%, 72%);
--veri-accent-violet-600: hsl(256, 100%, 62%);

/* Neutrals */
--veri-neutral-800: hsl(231, 19%, 13%);     /* Dark Background */
--veri-neutral-100: hsl(222, 16%, 95%);     /* Light Gray */
--veri-neutral-50: hsl(220, 20%, 98%);      /* Lightest Gray */
```

### Typography (Exact Veri Fonts)
```css
/* Font Families */
--font-termina: 'Termina', 'Helvetica Neue', Arial, sans-serif;
--font-machina: 'PP Neue Machina', 'Helvetica Neue', Arial, sans-serif;
--font-inter: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Usage */
h1, h2, h3, h4, h5, h6 { font-family: var(--font-termina); } /* Headings */
.accent-text { font-family: var(--font-machina); }            /* Accent text */
p, span, div, input, button { font-family: var(--font-inter); } /* Body text */
```

### Glass Morphism (Exact Veri Implementation)
```css
/* Primary Glass - Navigation & High Priority */
.veri-glass-primary {
  backdrop-filter: blur(20px) saturate(180%);
  background: rgba(255, 255, 255, 0.1);     /* Dark mode */
  background: hsl(210, 11%, 96%);           /* Light mode */
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
}

/* Secondary Glass - Cards & Content */
.veri-glass-secondary {
  backdrop-filter: blur(15px) saturate(160%);
  background: rgba(255, 255, 255, 0.05);    /* Dark mode */
  background: hsl(0, 0%, 98%);              /* Light mode */
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Interactive Glass - Buttons & Hover States */
.veri-glass-interactive {
  backdrop-filter: blur(25px) saturate(200%);
  background: rgba(255, 255, 255, 0.15);    /* Dark mode */
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### Animation Timing (Exact Veri Values)
```css
--duration-fast: 0.15s;
--duration-normal: 0.3s;
--duration-slow: 0.6s;
--duration-extra-slow: 1s;

/* Easing Functions */
--ease-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-apple: cubic-bezier(0.23, 1, 0.32, 1);
```

## Component Usage Examples

### Buttons
```html
<!-- Primary Button -->
<button class="veri-button-primary">
  Click me
</button>

<!-- Gradient Button (Veri Brand) -->
<button class="veri-button-gradient">
  Gradient Action
</button>

<!-- Glass Button -->
<button class="veri-button-glass">
  Glass Button
</button>

<!-- Liquid Glass Button (Premium Effect) -->
<button class="veri-liquid-glass-button veri-press-animation">
  <span>Premium Button</span>
</button>
```

### Glass Cards
```html
<!-- Basic Glass Card -->
<div class="veri-card-glass p-6 rounded-lg">
  <h3>Glass Card Title</h3>
  <p>Content goes here</p>
</div>

<!-- Interactive Glass Card -->
<div class="veri-card-glass veri-card-interactive p-6 rounded-lg">
  <h3>Hoverable Card</h3>
  <p>Lifts on hover</p>
</div>

<!-- Gradient Glass Card -->
<div class="veri-card-gradient veri-glass-secondary p-6 rounded-lg">
  <h3>Gradient Card</h3>
  <p>With Veri brand gradient</p>
</div>
```

### Input Fields
```html
<!-- Glass Input -->
<input 
  type="text" 
  class="veri-input" 
  placeholder="Enter text..."
>

<!-- Glass Textarea -->
<textarea 
  class="veri-textarea" 
  placeholder="Enter message..."
  rows="4"
></textarea>
```

### Animations
```html
<!-- Hover Lift Animation -->
<div class="veri-hover-lift p-4 bg-white rounded-lg">
  Lifts on hover
</div>

<!-- Staggered Fade In -->
<div class="veri-animate-staggered veri-stagger-1">Item 1</div>
<div class="veri-animate-staggered veri-stagger-2">Item 2</div>
<div class="veri-animate-staggered veri-stagger-3">Item 3</div>

<!-- Shimmer Effect -->
<div class="veri-animate-shimmer">
  Shimmer animation
</div>
```

### Typography
```html
<!-- Termina Heading -->
<h1 class="veri-font-termina text-4xl">
  Main Heading
</h1>

<!-- Machina Accent Text -->
<span class="veri-font-machina text-lg accent-text">
  Accent Text
</span>

<!-- Gradient Text -->
<h2 class="veri-text-gradient text-3xl">
  Gradient Heading
</h2>
```

### Loading States
```html
<!-- Glass Skeleton -->
<div class="veri-skeleton h-8 w-full rounded-lg"></div>

<!-- Spinner -->
<div class="veri-spinner"></div>

<!-- Pulse Glow Effect -->
<div class="veri-pulse-glow p-4 rounded-lg">
  Pulsing element
</div>
```

## Best Practices

### 1. Glass Morphism Guidelines
- **Primary Glass**: Use for navigation, headers, and high-priority UI elements
- **Secondary Glass**: Use for content cards, form containers, and secondary UI
- **Interactive Glass**: Use for buttons, clickable cards, and interactive elements
- Always include `transform: translateZ(0)` for GPU acceleration
- Test on mobile devices - glass effects can impact performance

### 2. Animation Principles
- Use `--ease-out` for most UI interactions
- Use `--ease-bounce` for celebratory animations
- Use `--ease-apple` for premium, smooth transitions
- Always include `will-change` property for animated elements
- Respect `prefers-reduced-motion` media query

### 3. Touch Targets
- All interactive elements use `min-height: 44px` (iOS/Android guidelines)
- Add `touch-action: manipulation` to prevent double-tap zoom
- Include `user-select: none` on button text

### 4. Color Usage
- Primary Teal (`#00d6a2`): Main actions, links, primary buttons
- Purple Accent (`#8456ff`): Secondary actions, highlights, badges
- Use the exact HSL values for consistency
- Always test in both light and dark modes

### 5. Performance Optimization
- Glass effects use `backdrop-filter` which can be expensive
- Use `transform: translateZ(0)` to enable GPU acceleration
- Limit the number of glass elements visible simultaneously
- Consider reducing glass complexity on mobile devices

### 6. Accessibility
- Focus states are built into all components
- High contrast ratios maintained in both themes
- Touch targets meet WCAG guidelines
- Screen reader support with semantic HTML

## Dark Mode Support

The design system automatically adapts to dark mode when `.dark` class is applied to the `<html>` or `<body>` element:

```js
// Toggle dark mode
document.documentElement.classList.toggle('dark');
```

All colors, glass effects, and shadows automatically adjust for optimal contrast and visibility.

## Integration with Existing Projects

### If you're using Tailwind CSS:
1. Import the Veri CSS files before Tailwind
2. Use Veri classes alongside Tailwind utilities
3. Veri components will respect Tailwind's responsive prefixes

### If you're using vanilla CSS:
1. Import the three Veri CSS files
2. Use Veri classes directly in your HTML
3. Customize CSS custom properties to match your brand

### Framework-Specific Notes:
- **React**: All classes work with className prop
- **Vue**: All classes work with :class directive  
- **Angular**: All classes work with [ngClass] directive
- **Svelte**: All classes work with class: directive

## Customization

To customize colors while maintaining the design system:

```css
:root {
  /* Override Veri brand colors */
  --veri-primary-500: hsl(210, 100%, 50%);    /* Your brand primary */
  --veri-accent-violet-500: hsl(280, 100%, 70%); /* Your brand accent */
}
```

The entire system will automatically adapt to your new colors while maintaining all the animations, glass effects, and interactions.

---

**Note**: This design system was extracted from the production Veri MVP application running on Replit. All values, animations, and component styles are the exact implementations used in the live application.