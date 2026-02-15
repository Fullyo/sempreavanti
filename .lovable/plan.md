
## Fix Location References: Patzcuarito, Not Sayulita

The property is located in **Patzcuarito, Riviera Nayarit** -- not in Sayulita. The social share preview (as shown in your WhatsApp screenshot) and several meta tags incorrectly say "in Sayulita." Sayulita is nearby (5 min by UTV) but is not the property's location.

### What Changes

**1. index.html -- Meta Tags & Structured Data**

| Tag | Current | Updated |
|-----|---------|---------|
| `<title>` | "...Villas in Sayulita, Mexico" | "...Villas on the Riviera Nayarit" |
| `og:title` | "...Villas in Sayulita" | "...Villas on the Riviera Nayarit" |
| `og:description` | "...sleeps 10. Sayulita, Riviera Nayarit, Mexico." | "...sleeps 10. Patzcuarito, Riviera Nayarit, Mexico." |
| `twitter:description` | "...beach in Sayulita, Mexico." | "...beach on the Riviera Nayarit, Mexico." |
| JSON-LD `addressLocality` | "Sayulita" | "Patzcuarito" |

**2. src/hooks/useGuestyListings.ts -- Fallback Listing Data**

- Villa Pietro description: "Villa Pietro in Sayulita" changes to "Villa Pietro in Patzcuarito"
- Villa Pietro summary: same fix
- All three fallback `address.city` values: "Sayulita" changes to "Patzcuarito"

### What Stays the Same

References to Sayulita as a **nearby destination** are accurate and will not change:
- "5 min to Sayulita" (FlowOfDaySection)
- "Between Sayulita and Punta de Mita" (LocationPreview)
- "just minutes from Sayulita" (LocationPreview body text)
- Surf, cultural, and experience pages mentioning Sayulita as a destination

### Technical Details

**Files to modify:**
- `index.html` -- 5 tag updates (title, og:title, og:description, twitter:description, JSON-LD addressLocality)
- `src/hooks/useGuestyListings.ts` -- Fix fallback descriptions and address.city values (lines 43, 45, 48, 62, 65, 82)
