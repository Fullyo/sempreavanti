## Align /book Page with Guesty Booking Engine Data + Fix Checkout Redirect

### 1. Checkout Redirect -- Guesty Limitation

Guesty's hosted booking engine does NOT support a direct-to-checkout URL. The `/checkout` path on their domain actually redirects to the generic search/listing page (as you saw). The only supported flow is:

**Property page (with pre-filled dates/guests) -> Guest clicks Guesty's "Book Now" -> Checkout form**

The current URL format (`/properties/{id}?checkIn=...&checkOut=...&minOccupancy=...`) is actually the correct one -- it's the deepest link Guesty supports. There is no way to bypass their property page and land directly on a payment form using their hosted booking engine.

**Proposed approach**: Keep the current redirect to the property page with pre-filled parameters. Add a small note near the "Book Now" button explaining that they'll confirm their booking on the next page. This is the standard flow for all Guesty booking engines.

### 2. Replace All Property Content with Guesty-Sourced Data

The current descriptions contain inaccuracies (fabricated details not from the API). Here's what needs to change:

**PropertyDescription.tsx -- Complete rewrite using Guesty's actual text:**

- Remove: "prestigious gated community of La Cruz de Huanacaxtle"
- Replace with: "exclusive Patzcuaro Beach community" (from Guesty)
- Remove: "private stretch of pristine beach" / "infinity pool" (singular)
- Replace with: "250 feet of private beachfront" / "Two private infinity pools" (from Guesty)
- Remove: "private plunge pool" for Casa Pietro
- Replace with: "its own private infinity pool" (from Guesty)
- Remove: "Rooftop palapa" reference
- Add the full Guesty sections: Description, The Space, Guest Access, Neighborhood, Getting Around, Other things to note
- Fix chef service: currently says "breakfast and lunch" -- Guesty says "breakfast, lunch, and dinner upon request" with specific meal ordering instructions

**AmenitiesGrid.tsx -- Remove unverified amenities:**

- Remove: "Gated Community" (not in Guesty data)
- Remove: "Private Parking" (not in Guesty data) 
- Remove: "Rooftop Palapa" (not in Guesty data)
- Remove: "Tropical Gardens" (not specifically listed)
- Keep: Private Beach, Infinity Pools (change to "Two Infinity Pools"), Ocean Views, Air Conditioning, High-Speed WiFi (not in Guesty but commonly expected), Gourmet Kitchen (not in Guesty but mentioned in space desc), BBQ and Pizza Oven, Daily Housekeeping
- Add from Guesty amenities: items like accessibility features are listed but these are auto-generated Guesty fields, so we'll stick with the major amenities mentioned in the description text

**PropertyOverview.tsx -- Already correct** (5 BR, 7 beds, 5.5 bath, up to 14 guests, 4PM/11AM check-in/out matches Guesty)

**AvailableServices.tsx -- Align with Guesty's "Additional services" list:**

- Keep items that match Guesty: ATV tours, Horseback riding, Surf lessons, Yoga/massage/sound healing, Cooking classes
- Add from Guesty: Hiking excursions, Zipline adventures, Laundry service, Concierge assistance
- Update chef description: "Private Chef (Breakfast, Lunch & Dinner upon request)" instead of just "Breakfast & Lunch included"
- Remove items not in Guesty: Golf, Whale Watching & Snorkeling, Cultural Tours & Tequila Tastings, Boat Charters, Wedding & Event Planning (these are site-wide services but not listed as property-specific in Guesty)

### 3. Add Missing Guesty Sections

Add expandable sections to the /book page matching the booking engine layout:

- **The Space** -- Detailed description of Villa Luisa and Casa Pietro
- **Guest Access** -- Exclusive access details
- **Neighborhood** -- Patzcuaro Beach area info
- **Getting Around** -- Distance to Sayulita, airport, etc.
- **Other Things to Note** -- Chef service details, meal ordering info

### Technical Details

**Files to modify:**

- `src/components/book/PropertyDescription.tsx` -- Replace hardcoded text with Guesty's actual description sections, organized with expandable headers
- `src/components/book/AmenitiesGrid.tsx` -- Remove unverified items ("Gated Community", "Private Parking", "Rooftop Palapa", "Tropical Gardens")
- `src/components/book/AvailableServices.tsx` -- Align service list with Guesty's "Additional services"
- `src/pages/Book.tsx` -- Add helper text near "Book Now" button: "You'll confirm your booking on the next page"  
  
  
you also need to show all the photos from Villas Sempre Avanti. Like All the photos that are linked to Sempre Avanti api, that show all the bedrooms & bathrooms.  
  
on the Book page, use the same hero photo of the home page for the hero of /book page  
  
  
Now above you have to be careful I see that you're removing certain things but if you were provided the information inside of the website as an example of some of the tour and Adventures those can remain on here the Nuance is that not everything is inside of guesty yet the description needs to be updated. I just didn't want you to make any assumptions like the Gated Community which I'm not sure but that was one example. So you need to evaluate the information that I gave you when we were building the website that is 100% factual as well as combining what is factual inside of the API and the booking engine.