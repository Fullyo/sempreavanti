

## Recommendation: Hero Photos & Bottom CTA

### On the hero photo question

**My recommendation: skip the hero on /guide, and it was the right call to keep it on /menu.** Here's why:

The two pages serve different purposes:

- **/menu** is an editorial experience — guests browse it leisurely. The hero photo (beach scene) sets the mood and signals "this is about dining at this property." It earns its space because the content below is a curated card layout that benefits from a visual opening.

- **/guide** is a reference sheet — guests land here from an email link looking for specific activities and prices. A hero image would push the actual content below the fold and add a scroll before they see anything useful. The current clean intro with the heading, description, and sticky nav lets them orient and jump to what they need immediately. This is the right pattern for a rate card / service menu.

**Verdict: keep /menu's hero, don't add one to /guide.**

### Bottom CTA with adventure photo

The current bottom CTA on /guide uses a solid dark background (`bg-foreground`). Per the site's established visual pattern (and the memory note about avoiding solid CTA backgrounds), this should use a **property photo with a dark gradient overlay** — exactly like the /menu page does with `diner.jpg`.

**Photo recommendation:** Use `surf-sayulita-drone.png` or `boat-sunset.jpg` — both convey adventure and the coastal lifestyle, which matches the "experiences" theme perfectly. The drone surf shot is more energetic; the sunset boat is more aspirational. I'd lean toward **`boat-sunset.jpg`** since it's broadly appealing (not everyone surfs, but everyone loves a sunset on the water).

### Implementation

1. **`src/pages/Pricing.tsx`** — Update the bottom CTA section:
   - Replace the solid `bg-foreground` div with an `<img>` tag using `boat-sunset.jpg` (same pattern as Menu's footer)
   - Add a dark gradient overlay (`bg-gradient-to-t from-black/70 via-black/50 to-black/40`)
   - Keep the existing copy ("Ready to book an experience?" + reply instructions)

One small change, no new files needed.

