# Fix All Linting Errors and Warnings

## Files to Edit
- [ ] src/App.tsx
- [ ] src/services/api.ts
- [ ] src/components/AuthModal.tsx
- [ ] src/components/EventCarousel.tsx
- [ ] src/components/Features.tsx
- [ ] src/components/Hero.tsx
- [ ] src/components/Navbar.tsx
- [ ] src/components/OrderTracker.tsx

## Issues to Fix

### src/App.tsx
- [ ] Remove unused ApiError import
- [ ] Move Math.random calculations in MeteorShower to useMemo
- [ ] Move Math.random calculations in StarField to useMemo properly
- [ ] Move Math.random calculations in ConfettiExplosion to useMemo
- [ ] Remove unused handleCheckout variable
- [ ] Replace any types with proper types in error handling
- [ ] Remove useEffect in handleCheckout (since handleCheckout is unused)

### src/services/api.ts
- [ ] Replace any types with proper types
- [ ] Remove unused error variable

### src/components/AuthModal.tsx
- [ ] Replace any type with proper type

### src/components/EventCarousel.tsx
- [ ] Move Math.random calls to useMemo or outside render
- [ ] Fix paginate function declaration order
- [ ] Replace any type with proper type

### src/components/Features.tsx
- [ ] Replace any types with proper types

### src/components/Hero.tsx
- [ ] Replace any type with proper type

### src/components/Navbar.tsx
- [ ] Replace any types with proper types

### src/components/OrderTracker.tsx
- [ ] Replace any type with proper type

## Followup Steps
- [ ] Run lint again to verify all fixes
- [ ] Test build to ensure no breaking changes
