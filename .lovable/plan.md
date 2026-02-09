

# Restructured Navigation Menu

## New Menu Order

The navigation will be reorganized to lead with the property, then logistics, then activities:

1. **The Estate** (dropdown): The Villas, Private Chef, Wellness
2. **Plan Your Stay** (dropdown): Concierge, Transportation, Pricing
3. **Experiences** (direct link)
4. **Weddings & Events** (direct link)
5. **Location** (direct link)
6. **Get in Touch** (direct link)
7. **Check Availability** (CTA button)

This puts the villas front and center, followed by planning logistics, then the experiential and informational pages.

## Technical Details

### File: `src/components/layout/Navbar.tsx`

- Rebuild the desktop nav with two hover-triggered dropdown groups ("The Estate" and "Plan Your Stay") and four direct links
- Dropdowns use onMouseEnter/onMouseLeave with a solid white background, shadow, rounded corners, and high z-index
- Text styling matches existing uppercase, tracking-widest convention
- Transparent/scrolled states preserved: triggers are white when unscrolled, dark when scrolled; dropdown panels always white with dark text
- Active state: dropdown trigger highlights if current route matches any child link
- Mobile menu shows all items flat with small category headers for grouping
- "Get in Touch" links to `/contact` (existing route)
- "Pricing" moves under "Plan Your Stay" since it relates to trip planning

No other files are changed -- all routes and pages stay the same.

