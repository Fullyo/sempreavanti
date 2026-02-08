

# Casa Sempre Avanti — Luxury Beachfront Destination Website

## Vision
A high-end, immersive website that positions Sempre Avanti not as a vacation rental, but as a **complete private beachfront destination** — where wellness, dining, adventure, and celebration flow seamlessly. The design will be elegant and editorial, inspired by the warmth of the property photos, with earth tones, ocean blues, and gold accents.

## Backend Setup (Lovable Cloud + Supabase)

### Guesty API Integration
- Store the Guesty client ID and secret as Supabase secrets
- Create an edge function that authenticates via OAuth2, fetches the 3 listings (Casa Sempre Avanti, Casa Pietro, Casa Luisa), and returns photos, descriptions, amenities, and availability
- All property photos and descriptions will be pulled live from Guesty

### Stripe Integration
- Enable Stripe for the hidden pricing/checkout page
- Guests can add activities to a cart and pay directly

---

## Pages & Features

### 1. Homepage
- Full-screen hero with a stunning property photo and the tagline capturing the "complete destination" positioning
- Brief introduction to the estate concept: two beachfront villas, five bedrooms, fully hosted
- Visual section highlights: Wellness · Dining · Adventures · Celebrations
- "Inquire" call-to-action throughout
- Subtle scroll animations for an editorial luxury feel

### 2. The Villas
- Overview of Sempre Avanti as a whole estate (the pitch: book as one destination)
- Individual sections for **Casa Pietro** and **Casa Luisa** — photos and descriptions pulled from Guesty
- Sleeping configuration details (luxury king suites, flexible configurations for groups)
- Amenities: private beach, pool, outdoor living spaces, fire pit, beachfront dining
- Photo galleries with placeholders for any missing images

### 3. Private Chef
- Ricardo & Crethell's story and approach
- The full menu: breakfast, appetizers, lunch/dinner, desserts — presented beautifully
- Special features: Pizza Night, catch-of-the-day preparations
- Sunset Margarita Ritual as a highlighted experience
- Dedicated bartender services
- "Inquire for pricing" — no prices shown

### 4. Wellness
- Daily morning wellness practice (8:30–9:30am): yoga, stretching, breathwork, light movement
- Personal trainer availability
- Massage services (in-house)
- Sound bath sessions
- The wellness spaces: beachfront, pool area, dedicated practice areas
- All pricing via inquiry only

### 5. Experiences & Adventures
- **Land & Adventure**: Zipline/canopy tours, ATV tours, RZR tours, horseback riding, jungle/Monkey Mountain hikes, Polaris UTV rentals (2 available at the house — best way to get to Sayulita & Punta de Mita)
- **Ocean & Water**: Surf lessons & surf spots guide, paddleboard tours, snorkeling/boat trips, sport fishing, whale watching (seasonal)
- **Sailing**: Ally Cat fleet options (Fat Cat, Ally Cat, Ally Cat Too, Ally Cat 3) for private charters and shared sails
- **Cultural & Local**: La Cruz Sunday Market, Puerto Vallarta Malecón, Sayulita Friday Farmers Market, cooking classes, tequila/mezcal tastings
- **Combos**: ATV + Zipline, ATV + Horseback, custom group packages
- Powered by Rancho Mi Chula Tours partnership
- Visual grid layout inspired by the Casa Tara reference page

### 6. Weddings & Events
- The estate as a celebration venue: ceremonies on the beach, fire pit evening gatherings, long-table beachfront dinners
- Capacity and configuration options
- Coordination by Eno and team
- After-hours catering and bartender services
- Photo placeholders for event setups
- Inquiry-driven — no pricing displayed

### 7. Location
- Interactive or embedded map showing Sempre Avanti's position relative to Sayulita, Punta de Mita, San Pancho, La Cruz, Puerto Vallarta
- Neighborhood guides: Sayulita town, dining recommendations (Don Pedro's, Café Sayulita, etc.), shopping highlights
- San Pancho, El Anclote, Punta de Mita nearby attractions
- The "Patzcuaro is very safe" positioning

### 8. Concierge & Staff
- **Eno** — head concierge, grew up in Sayulita, knows everything and everyone, organizes all experiences
- **Ricardo & Crethell** — private chefs
- **Angy** — daily housekeeping
- **Paco** — caretaker, grounds, pool, beach setup
- The hosting philosophy: "You're not checking in — you're being hosted"
- Daily housekeeping, arrival coordination, ongoing support, direct access throughout the stay

### 9. Transportation
- Private luxury Suburban transfers from Puerto Vallarta airport (PVR)
- 2 Polaris UTVs available at the property for guest use
- How the 4×4 carritos remove isolation and connect to Sayulita
- Inquiry to arrange

### 10. Get in Touch (Contact/Inquiry)
- Beautiful inquiry form
- Submissions sent directly into Guesty as new leads via the Guesty inquiry API
- Fields: dates, group size, occasion, message
- No pricing shown — all handled through conversation

### 11. Hidden Pricing & Checkout Page (not in navigation)
- Accessible via a direct link (shared with guests pre-booking or during their stay)
- Full activity pricing list with both price tiers shown:
  - Yoga, Sound bath, Massages, Laundry, Polaris rentals, Cooking classes
  - Early check-in/late checkout, after-hours dining, happy hour, extra guests
- Add-to-cart functionality
- Stripe checkout for payment
- Clean, simple shopping experience

---

## Design Direction
- **Color palette**: Derived from the property photos — warm sand tones, deep ocean blues, terracotta accents, and cream/white backgrounds
- **Typography**: Elegant serif headings (editorial feel), clean sans-serif body text
- **Photography-first**: Large, immersive images with generous whitespace
- **Navigation**: Sticky top nav with all main pages, smooth transitions
- **Mobile-first**: Fully responsive, beautiful on phones (guests will browse on mobile)
- **Tone**: Warm, elevated, inviting — never corporate or "rental-like"

