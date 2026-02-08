
# Full Content Overhaul: Casa Sempre Avanti Website

## Problems Identified

1. **Homepage is bare**: Only has a hero, a small estate intro, emoji-based highlights, a thin photo strip, and a CTA -- far too minimal for a luxury property website.
2. **Emoji icons are inappropriate**: Using emojis like a yoga emoji, fork/knife, wave, and party popper looks cheap and childish for a high-end estate. These need to be replaced with elegant, minimal line icons from Lucide or removed entirely in favor of photo-driven cards.
3. **All pages lack photo placeholders**: Most pages show plain colored backgrounds (`bg-primary`, `bg-muted`) instead of proper image placeholder areas with aspect ratios and elegant "coming soon" treatments.
4. **Content is thin across all pages**: Many pages are missing significant content from the owner's documents (full menus, detailed restaurant recommendations, surf spots, shopping, golf, spa details, etc.).
5. **Guesty API rate-limited**: The edge function is hitting 429 errors because each page load triggers a new request, and there's no retry/backoff logic. Need to add retry logic and better error handling.
6. **No photo galleries pulled from Guesty**: The listings hook fetches data but pages don't use photos extensively -- only the hero and villa sections try to use them.

---

## Plan

### 1. Fix Guesty Edge Function (Rate Limiting)

- Add exponential backoff retry logic (3 retries with increasing delay) to the token request
- Add a longer cache for the token (avoid re-requesting)
- Add response caching headers so the browser/CDN can cache the listing data
- This will fix the 429 errors and ensure photos actually load

### 2. Homepage -- Complete Rebuild

Replace the current bare homepage with a rich, editorial luxury experience:

- **Hero**: Full-bleed Guesty photo with parallax-style overlay, animated text entrance (keep current approach but ensure it loads a photo)
- **Estate Introduction**: Keep but add two villa photo cards from Guesty (already partially done)
- **"Flow of the Day" section**: Replace emoji highlights with an elegant photo-driven grid. Four tall cards with overlay text, each linking to the relevant page. Use Guesty property photos as backgrounds. No emojis -- use elegant serif text over images
- **Photo mosaic/gallery**: Pull 8-12 photos from all 3 Guesty listings into a masonry-style grid showcasing the property
- **Hospitality section**: New section about the "hosted, not rented" philosophy with staff mentions
- **Experiences ribbon**: Horizontal scroll of experience categories with photo placeholders and overlay text
- **Testimonial/quote section**: Large serif quote about the Sempre Avanti philosophy
- **CTA section**: Keep and enhance with a background photo

### 3. The Villas Page -- Enhance

- Use all available Guesty photos in larger gallery grids
- Add a dedicated section about the estate as a whole (private beach, pool, fire pit, beachfront dining area)
- Add the "emotional center" content: morning wellness, ceremonies, welcome cocktails
- Add the fire pit and beachfront dining descriptions
- Better photo gallery with lightbox-style layout (larger images, 3-column grid)

### 4. Private Chef Page -- Full Menu from Documents

- Add the complete real menu from the owner's document:
  - **Breakfast**: Chilaquiles, Ranchero eggs, Waffles, Pancakes, Breakfast burritos, Blueberry pancakes, French toast, Eggs Benedict, Enchiladas suizas, Scrambled eggs, Avocado toast, Grilled cheese, Croque madam
  - **Appetizers**: Guac and Chips, Catch of the Day (sashimi/ceviche/aguachile), Cactus Salad, Corn and Beet Root Salad, Shrimp Sashimi, Tortilla Soup, Sopes, Shrimp Diabla, Tuna Tartar, Sweet Potato Sashimi
  - **Lunch/Dinner**: Pozole, Pastor Catch of the Day, Mexican Style Grill Steak, Mole Poblano, Zarandeado, Pipian Duo, Pork Belly, Barbacoa, Enchiladas, Tetela de Birria, Hibiscus Mole, Chile Relleno
  - **Desserts**: Caramel Flan, Rice Pudding, Capirotada, Churros, Corn Bread, Volcan, Fried Banana, Bunuelos, Jericalla
- Add Pizza Night with real details (5-hour oven heating, custom toppings)
- Add proper photo placeholders for food imagery (tall aspect-ratio cards)
- Sunset Margarita section with pricing context (pitcher pricing from doc)
- Bartender availability details

### 5. Wellness Page -- Add Full Details

- Add real provider names and details from documents:
  - Yoga: Narayani, Paraiso Yoga, Vanessa (Ashtanga/Hatha), Hotelito de los Suenos
  - Pilates and Personal Training: Shea -- personalized mat classes, outdoor workouts, nutritional advice
  - Massage providers: Nirvanna Spa (Shiatsu/Swedish/aromatherapy), Bendita Waxing Studio and Spa, Buddha Gallery Boutique Spa
- Add photo placeholders for each wellness offering (large, atmospheric images)
- Sound bath section with more atmosphere

### 6. Experiences Page -- Complete with All Activities

Add missing activities from the documents:
- **Golf**: Litibu (15 min, 18 holes), Four Seasons Punta Mita (2 courses), El Flamingo, El Tigre
- **Surfing spots detail**: Captain Pablo's (right break), Don Pedro's (left break), Burros, Punta Mita, La Lancha -- with Chillo for beginners
- **Snorkeling/Diving**: Playa de los Muertos (10 min, calm), Marietas Islands, Sebastian for diving certification
- **Kite surfing**: Available in Punta Mita
- **Fishing detail**: Marla's Sport Fishing (La Cruz), Pato (Sayulita), panga fishing, catch-and-cook option
- Replace the generic "Photo placeholder" boxes with styled image placeholder cards
- Add Ally Cat sailing details properly (boat sizes, what's included)

### 7. Location Page -- Massive Content Addition

Add all the restaurant and shopping recommendations from the documents:
- **Sayulita restaurants**: Don Pedro's, Cafe Sayulita, Xochi, Purillo, Naty's Kitchen, Los Corazones, Esperanza, Choco Banana, Paninos, El Break, Captain Pablo, El Costeno, Falafel and Friends, La Terrazola, Tacos Ivan, Aaleya's, Sayulita Public House, Escondido Wine Bar, Hotel Hafa Wine Bar
- **San Pancho**: Cafe del Mar, Mar Plata, La Perla, La Ola Rica
- **El Anclote/Punta Mita**: Si Senor, Si Sushi, Blue Shrimp, Tuna Blanca, Casa Teresa, Rosa Mexicana, La Serenata BBQ, El Coral, Tino's, El Dorado, NAEF Cuisine
- **Four Seasons/St. Regis**: Aramara, Bahia, Ketsi, Carolina, Sea Breeze, Las Marietta's
- **Shopping in Sayulita**: Pachamama, Artefacto, Galleria Hamaca, Gypsy Galleria, Espuma do Mar, Revolution del Sueno, Ula, Debbie Cuevas, La Selecta (tequila tastings), Terrenal (organic store)
- **Markets**: Sayulita Friday market, La Cruz Sunday market (expanded details)
- **Nightlife**: Monday salsa at Don Pedro's, Thursday Cumbia, Bar Don Pato
- Organize into collapsible sections by area for clean navigation
- Add Chacala as a day trip option

### 8. Concierge Page -- Enhance Staff Profiles

- Add language details (Ricardo speaks English; Crethell, Angy, Paco do not but Google Translate works)
- Add more detail about Paco's role (beach chairs, umbrellas, bonfire setup)
- Larger photo placeholder areas with elegant framing

### 9. Transportation Page -- Add Details

- Add drive times: PVR airport ~45 min, Sayulita ~10 min by UTV, Punta Mita ~15 min
- Add more context about the UTV experience
- Photo placeholders with proper aspect ratios

### 10. Contact Page -- Polish

- Add a background photo placeholder to the hero
- Slightly enhance form styling

### 11. Replace All Emoji Icons with Elegant Design

Throughout the site, replace any emoji usage with:
- Lucide React icons styled with thin strokes and the accent color, OR
- Pure typographic treatments (elegant serif text with decorative dividers)
- For the homepage highlights: switch from emoji cards to full-bleed photo cards with text overlays

### 12. Consistent Photo Placeholder Treatment

Create a reusable `PhotoPlaceholder` component that renders:
- A warm sand/muted background
- A subtle camera or image icon (Lucide)
- Elegant "Photo Coming Soon" text in the brand font
- Proper aspect ratio containers

---

## Technical Details

### Files to Create
- `src/components/ui/PhotoPlaceholder.tsx` -- Reusable placeholder component

### Files to Modify
- `supabase/functions/guesty-listings/index.ts` -- Add retry logic for 429 errors
- `src/pages/Index.tsx` -- Complete rebuild with rich sections
- `src/pages/Villas.tsx` -- Enhanced galleries and estate content
- `src/pages/Chef.tsx` -- Full real menu from documents
- `src/pages/Wellness.tsx` -- Real provider details and expanded content
- `src/pages/Experiences.tsx` -- All missing activities (golf, detailed surf, fishing, diving)
- `src/pages/Events.tsx` -- Photo placeholders and enhanced content
- `src/pages/Location.tsx` -- Complete restaurant/shopping/nightlife guide
- `src/pages/Concierge.tsx` -- Enhanced staff details
- `src/pages/Transportation.tsx` -- Drive times and enhanced layout
- `src/pages/Contact.tsx` -- Hero photo placeholder
