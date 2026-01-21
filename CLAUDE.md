# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Parks Local Diving landing page - A multilingual (Korean/English/Chinese) marketing website for a PADI 5 Star diving shop with 4 locations across Asia (Cebu, Bohol, Kota Kinabalu, Bali).

**Tech Stack**: React 18 + TypeScript + Vite + Tailwind CSS

## Development Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:5173

# Production
npm run build           # Build for production (outputs to dist/)
npm run preview         # Preview production build locally

# Installation
npm install             # Install dependencies
```

## Architecture & Code Organization

### Component Structure

The app uses a **tab-based navigation system** managed in [App.tsx](src/App.tsx):
- `activeTab` state controls which content renders
- Tabs: `home`, `location-info`, `location-tours`, `location-pricing`
- Each tab renders different section components
- Smooth transitions with opacity/transform animations

### Internationalization (i18n)

**Critical**: This is a multilingual site with 3 languages (ko, en, zh).

- **Translations**: All text lives in [src/i18n/translations.ts](src/i18n/translations.ts)
- **Context**: [LanguageContext](src/contexts/LanguageContext.tsx) provides language state globally
- **Usage**: Components use `const { t, language } = useLanguage()` hook
- **Structure**: Nested objects organized by section (e.g., `t.hero.title1`, `t.whyUs.features`)

When adding new text:
1. Add to all 3 language objects (ko, en, zh) in translations.ts
2. Use the `t` object from `useLanguage()` hook in components
3. Never hardcode user-facing text in components

### Data-Driven Approach

Location data is centralized in [src/data/diving-locations.ts](src/data/diving-locations.ts):
- `DIVING_LOCATIONS` array defines all diving locations
- Each location has coordinates (lat/lng + SVG x/y), color, icon, description
- `detailsRef` links to LocationsSection card index
- Modify this file to add/update locations on the interactive map

### File Organization

```
src/
├── components/
│   ├── common/              # Reusable components (StarRating, Badge, SocialFloatingButtons)
│   ├── map/                 # Interactive map components (InteractiveMap, LocationMarker)
│   ├── *Section.tsx         # Page sections (Hero, Reviews, WhyUs, etc.)
│   ├── Navigation.tsx       # Tab navigation
│   └── Footer.tsx
├── contexts/                # React Context providers (LanguageContext)
├── data/                    # Static data (diving-locations.ts)
├── hooks/                   # Custom hooks (useMediaQuery.ts)
├── i18n/                    # Internationalization (translations.ts)
├── types/                   # TypeScript type definitions
└── utils/                   # Utility functions (map-coordinates.ts)
```

## Tailwind Theme

Extensive custom theme in [tailwind.config.ts](tailwind.config.ts):

**Custom Colors**:
- Brand: `parks-gold` (primary), `parks-blue`
- Ocean theme: `ocean-dark`, `ocean-medium`, `ocean-light`, `ocean-accent`, `ocean-teal`, `ocean-cyan`

**Custom Animations**:
- `float-slow`, `pulse-glow`, `shimmer`, `fade-up`, `slide-up`, `scale-in`, `glow-pulse`, `gradient-shift`, `wave`, `ripple`
- Used extensively for visual effects throughout the site

**Typography**:
- Display font: Playfair Display (serif) - for headings
- Body font: Outfit (sans-serif) - for body text

When styling components, prefer using these custom utilities over creating new ones.

## Key Patterns

### Adding New Sections

1. Create component in `src/components/NewSection.tsx`
2. Add translations for the section in `translations.ts` (all 3 languages)
3. Import and render in [App.tsx](src/App.tsx) `renderContent()` switch statement
4. Add navigation tab if needed in [Navigation.tsx](src/components/Navigation.tsx)

### Interactive Map System

The 2.5D interactive map ([InteractiveMap.tsx](src/components/map/InteractiveMap.tsx)) uses:
- SVG-based map with 3D CSS transforms (perspective)
- Location markers positioned via data from `diving-locations.ts`
- Hover tooltips with location details
- Click handlers to scroll to detail sections

To modify locations: Edit `DIVING_LOCATIONS` in [diving-locations.ts](src/data/diving-locations.ts)

### Responsive Design

- Mobile-first approach (Tailwind breakpoints: sm, md, lg, xl)
- Navigation collapses on mobile
- Sections adapt layouts using Tailwind responsive utilities
- Custom hook [useMediaQuery](src/hooks/useMediaQuery.ts) for conditional rendering

## ngrok Configuration

The project is configured for remote testing via ngrok:
- Allowed host in [vite.config.ts](vite.config.ts): `latashia-unbonded-meaningfully.ngrok-free.dev`
- Update this if using a different ngrok domain

## Component Immutability

**CRITICAL**: Follow immutable patterns:
- Never mutate state directly
- Use spread operators for updates: `setState({ ...state, newProp: value })`
- Array operations: use `.map()`, `.filter()`, not `.push()`, `.splice()`

## Common Tasks

### Adding a New Diving Location

1. Add entry to `DIVING_LOCATIONS` in [diving-locations.ts](src/data/diving-locations.ts)
2. Add corresponding card in [LocationsSection.tsx](src/components/LocationsSection.tsx)
3. Update translations in all 3 languages (ko, en, zh)
4. Adjust SVG coordinates for proper map positioning

### Updating Pricing

Pricing data lives in `translations.pricing.priceData` array:
- Each entry has: location, type, duration, competitor, parks, savings
- Update all 3 language versions (ko, en, zh)
- Mobile view adapts automatically

### Adding Animations

Use existing Tailwind animation utilities from theme:
- `animate-fade-up`, `animate-slide-up`, `animate-scale-in`, etc.
- Or add new keyframes to [tailwind.config.ts](tailwind.config.ts)
