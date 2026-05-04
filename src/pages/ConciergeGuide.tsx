import { useEffect } from "react";

const HTML = `

<!-- ══════════════════════════════════════════════════════════════
     PAGE 1 · COVER
══════════════════════════════════════════════════════════════ -->
<div class="page cover" id="cover-page" style="cursor:pointer;" title="Click to reveal print option">
  <div class="cover-line"></div>
  <h1 class="cover-title">VILLAS<br>SEMPRE AVANTI</h1>
  <div class="cover-subtitle">Private Concierge Guide</div>
  <div class="cover-line"></div>
  <div class="cover-location">Patzcuarito · Riviera Nayarit · Mexico</div>
  <div class="cover-footer">villassempreavanti.com</div>
</div>

<!-- Hidden print button, revealed by clicking cover -->
<button id="print-btn">🖨 Print / Save as PDF</button>



<!-- ══════════════════════════════════════════════════════════════
     PAGE 2 · HOUSE ESSENTIALS
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">HOUSE ESSENTIALS</div>

  <div class="wifi-container">
    <div class="wifi-box">
      <div style="font-size:2rem; letter-spacing:.15em; font-weight:700; color:#f0b429; font-family:'Montserrat',sans-serif; margin-bottom:8px;">WiFi</div>
      <h3>Villa Sempre Avanti</h3>
      <div class="wifi-detail"><span>Network: </span>SempreAvanti</div>
      <div class="wifi-detail"><span>Password: </span>Sayulita4ever</div>
    </div>
    <div class="wifi-box">
      <div style="font-size:2rem; letter-spacing:.15em; font-weight:700; color:#f0b429; font-family:'Montserrat',sans-serif; margin-bottom:8px;">WiFi</div>
      <h3>Casa Pietro</h3>
      <div class="wifi-detail"><span>Network: </span>CasaPietro</div>
      <div class="wifi-detail"><span>Password: </span>CasaPietroSayulita</div>
    </div>
  </div>

  <div class="grid-list">
    <div class="grid-item">
      <strong>Drinking Water</strong>
      <p>The tap water is filtered, but for drinking and brushing teeth please use the large Santorini water dispensers located in the kitchen and common areas.</p>
    </div>
    <div class="grid-item">
      <strong>Air Conditioning</strong>
      <p>Remotes are in bedside boxes. Close all doors and windows when AC is running. Please turn off when leaving the room.</p>
    </div>
    <div class="grid-item">
      <strong>Laundry &amp; Linens</strong>
      <p>Bath towels changed daily. Bed linens changed every 3 days. Personal laundry service available — ask Angy or housekeeping.</p>
    </div>
    <div class="grid-item">
      <strong>Pool &amp; Beach</strong>
      <p>Beach chairs and umbrellas are available. Paco can assist with setup. Swim with caution — ocean currents can be strong.</p>
    </div>
    <div class="grid-item">
      <strong>Security</strong>
      <p>A safe is provided in your room for valuables. Keep the front gate closed and lock your room when away.</p>
    </div>
    <div class="grid-item">
      <strong>Rainy Season (June–Oct)</strong>
      <p>Rain typically occurs at night. Occasional power outages may happen — the villa has backup solutions.</p>
    </div>
    <div class="grid-item" style="grid-column:1/-1">
      <strong>✈️ Airport Transportation</strong>
      <p>Round-trip transfer between Puerto Vallarta Airport (PVR) and the villa is available for <strong>$5,000 MXN</strong>. Payment must be made <strong>in cash directly to the driver</strong> upon arrival. Please have pesos ready — USD accepted but change may be limited. Your concierge will arrange pickup details 24 hours before your flight.</p>
    </div>
    <div class="grid-item" style="grid-column:1/-1">
      <strong>Quiet Hours</strong>
      <p>10:00 PM – 10:00 AM. Please respect our neighbors and the serene environment of Patzcuarito.</p>
    </div>
  </div>

  <div style="background:linear-gradient(135deg,#1a4a52 0%,#2e7b8c 100%);border-radius:10px;padding:18px 22px;margin-top:16px;color:#fff;">
    <div style="font-size:.85rem;font-family:'Montserrat',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#f0b429;margin-bottom:8px;">🙏 Gratuity & Villa Team</div>
    <p style="font-size:.82rem;line-height:1.65;margin:0;">Villas Sempre Avanti is a fully staffed property. A <strong style="color:#f0b429;">10% gratuity is included</strong> as a baseline in your stay and is shared equally among the entire team dedicated to making your experience exceptional — from housekeeping and maintenance to your concierge and cook.</p>
    <p style="font-size:.82rem;line-height:1.65;margin:10px 0 0;">If you feel the team has gone above and beyond, simply let your concierge know — any additional gratuity is warmly welcomed and will be added to your final checkout.</p>
  </div>

  <div class="page-num">2</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 3 · YOUR CONCIERGE & GUEST FAVOURITES
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">YOUR CONCIERGE</div>

  <p class="description">Your dedicated concierge is here to arrange every experience — from adventure tours to private dining. All bookings require a minimum of 24 hours' notice. Ask us anything; we are here to make your stay unforgettable.</p>

  <h3 style="color:#2e7b8c;margin:20px 0 16px;font-family:'Montserrat',sans-serif;text-transform:uppercase;font-size:.9rem;letter-spacing:1px;border-bottom:1px solid #eee;padding-bottom:10px;">Guest Favourites</h3>

  <div class="top-five-item">
    <div class="top-five-num">1</div>
    <div class="top-five-content">
      <span class="top-five-title">Ally Cat Sailing</span>
      <span class="top-five-detail">Open bar, ceviche, snorkeling &amp; sunset · $3,200 MXN/person</span>
    </div>
  </div>
  <div class="top-five-item">
    <div class="top-five-num">2</div>
    <div class="top-five-content">
      <span class="top-five-title">Surf with Victor</span>
      <span class="top-five-detail">Guided sessions for all levels · from $1,200 MXN/person</span>
    </div>
  </div>
  <div class="top-five-item">
    <div class="top-five-num">3</div>
    <div class="top-five-content">
      <span class="top-five-title">Cachasol Farm Distillery</span>
      <span class="top-five-detail">90-min farm-to-glass tequila tour · $1,500 MXN/person</span>
    </div>
  </div>
  <div class="top-five-item">
    <div class="top-five-num">4</div>
    <div class="top-five-content">
      <span class="top-five-title">In-House Massage</span>
      <span class="top-five-detail">Professional treatments on your terrace · from $1,500 MXN</span>
    </div>
  </div>
  <div class="top-five-item">
    <div class="top-five-num">5</div>
    <div class="top-five-content">
      <span class="top-five-title">Villa UTV Rentals</span>
      <span class="top-five-detail">Two machines available directly from the property · from $2,200 MXN/day</span>
    </div>
  </div>

  <div class="cta-bar" style="flex-direction:column; gap:6px;">
    <div>To book any experience just speak to your concierge — we're here for you 24 hours a day. 😊</div>
    <div style="font-size:.78rem; font-weight:400; color:#5a9aaa; margin-top:4px;">Prices shown are current but may vary slightly as providers update their rates. Your concierge will always confirm the latest pricing before you book.</div>
  </div>
  <div class="page-num">3</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 4 · UTV RENTALS
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>UTV RENTALS</span>
    <span class="gold-badge">Available Directly from the Property</span>
  </div>

  <p class="description">Both UTVs are parked right at the villa and ready to go — no shuttle, no waiting. Grab the keys from your concierge and head out on your own schedule. Perfect for beach runs, jungle tracks, and coastal towns at your own pace.</p>

  <div class="utv-grid">
    <div class="utv-card">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/canam-4seater.png" alt="Can-Am Defender at the villa" />
      <div class="utv-card-info">
        <div class="utv-card-name">Can-Am Defender</div>
        <div class="utv-card-seats">⭐ Best for longer drives · 6 Passengers</div>
        <div class="utv-card-price">$2,500 MXN<span>per day · 2-day minimum</span></div>
      </div>
    </div>
    <div class="utv-card">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/polaris-6seater.png" alt="Polaris Ranger at the villa" />
      <div class="utv-card-info">
        <div class="utv-card-name">Polaris Ranger 570</div>
        <div class="utv-card-seats">⭐ Best for Sayulita · 6 Passengers</div>
        <div class="utv-card-price">$2,200 MXN<span>per day · 2-day minimum</span></div>
      </div>
    </div>
  </div>

  <div style="background:#fff8e8;border:1px solid #f0b429;border-radius:8px;padding:10px 16px;margin:12px 0;font-size:.78rem;color:#5a3e00;"><strong>⛽ Fuel Policy:</strong> Both vehicles are rented with a full tank of gas and must be returned full. If returned below full, a <strong>$1,500 MXN</strong> refuelling charge will be applied.</div>

  <ul class="inclusions-list">
    <li>Both vehicles parked on-site — available immediately</li>
    <li>Route map &amp; coastal trail guide provided</li>
    <li>Sayulita · El Anclote · San Pancho · Lo de Marcos</li>
    <li>Driver's licence required · minimum age 18</li>
    <li>2-day minimum rental · returned with full tank</li>
    <li>Basic safety equipment included</li>
  </ul>

  <div class="tip-box">💡 <strong>Concierge Tip:</strong> The Polaris Ranger is the go-to for a quick run into Sayulita — compact enough to park near the main plaza and comfortable for the short ride. The Can-Am Defender is built for distance; take it north to San Pancho for lunch, or south along the coast toward La Cruz. Ask your concierge to check tide tables before heading out — the beach road between Sayulita and Lo de Marcos is best at low tide on a hard-packed stretch.</div>

  <div class="page-num">4</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 5 · ALLY CAT SAILING
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>ALLY CAT SAILING</span>
    <span class="gold-badge">Up to 10 guests · from $20,000 MXN</span>
  </div>
  <p class="description">Sail Banderas Bay aboard the Ally Cat — a luxury 56 ft catamaran and the #1 guest favourite at Sempre Avanti. Open bar, fresh food prepared on board, snorkeling at Las Marietas Islands, boom netting and a breathtaking Pacific sunset. Choose your duration below.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/ally-cat-aerial.jpg" alt="Ally Cat Catamaran" class="hero-image" style="height:220px; object-position: center center;" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/ally-cat-deck.jpg" alt="Catamaran Deck Party" class="square-image" />
      <div class="caption">Open Bar &amp; Deck Life</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/boat-sunset.jpg" alt="Pacific Sunset" class="square-image" />
      <div class="caption">Pacific Sunset Cruise</div>
    </div>
  </div>

  <table class="pricing-table">
    <thead>
      <tr>
        <th>Duration</th>
        <th>Up to 10 guests</th>
        <th>Each extra person</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>3 Hours</td><td>$20,000 MXN</td><td>$1,200 MXN</td></tr>
      <tr><td>4 Hours</td><td>$24,000 MXN</td><td>$1,250 MXN</td></tr>
      <tr><td>6 Hours</td><td>$36,000 MXN</td><td>$1,250 MXN</td></tr>
    </tbody>
  </table>

  <p style="font-size:.75rem; color:#555; margin:6px 0 10px;"><strong style="color:#1a4a52;">All durations include:</strong> Open premium bar · Appetizers &amp; fresh food made on board · Snorkeling equipment · Boom netting · Bilingual crew · Departs Sayulita</p>

  <div class="tip-box">💡 <strong>Concierge Tip:</strong> Book the sunset departure for the most spectacular experience — the catamaran arrives back at the Sayulita pier right as the sky turns gold. The boom net is a hammock suspended over the ocean at the bow and is a consistent guest favourite. Don't miss it.</div>
  <div class="page-num">5</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 6 · FAT CAT SAILING
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>FAT CAT SAILING</span>
    <span class="gold-badge">Up to 20 guests · from $32,500 MXN</span>
  </div>
  <p class="description">For larger groups, the Fat Cat is a two-deck party catamaran built for big celebrations — bachelorette parties, corporate groups, family reunions. Same open bar and fresh food experience as Ally Cat, with a water slide, floating mats, paddleboards and space for up to 20 guests. Also offers a dedicated Monday whale watching tour.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/fatcat-party.jpg" alt="Fat Cat Party Catamaran" class="hero-image" style="height:220px; object-position: center top;" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/fatcat-aerial.jpg" alt="Fat Cat Aerial" class="square-image" />
      <div class="caption">Two-Deck Catamaran — Up to 20 Guests</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/fatcat-action.jpg" alt="Fat Cat Water Slide" class="square-image" />
      <div class="caption">Water Slide, SUP &amp; Floating Mats</div>
    </div>
  </div>

  <table class="pricing-table">
    <thead>
      <tr>
        <th>Duration</th>
        <th>Up to 20 guests</th>
        <th>Each extra person</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>3 Hours</td><td>$32,500 MXN</td><td>$1,200 MXN</td></tr>
      <tr><td>4 Hours</td><td>$42,000 MXN</td><td>$1,250 MXN</td></tr>
      <tr><td>6 Hours</td><td>$52,500 MXN</td><td>$1,250 MXN</td></tr>
      <tr style="background:#ebf5f7;"><td>🐋 Whale Watching <span style="font-size:.7rem;color:#666;">(Mondays only · Dec–Mar)</span></td><td>Adults $1,600 MXN · Kids (4–12) $1,200 MXN</td><td>Under 3 free</td></tr>
    </tbody>
  </table>

  <p style="font-size:.75rem; color:#555; margin:6px 0 10px;"><strong style="color:#1a4a52;">All durations include:</strong> Open premium bar · Continental breakfast, snacks &amp; lunch · All water activities · Water slide · Paddleboards · Floating mats · Bilingual crew · Departs Sayulita</p>

  <div class="tip-box">💡 <strong>Concierge Tip:</strong> The Fat Cat is the go-to choice for groups of 11 or more — it has two full decks, a water slide and enough space that it never feels crowded. Book the 6-hour option for a true full-day experience with lunch on the water. The Monday whale watching tour is exceptional value for families — kids under 3 sail free.</div>
  <div class="page-num">6</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 7 · PRIVATE BOAT TOUR
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>PRIVATE BOAT TOUR</span>
    <span class="gold-badge">3h · $9,500 MXN | 4h · $11,500 MXN</span>
  </div>
  <p class="description">Charter your own private vessel for a bespoke day on the water. Snorkel pristine reefs, spot dolphins and seasonal whales, or simply cruise the stunning Riviera Nayarit coastline. Up to 7 guests.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/private-boat-marietas.jpg" alt="Private Boat Tour" class="hero-image" style="height:280px; object-position: center center;" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/boat-aerial-wake.jpg" alt="Full Speed Ahead" class="square-image" />
      <div class="caption">Full Speed on the Pacific</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/seawolf-fishing.jpg" alt="Charter Boat" class="square-image" />
      <div class="caption">Your Private Charter Vessel</div>
    </div>
  </div>
  <ul class="inclusions-list">
    <li>Private vessel</li>
    <li>Captain &amp; crew</li>
    <li>Snorkeling equipment</li>
    <li>Cooler with drinks</li>
    <li>Up to 7 guests</li>
    <li>Seasonal whale watching (Dec–Mar)</li>
  </ul>
  <div class="tip-box">💡 <strong>Concierge Tip:</strong> The Marietas Islands (a UNESCO biosphere reserve) are the crown jewel of this route — home to the famous Hidden Beach accessible only by swimming through a rock tunnel. Combine with snorkeling the coral reefs around the islands for a full day. December–March adds humpback whale sightings to the itinerary.</div>
  <div class="page-num">7</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 8 · FISHING CHARTER
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>FISHING CHARTER</span>
    <span class="gold-badge">$10,000 MXN · 4 hours</span>
  </div>
  <p class="description">Head out onto the Pacific with an experienced captain and crew. The waters off Riviera Nayarit teem with mahi-mahi, tuna, snapper and more. Up to 4 guests, full equipment provided.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/seawolf-fishing.jpg" alt="Seawolf Fishing Charter" class="hero-image" style="height:280px; object-position: center center;" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/boat-fishing-charter.jpg" alt="Fishing Charter" class="square-image" />
      <div class="caption">The Seawolf — Fully Rigged</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/fishing.jpg" alt="Catch of the Day" class="square-image" />
      <div class="caption">Pacific Sport Fishing</div>
    </div>
  </div>
  <ul class="inclusions-list">
    <li>Experienced captain &amp; mate</li>
    <li>All fishing gear &amp; bait</li>
    <li>4-hour charter</li>
    <li>Up to 4 guests</li>
    <li>Fish cleaning on board</li>
    <li>Departs from Sayulita</li>
  </ul>
  <div class="tip-box">💡 <strong>Concierge Tip:</strong> Mahi-mahi (dorado) season peaks May–October, while yellowfin tuna runs strong year-round in Banderas Bay. Ask your captain about catching your own dinner — many local restaurants will cook your fresh catch the same evening. Bring sunscreen and a hat; shade on the water is limited.</div>
  <div class="page-num">8</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 9 · SPEARFISHING
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>SPEARFISHING</span>
    <span class="gold-badge">Inshore $12k | Deep Water $21k MXN</span>
  </div>
  <p class="description">An adrenaline-charged underwater adventure with expert guides. Choose the inshore experience for reef hunting, or go deep water for a full-day ocean expedition. All equipment and wetsuits provided.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/boat-spearfishing.jpg" alt="Spearfishing" class="hero-image" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/boat-shorespearfishing.jpg" alt="Inshore" class="square-image" />
      <div class="caption">Inshore Reef Spearfishing</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/fishing.jpg" alt="Catch of the Day" class="square-image" />
      <div class="caption">Deep Water Expedition</div>
    </div>
  </div>
  <ul class="inclusions-list">
    <li>Equipment &amp; expert guide</li>
    <li>Reef &amp; rocky point hunting (Inshore)</li>
    <li>Full day 7am–4pm (Deep Water)</li>
    <li>Max 3 guests (Deep Water)</li>
    <li>Professional spear guns</li>
    <li>Wetsuits provided</li>
  </ul>
  <div class="tip-box">💡 <strong>Concierge Tip:</strong> The inshore option targets the rocky reefs just south of Sayulita — great for first-timers and those who want an exhilarating half-day. The deep water expedition ventures well offshore and is a serious full-day commitment best suited to experienced swimmers and divers. No prior spearfishing experience needed for the inshore trip.</div>
  <div class="page-num">9</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 10 · WHALE WATCHING
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>WHALE WATCHING</span>
    <span class="gold-badge">Seasonal · Dec – Mar</span>
  </div>
  <p class="description">Every winter, hundreds of humpback whales migrate to Banderas Bay. Join a guided 3-hour tour from Sayulita to witness these magnificent creatures up close, alongside playful dolphins and rich marine life.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/whale.jpg" alt="Whale Watching" class="hero-image" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/whale-breach.jpg" alt="Humpback Breaching" class="square-image" />
      <div class="caption">Humpback Breaching — Banderas Bay</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/whale-tour-boat.jpg" alt="Whale Tour Boat" class="square-image" />
      <div class="caption">Up Close with the Giants</div>
    </div>
  </div>
  <ul class="inclusions-list">
    <li>3-hour guided tour</li>
    <li>Whale &amp; dolphin sightings</li>
    <li>Snack &amp; drink included</li>
    <li>Bilingual guide via MiChula Tours</li>
    <li>Arrive 30 min early</li>
    <li>Refund if tour cancelled</li>
  </ul>
  <div class="tip-box">💡 <strong>Concierge Tip:</strong> Banderas Bay is one of the world's most reliable humpback whale destinations — over 1,000 individuals migrate here each winter from Alaska and Canada to breed and nurse. Peak sightings are January and February. Morning departures typically offer calmer seas and better light for photos. Dolphins are spotted on almost every trip, year-round.</div>
  <div class="page-num">10</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 11 · SURFING WITH VICTOR
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>SURFING WITH VICTOR</span>
    <span class="gold-badge">from $1,200 MXN / person</span>
  </div>
  <p class="description">Victor is your expert surf guide for the Riviera Nayarit. With intimate knowledge of every break — from Sayulita's beginner waves to La Lancha's world-class barrels — he tailors every session to your level. Instagram: @yeahvary.surf</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/surf-sayulita.jpg" alt="Victor Surf" class="hero-image" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/surf-victor.jpg" alt="Sayulita Main Break" class="square-image" />
      <div class="caption">Sayulita Main Break</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/surf-victor3.jpg" alt="Victor Guide" class="square-image" />
      <div class="caption">Victor — Your Surf Guide</div>
    </div>
  </div>
  <div style="margin-top:10px">
    <div class="grid-item" style="border-bottom:1px solid #eee;padding:8px 0">
      <strong>1. Beginner Lesson (Sayulita) — $1,200 MXN/pp</strong>
      <span>Min 2 · Board &amp; rash guard included</span>
    </div>
    <div class="grid-item" style="border-bottom:1px solid #eee;padding:8px 0">
      <strong>2. Punta de Mita Session (La Lancha) — $2,000 MXN/pp</strong>
      <span>1.5h lesson + 30min free surf · Transport + board</span>
    </div>
    <div class="grid-item" style="border-bottom:1px solid #eee;padding:8px 0">
      <strong>3. Surf Guiding (Intermediate) — $2,500 MXN/pp</strong>
      <span>Half day · Min 2 · Guide + transport + board</span>
    </div>
    <div class="grid-item" style="border-bottom:1px solid #eee;padding:8px 0">
      <strong>4. Advanced Coaching — $3,500 MXN/pp</strong>
      <span>Half day · Experienced surfers only</span>
    </div>
    <div class="grid-item" style="padding:8px 0">
      <strong>5. Boat Trip Surf Safari — $15,000 MXN</strong>
      <span>Up to 4 surfers · Full day · Private boat + guide + drinks</span>
    </div>
  </div>
  <div class="page-num">11</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 12 · CANOPY ZIPLINE
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>CANOPY ZIPLINE</span>
    <span class="gold-badge">MiChula Tours</span>
  </div>
  <p class="description">Fly through the jungle canopy on 13 exhilarating zip lines at Rancho Mi Chula, just minutes from Sayulita. Suitable for all experience levels, with certified guides and full safety briefings.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/zipline-hero.jpg" alt="Zipline" class="hero-image" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/zipline-sq1.jpg" alt="13 Lines Through the Jungle" class="square-image" />
      <div class="caption">13 Lines Through the Jungle</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/zipline-sq2.jpg" alt="Certified Guides" class="square-image" />
      <div class="caption">Certified Guides &amp; Safety Equipment</div>
    </div>
  </div>
  <ul class="inclusions-list">
    <li>13 zip lines</li>
    <li>Certified guides</li>
    <li>Safety briefing &amp; gear</li>
    <li>All levels welcome</li>
    <li>Departs Rancho Mi Chula</li>
    <li>Bring closed shoes</li>
  </ul>
  <div class="tip-box">💡 <strong>Concierge Tip:</strong> Rancho Mi Chula is just 5 minutes from the villa — one of the closest and most value-packed adventure parks on the Riviera Nayarit. The 13-line circuit winds through dense jungle canopy with ocean views from the upper platforms. Closed-toe shoes are mandatory; sandals will not be permitted. Great for all ages — kids as young as 6 typically handle this with no issues.</div>
  <div class="page-num">12</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 13 · ATV / RZR ADVENTURE
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>ATV / RZR ADVENTURE</span>
    <span class="gold-badge">MiChula Tours</span>
  </div>
  <p class="description">Tear through jungle trails, sandy beaches and hidden mountain paths on an ATV or RZR. Choose solo or double, with departures at 9 AM, 12 PM and 3 PM daily. Maximum 7 vehicles per group.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/rzr-hero.jpg" alt="RZR Adventure" class="hero-image" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/atv-sq1.jpg" alt="ATV Trails" class="square-image" />
      <div class="caption">Jungle &amp; Beach Trails</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/atv-sq2.jpg" alt="RZR 4-Seater" class="square-image" />
      <div class="caption">RZR — Up to 4 Passengers</div>
    </div>
  </div>
  <ul class="inclusions-list">
    <li>ATV Single: $119 USD</li>
    <li>ATV Double: $147 USD</li>
    <li>RZR (2-pax): $324 USD</li>
    <li>RZR (4-pax): contact concierge</li>
    <li>Driver min. 16 years</li>
    <li>2-hour duration</li>
    <li>Departs Rancho Mi Chula</li>
  </ul>
  <div class="page-num">13</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 14 · HORSEBACK RIDING
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>HORSEBACK RIDING</span>
    <span class="gold-badge">MiChula Tours · $76 USD/person</span>
  </div>
  <p class="description">Explore Sayulita on horseback through lush jungle trails and down to the beach at sunset. Suitable for all experience levels. Antonio, Jorge and Miguel lead unforgettable rides with a dedicated photography team.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/horse-hero.jpg" alt="Horseback Riding" class="hero-image" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/horse-hero.jpg" alt="Jungle Trails" class="square-image" />
      <div class="caption">Jungle Trails to the Beach</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/horse-sq2.jpg" alt="Sunset Ride" class="square-image" />
      <div class="caption">Sunset Beach Ride</div>
    </div>
  </div>
  <ul class="inclusions-list">
    <li>2-hour guided ride</li>
    <li>Jungle trails + beach</li>
    <li>All experience levels</li>
    <li>Photography team on-site</li>
    <li>$76 USD per person</li>
    <li>Departs Rancho Mi Chula</li>
  </ul>
  <div class="tip-box">💡 <strong>Concierge Tip:</strong> Book the late afternoon departure for the most magical experience — the trail emerges onto the beach right at golden hour, and guides Antonio, Jorge and Miguel know exactly when to time the arrival for the best sunset photos. The on-site photography team captures the whole ride so you don't need to worry about your phone.</div>
  <div class="page-num">14</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 15 · MONKEY MOUNTAIN HIKE
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>MONKEY MOUNTAIN HIKE</span>
    <span class="gold-badge">3.5 hrs · MiChula Tours</span>
  </div>
  <p class="description">Trek to the summit of Cerro del Mono (Monkey Mountain) for panoramic views of Banderas Bay from Punta Mita to Sayulita. An intermediate–advanced hike through dense tropical jungle with abundant wildlife.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/monkey-view-flowers.jpg" alt="Monkey Mountain View" class="hero-image" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/monkey-summit-girl.jpg" alt="Summit View" class="square-image" />
      <div class="caption">Panoramic Bay Views from the Summit</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/monkey-coastal-sunset.jpg" alt="Coastal Sunset" class="square-image" />
      <div class="caption">Jungle Coast at Golden Hour</div>
    </div>
  </div>
  <ul class="inclusions-list">
    <li>~6.5 km hike</li>
    <li>Departs Higuera Blanca (~15 min south)</li>
    <li>Fresh coconut on return</li>
    <li>$96 USD (1–3 pax)</li>
    <li>$81 USD/pp (4+ pax)</li>
    <li>Intermediate–advanced level</li>
    <li>Wear closed shoes</li>
    <li>Bring water &amp; sunscreen</li>
  </ul>
  <div class="tip-box">💡 <strong>Concierge Tip:</strong> Depart early — ideally by 7 AM — to beat the heat and reach the summit before the mid-morning haze rolls in. The views from the top stretch from Punta Mita all the way to Puerto Vallarta. Howler monkeys are frequently heard (and sometimes spotted) in the tree canopy along the trail. Bring at least 1.5L of water per person.</div>
  <div class="page-num">15</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 16 · GOLF NEAR PUNTA MITA
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>GOLF NEAR PUNTA MITA</span>
    <span class="gold-badge">Ask Concierge for Rates</span>
  </div>
  <p class="description">Punta Mita is home to two world-class Jack Nicklaus Signature golf courses — the Pacifico Course and the Bahia Course — set amid breathtaking ocean views of Banderas Bay and the Marietas Islands.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/golf-aerial-resort.jpg" alt="Punta Mita Golf Resort" class="hero-image" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/golf-fairway-beach.jpg" alt="Oceanfront Fairway" class="square-image" />
      <div class="caption">Oceanfront Fairway — Pacifico Course</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/golf-island-green.jpg" alt="Island Green" class="square-image" />
      <div class="caption">Tail of the Whale — World's Only Natural Island Green</div>
    </div>
  </div>
  <ul class="inclusions-list">
    <li>Two Nicklaus Signature courses</li>
    <li>Pacifico Course (18 holes)</li>
    <li>Bahia Course (18 holes)</li>
    <li>Four Seasons &amp; St. Regis access</li>
    <li>Dress code required</li>
    <li>Reservations essential</li>
    <li>Caddies available</li>
  </ul>
  <div class="tip-box">💡 <strong>Concierge Tip:</strong> The Pacifico Course features the famous "Tail of the Whale" — the world's only natural island green, accessible by boat at low tide. It is one of the most photographed holes in golf. The Bahia Course offers a more private experience with equally dramatic ocean views. Tee times book out weeks in advance during high season — let your concierge secure yours as early as possible.</div>
  <div class="page-num">16</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 17 · YOGA & MOVEMENT
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>YOGA &amp; MOVEMENT</span>
    <span class="gold-badge">from $1,200 MXN / session</span>
  </div>
  <p class="description">Begin your morning with a private yoga session on the terrace or pool deck, led by a certified instructor from Sayulita. All styles available — Vinyasa, Yin, Restorative, or a custom session tailored to your group.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/yoga.png" alt="Yoga" class="hero-image" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/yoga-beach-class.jpg" alt="Beach Yoga Class" class="square-image" />
      <div class="caption">Beach Yoga — Sayulita Cove</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/yoga-villa-terrace.jpg" alt="Yoga on Villa Terrace" class="square-image" />
      <div class="caption">Yoga on the Villa Terrace</div>
    </div>
  </div>
  <ul class="inclusions-list">
    <li>Private certified instructor</li>
    <li>All levels welcome</li>
    <li>Vinyasa, Yin, Restorative</li>
    <li>Group &amp; couples sessions</li>
    <li>Mats &amp; props provided</li>
    <li>1–1.5 hour sessions</li>
    <li>From $1,200 MXN/session</li>
  </ul>
  <div class="tip-box">💡 <strong>Concierge Tip:</strong> Schedule your session for 7–8 AM on the pool terrace — the early morning light over the jungle canopy and the sound of birds creates an atmosphere you simply can't replicate at home. The beach option puts you on the sand at the cove below Sayulita's main break, with the sound of waves as a natural soundtrack. Perfect for beginners and experienced practitioners alike.</div>
  <div class="page-num">17</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 18 · IN-HOUSE MASSAGE
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>IN-HOUSE MASSAGE</span>
    <span class="gold-badge">from $1,500 MXN / treatment</span>
  </div>
  <p class="description">Indulge in a professional massage treatment on your private terrace or in the comfort of your villa. Our therapists bring everything needed for a world-class spa experience — without leaving the property.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/massage-hot-stone.jpg" alt="In-House Massage" class="hero-image" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/massage.jpg" alt="Massage Treatment" class="square-image" />
      <div class="caption">Terrace Massage Treatments</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/massage-villa-outdoor.jpg" alt="Hot Stone Therapy" class="square-image" />
      <div class="caption">Villa Terrace — Poolside Treatments</div>
    </div>
  </div>
  <ul class="inclusions-list">
    <li>Swedish &amp; deep tissue</li>
    <li>Hot stone therapy</li>
    <li>Couples massage available</li>
    <li>All oils &amp; equipment included</li>
    <li>60 / 90 / 120 min options</li>
    <li>From $1,500 MXN</li>
  </ul>
  <div class="tip-box">💡 <strong>Concierge Tip:</strong> The terrace overlooking the pool is the most popular treatment spot — therapists set up facing the jungle, making it a truly immersive outdoor experience. For couples, book side-by-side treatments at sunset for an unforgettable combination. The 90-minute deep tissue session is the most-requested treatment among Sempre Avanti guests.</div>
  <div class="page-num">18</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 19 · SOUND BATH & HEALING
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>SOUND BATH &amp; HEALING</span>
    <span class="gold-badge">$3,000 MXN / session</span>
  </div>
  <p class="description">A restorative sound healing session using Tibetan singing bowls, crystal bowls and percussion instruments. Lie back, breathe deeply and let the vibrations dissolve stress and tension. Ideal for groups of 4–10.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/soundbath.jpg" alt="Sound Bath" class="hero-image" />
  <ul class="inclusions-list">
    <li>Private certified sound healer</li>
    <li>Tibetan &amp; crystal bowls</li>
    <li>Gong &amp; percussion instruments</li>
    <li>60–75 minute session</li>
    <li>Up to 10 participants</li>
    <li>Mats &amp; blankets provided</li>
  </ul>
  <div class="tip-box">💡 <strong>Concierge Tip:</strong> Sound baths work best in the evening when the mind is ready to slow down. The session is held right here at the villa — on the open terrace or in the sala — with the healer arranging bowls around each participant for an immersive 360° sound experience. Guests consistently describe it as the most deeply relaxing thing they do during their stay. No experience or prior knowledge needed — simply lie down and breathe.</div>
  <div class="page-num">19</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 20 · SUNSET PRIVATE BARTENDER
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>SUNSET PRIVATE BARTENDER</span>
    <span class="gold-badge">from $2,500 MXN · 3 hours</span>
  </div>
  <p class="description">Elevate your evening with a private bartender who brings the party to you. Classic cocktails, margaritas, mezcal tastings and custom creations — served poolside or on the terrace as the Pacific sun sets. 3-hour experience.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/bartender-sunset-group.jpg" alt="Sunset Bartender" class="hero-image" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/bartender-cocktail-pour.jpg" alt="Cocktail Pour" class="square-image" />
      <div class="caption">Handcrafted Cocktails</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/bartender-cocktails.jpg" alt="Signature Drinks" class="square-image" />
      <div class="caption">Signature &amp; Classic Creations</div>
    </div>
  </div>
  <ul class="inclusions-list">
    <li>Private bartender</li>
    <li>3-hour service</li>
    <li>Classic &amp; signature cocktails</li>
    <li>Minimum 4 guests</li>
    <li>All equipment provided</li>
    <li>Margarita Pitcher add-on: $1,000</li>
  </ul>
  <div class="tip-box">💡 <strong>Concierge Tip:</strong> Start at 5 PM to catch the full sunset from the pool terrace — Patzcuarito sits on an elevated ridge with an unobstructed western view over the Pacific. The bartender can prepare a signature welcome cocktail for arrival, then transition to rounds as the evening unfolds. Pair with the After-Hours Dinner add-on for the ultimate villa night.</div>
  <div class="page-num">20</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 21 · SAYULITA TACO TOUR
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>SAYULITA TACO TOUR</span>
    <span class="gold-badge">$1,200 MXN / person · Min 4</span>
  </div>
  <p class="description">Taste your way through Sayulita's best taco spots with a local guide who knows every hidden gem. Visit 5 hand-picked taco stands and restaurants, sampling authentic flavours from al pastor to Baja shrimp — washed down with cold mezcal shots.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/taco-stand.jpg" alt="Sayulita Taco Stand" class="hero-image" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/taco-board.jpg" alt="Taco Board" class="square-image" />
      <div class="caption">Al Pastor, Baja Shrimp &amp; More</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/taco-salsas.jpg" alt="Fresh Salsas" class="square-image" />
      <div class="caption">Fresh House Salsas</div>
    </div>
  </div>
  <ul class="inclusions-list">
    <li>5 taco stops</li>
    <li>Local guide included</li>
    <li>Al pastor, Baja shrimp, mole &amp; more</li>
    <li>Mezcal tasting included</li>
    <li>Min 4 guests</li>
    <li>Dietary accommodations available</li>
  </ul>
  <div class="tip-box">💡 <strong>Concierge Tip:</strong> Go hungry — each stop serves 1–2 tacos plus salsas and sides, so by the fifth stop you will have sampled the full spectrum of Mexican street food culture. The guide brings context to each vendor: family histories, regional techniques and the stories behind the recipes. Best experienced in the evening when the stands are at their liveliest and the mezcal flows.</div>
  <div class="page-num">21</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 22 · CACHASOL TEQUILA DISTILLERY
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>CACHASOL DISTILLERY TOUR</span>
    <span class="gold-badge">$1,500 MXN / person</span>
  </div>
  <p class="description">Step behind the scenes at Cachasol — Nayarit's most celebrated artisan tequila distillery set on a working agave farm just 10 minutes from the villa. A 90-minute farm-to-glass experience with a guided tasting of blanco, reposado and añejo.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/cachasol-bar.jpg" alt="Cachasol Farm" class="hero-image" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/cachasol-dock.jpg" alt="Cachasol Farm Grounds" class="square-image" />
      <div class="caption">Cachasol Farm Grounds</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/cachasol-bottles.jpg" alt="Cachasol Tequila" class="square-image" />
      <div class="caption">Cachasol Blanco &amp; Epic Strength</div>
    </div>
  </div>
  <ul class="inclusions-list">
    <li>90-minute guided tour</li>
    <li>Agave farm walk</li>
    <li>Distillery process explained</li>
    <li>Tasting: Blanco, Reposado &amp; Añejo</li>
    <li>$1,500 MXN/person</li>
    <li>cachasol.com for info</li>
  </ul>
  <div class="tip-box">💡 <strong>Concierge Tip:</strong> Cachasol produces small-batch tequila from blue agave grown right on the property — a true farm-to-glass experience that larger commercial distilleries simply can't offer. The tasting finishes with their Epic Strength expression (above 50% ABV), which is not available for retail export. Pair this with the Private Cooking Class held at Cachasol (Tue–Sun, 2:30 PM) for an unforgettable full afternoon.</div>
  <div class="page-num">22</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 23 · PRIVATE COOKING CLASS
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <span>PRIVATE COOKING CLASS</span>
    <span class="gold-badge">$1,200 MXN / person</span>
  </div>
  <p class="description">Learn the secrets of authentic Mexican cuisine with a private chef. From fresh salsas and ceviche to hand-pressed tortillas and complex moles — a fun, hands-on experience that brings the flavours of Mexico straight to your table.</p>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/cooking-class-group.jpg" alt="Cooking Class" class="hero-image" />
  <div class="image-row">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/cooking-salsas.jpg" alt="Mexican Ingredients" class="square-image" />
      <div class="caption">Fresh Salsas &amp; Local Ingredients</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/cooking-ingredients.jpg" alt="Cooking Station" class="square-image" />
      <div class="caption">Hands-On Cooking Station</div>
    </div>
  </div>
  <ul class="inclusions-list">
    <li>Private chef instructor</li>
    <li>All ingredients included</li>
    <li>Hands-on cooking session</li>
    <li>2–3 hours duration</li>
    <li>Arrangeable at the villa or Cachasol</li>
    <li>Cachasol sessions: Tue–Sun at 2:30 PM</li>
  </ul>
  <div class="tip-box">💡 <strong>Concierge Tip:</strong> The class typically covers 4–5 dishes: a fresh salsa, guacamole, ceviche, hand-pressed corn tortillas and a main such as mole chicken or grilled fish. Everything is prepared from scratch using local market ingredients. The Cachasol setting adds an outdoor kitchen ambience under the trees — book the 2:30 PM slot and combine it with a tequila tasting immediately after.</div>
  <div class="page-num">23</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 24 · DINING IN SAYULITA
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">DINING IN SAYULITA</div>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/dining-sayulita.jpg" alt="Sayulita Dining" class="hero-image" />

  <div class="restaurant-card">
    <strong>La Rústica <span class="tag">Italian-Mexican · Upscale</span></strong>
    <p>Modern eatery on Av. Revolución with Italian-inspired dishes, house-made pasta, wood-fired flavours and creative cocktails. One of Sayulita's most polished dining experiences.</p>
  </div>
  <div class="restaurant-card">
    <strong>El Itacate <span class="tag">Mexican · All Day</span></strong>
    <p>A Sayulita institution on Calle José Mariscal. Famous for tacos al pastor, huevos rancheros and chilaquiles. Busy from breakfast through lunch — arrive early or expect a wait.</p>
  </div>
  <div class="restaurant-card">
    <strong>Orgánica <span class="tag">Health Food · Juices</span></strong>
    <p>Smoothie bowls, cold-pressed juices, avocado toast and organic plates on Av. Revolución. The go-to for a light, nourishing breakfast or post-surf lunch.</p>
  </div>
  <div class="restaurant-card">
    <strong>Mary's <span class="tag">Mexican · Comida Corrida</span></strong>
    <p>No-frills, home-style Mexican on Av. Revolución 36. Ask for the daily comida corrida — exceptional value and always delicious. A true local favourite since forever.</p>
  </div>
  <div class="restaurant-card">
    <strong>Yambak <span class="tag">Bar · Cocktails · Bites</span></strong>
    <p>Lively bar on Calle Marlín 12 with creative cocktails and casual bites. Great energy for sundowners with a group. More of a drinks-first spot than a full-dinner destination.</p>
  </div>
  <div class="restaurant-card">
    <strong>Don Pedro's <span class="tag">Seafood · Beachfront · Since 1994</span></strong>
    <p>Sayulita's most iconic beachfront restaurant. Fresh seafood, grilled fish tacos and cold beers right on the sand since 1994. Book ahead for sunset — tables go fast.</p>
  </div>

  <div class="page-num">24</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 25 · DINING — PUNTA MITA & SAN PANCHO
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">DINING OUT — PUNTA MITA &amp; SAN PANCHO</div>
  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/diner.jpg" alt="Punta Mita Dining" class="hero-image" />

  <h3 style="color:#1a4a52;font-family:'Montserrat',sans-serif;font-size:.85rem;text-transform:uppercase;letter-spacing:1px;margin:8px 0 10px;padding-bottom:6px;border-bottom:2px solid #f0b429;">Punta Mita <span style="font-weight:300;color:#666">· 5 min from villa</span></h3>
  <div class="restaurant-card">
    <strong>El Original Anclote <span class="tag">Beach Seafood · Casual</span></strong>
    <p>Grilled whole fish, aguachile, shrimp tacos and cold beers right on El Anclote beach. The quintessential Punta Mita lunch — feet in the sand, ocean in front of you.</p>
  </div>
  <div class="restaurant-card">
    <strong>Mita'z Pizza <span class="tag">Pizza · Casual</span></strong>
    <p>A reliable, beloved pizza spot on Calle Marlín 122, Punta Mita. Thin-crust pies, cold drinks and a relaxed setting. The perfect easy dinner after a day on the water.</p>
  </div>
  <div class="restaurant-card">
    <strong>Four Seasons / St. Regis <span class="tag">Fine Dining · Reservation Required</span></strong>
    <p>World-class dining with dramatic Banderas Bay views. Smart-casual dress code; reservations essential. Worth every peso for a truly special evening out.</p>
  </div>

  <h3 style="color:#1a4a52;font-family:'Montserrat',sans-serif;font-size:.85rem;text-transform:uppercase;letter-spacing:1px;margin:16px 0 10px;padding-bottom:6px;border-bottom:2px solid #f0b429;">San Pancho <span style="font-weight:300;color:#666">· 15 min from villa</span></h3>
  <div class="restaurant-card">
    <strong>Bistro Orgánico <span class="tag">Organic · Garden Dining</span></strong>
    <p>Beloved restaurant at Hotel Cielo Rojo serving creative, organic cuisine in a stunning jungle garden. Consistently rated one of the best dining experiences in all of Riviera Nayarit.</p>
  </div>
  <div class="restaurant-card">
    <strong>San Pan Beach Bistro <span class="tag">Beachfront · Casual</span></strong>
    <p>Laid-back beachfront spot on Av. Tercer Mundo 11A serving fresh Mexican bites, ceviche and cocktails with your feet in the sand. The ideal lazy San Pancho afternoon.</p>
  </div>
  <div class="restaurant-card">
    <strong>Su Pancha Madre <span class="tag">Mexican · Tacos · Local Favourite</span></strong>
    <p>A beloved San Pancho staple for authentic Mexican street food — standout tacos, tostadas and daily specials at honest prices. Unpretentious, delicious and always packed with locals.</p>
  </div>

  <div class="page-num">25</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 26 · LOCAL MARKETS
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">LOCAL MARKETS</div>

  <div class="image-row" style="margin-top:16px">
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/market-sayulita.jpg" alt="Sayulita Market" class="square-image" />
      <div class="caption">Sayulita Artisan Market — Every Friday</div>
    </div>
    <div class="square-image-container">
      <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/market-la-cruz.jpg" alt="La Cruz Sunday Market" class="square-image" />
      <div class="caption">La Cruz Sunday Market</div>
    </div>
  </div>

  <h3 style="color:#2e7b8c;font-family:'Montserrat',sans-serif;font-size:.85rem;text-transform:uppercase;margin:16px 0 10px;letter-spacing:1px;">Sayulita Artisan Market</h3>
  <p class="description" style="margin-bottom:10px">Every <strong>Friday</strong> from 10 AM – 4 PM on the main plaza. Fresh produce, handmade crafts, jewellery, textiles, and incredible street food. Best visited in the morning for the freshest selection.</p>

  <h3 style="color:#2e7b8c;font-family:'Montserrat',sans-serif;font-size:.85rem;text-transform:uppercase;margin:16px 0 10px;letter-spacing:1px;">La Cruz Sunday Market</h3>
  <p class="description" style="margin-bottom:10px">Every <strong>Sunday</strong> from 9 AM – 2 PM at the La Cruz de Huanacaxtle marina (25 min from villa). One of the best markets on the Riviera Nayarit — gourmet food stalls, ceramics, clothing, live music and ocean views.</p>

  <div class="grid-list" style="margin-top:10px">
    <div class="grid-item">
      <strong>Nearby Towns</strong>
      <span>San Pancho · 15 min · Artsy village, great dining</span><br>
      <span>La Cruz de Huanacaxtle · 25 min · Marina, Sunday market</span><br>
      <span>Punta Mita · 5 min · Beaches, golf, fine dining</span>
    </div>
    <div class="grid-item">
      <strong>Natural Highlights</strong>
      <span>Marietas Islands (UNESCO protected)</span><br>
      <span>Whale migration Dec–Mar</span><br>
      <span>Mangrove kayaking</span><br>
      <span>Jungle hikes &amp; waterfalls</span>
    </div>
  </div>

  <div class="page-num">26</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 27 · ADD-ON SERVICES
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">ADD-ON SERVICES &amp; PRICING</div>

  <table class="pricing-table">
    <thead>
      <tr>
        <th>Service</th>
        <th>Details</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Early Check-In</td><td>Before 12:00 PM</td><td>$300 USD</td></tr>
      <tr><td>Late Check-Out</td><td>After 11:00 AM</td><td>$300 USD</td></tr>
      <tr><td>After-Hours Dinner</td><td>Chef service + food cost</td><td>$25 USD + cost</td></tr>
      <tr><td>Beach Fire Preparation</td><td>Setup &amp; firewood included</td><td>$100 USD</td></tr>
    </tbody>
  </table>

  <p style="font-size:.8rem;color:#c0392b;margin-top:12px;background:#fff8f8;padding:10px;border-radius:6px;border:1px solid #f5c0c0;">⚠️ Please confirm all add-on pricing directly with your concierge — rates are subject to change.</p>

  <div style="margin-top:28px;">
    <h3 style="color:#2e7b8c;font-family:'Montserrat',sans-serif;font-size:.85rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;padding-bottom:8px;border-bottom:2px solid #f0b429;">How to Request</h3>
    <div class="grid-list">
      <div class="grid-item">
        <strong>🌅 Early Check-In</strong>
        <span>Request at time of booking or at least 48 hours before arrival. Subject to villa availability — confirmed by concierge.</span>
      </div>
      <div class="grid-item">
        <strong>🌙 Late Check-Out</strong>
        <span>Request at least 24 hours before your departure. The villa must be vacated by the agreed time to prepare for incoming guests.</span>
      </div>
      <div class="grid-item">
        <strong>🍽️ After-Hours Dinner</strong>
        <span>Private chef service from 9 PM onwards. Food cost is additional and agreed in advance. Minimum 4 guests recommended.</span>
      </div>
      <div class="grid-item">
        <strong>🔥 Beach Fire</strong>
        <span>Your concierge arranges everything — firewood, setup and safety. Fires are held on the private beach area below the villa at dusk.</span>
      </div>
    </div>
  </div>

  <div class="page-num">27</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 28 · NEARBY TOWNS & NATURAL HIGHLIGHTS
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">EXPLORING THE RIVIERA NAYARIT</div>

  <img src="https://hrtyncnxnbdteccigzav.supabase.co/storage/v1/object/public/site-assets/concierge-guide/puerto-vallarta.jpg" alt="Riviera Nayarit" class="hero-image" />

  <div class="grid-list" style="margin-top:16px">
    <div>
      <h3 style="color:#1a4a52;font-family:'Montserrat',sans-serif;font-size:.85rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #f0b429">Nearby Towns</h3>
      <div class="grid-item"><strong>Sayulita Village</strong><span>2 min · Surf, food, boutiques, nightlife</span></div>
      <div class="grid-item"><strong>Punta Mita</strong><span>5 min · Beaches, golf, Four Seasons, St. Regis</span></div>
      <div class="grid-item"><strong>San Pancho</strong><span>15 min · Artsy village, excellent restaurants</span></div>
      <div class="grid-item"><strong>La Cruz de Huanacaxtle</strong><span>25 min · Marina, Sunday market, seafood</span></div>
      <div class="grid-item"><strong>Bucerias</strong><span>30 min · Expat town, Saturday art walk</span></div>
      <div class="grid-item"><strong>Puerto Vallarta</strong><span>60 min · City, shopping, Malecón</span></div>
    </div>
    <div>
      <h3 style="color:#1a4a52;font-family:'Montserrat',sans-serif;font-size:.85rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #f0b429">Natural Highlights</h3>
      <div class="grid-item"><strong>Marietas Islands</strong><span>UNESCO-protected · Hidden beach, snorkeling</span></div>
      <div class="grid-item"><strong>Humpback Whales</strong><span>Dec–Mar · Banderas Bay migration</span></div>
      <div class="grid-item"><strong>Monkey Mountain</strong><span>Cerro del Mono · Panoramic bay views</span></div>
      <div class="grid-item"><strong>Mangrove Kayaking</strong><span>San Pancho river · Wildlife &amp; birdwatching</span></div>
      <div class="grid-item"><strong>Jungle Waterfalls</strong><span>Ask concierge for guided hike access</span></div>
      <div class="grid-item"><strong>Snorkeling Reefs</strong><span>El Anclote &amp; Islas Marietas</span></div>
    </div>
  </div>

  <div class="page-num">28</div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 29 · EMERGENCY CONTACTS
══════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">EMERGENCY CONTACTS</div>

  <div class="emergency-card">
    <h4>🚨 Villa Concierge (24/7)</h4>
    <p>Your first point of contact for any issue, medical need, or emergency at the villa.</p>
    <div class="number">WhatsApp your concierge directly</div>
  </div>

  <div class="emergency-card">
    <h4>🏥 Cruz Roja — Red Cross Ambulance</h4>
    <p>Nearest emergency medical services for Sayulita &amp; Punta Mita area.</p>
    <div class="number">065 · (329) 291-3040</div>
  </div>

  <div class="emergency-card">
    <h4>👮 Police — Sayulita</h4>
    <p>Local police station — Sayulita, Nayarit.</p>
    <div class="number">060 · (329) 291-3200</div>
  </div>

  <div class="emergency-card">
    <h4>🔥 Fire Department</h4>
    <p>Bomberos — Nayarit emergency services.</p>
    <div class="number">068</div>
  </div>

  <div class="emergency-card">
    <h4>🏥 Hospital CMQ Riviera Nayarit</h4>
    <p>Nearest full-service hospital — Nuevo Vallarta (35 min). 24h emergency room.</p>
    <div class="number">(322) 226-6500</div>
  </div>

  <div class="emergency-card">
    <h4>✈️ Puerto Vallarta International Airport (PVR)</h4>
    <p>60 minutes from villa. Terminal A (domestic) &amp; Terminal B (international).</p>
    <div class="number">(322) 221-1325</div>
  </div>

  <div class="cta-bar" style="background:#fff8f8;border-color:#e88;color:#c0392b">In any emergency, call your concierge first — we are here 24/7</div>
  <div class="page-num">29</div>
</div>

`;

const STYLES = `
    /* ─── Reset & Base ─────────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { background: #e8e4df; font-family: 'Montserrat', sans-serif; color: #2c2c2c; line-height: 1.6; font-size: 14px; }

    /* ─── A4 Page ───────────────────────────────────────────────── */
    .page {
      background: #fff;
      width: 794px;
      min-height: 1123px;
      margin: 30px auto;
      padding: 48px;
      box-shadow: 0 4px 24px rgba(0,0,0,.14);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* ─── Typography ────────────────────────────────────────────── */
    h1,h2,h3,h4 { font-family:'Cormorant Garamond',serif; font-weight:600; }

    /* ─── Section Header ────────────────────────────────────────── */
    .section-header {
      background: #2e7b8c; color: #fff;
      padding: 12px 20px; border-radius: 6px;
      font-family:'Cormorant Garamond',serif; font-size:1.4rem;
      display:flex; justify-content:space-between; align-items:center;
      margin-bottom:24px;
    }
    .gold-badge {
      background:#f0b429; color:#2c2c2c;
      padding:4px 12px; border-radius:20px;
      font-family:'Montserrat',sans-serif; font-size:.75rem; font-weight:700;
      text-transform:uppercase; white-space:nowrap;
    }

    /* ─── Images ────────────────────────────────────────────────── */
    .hero-image { width:100%; height:220px; object-fit:cover; border-radius:8px; margin:16px 0; display:block; }
    .hero-image.tall { height:500px; }
    .image-row { display:flex; gap:16px; margin-bottom:16px; }
    .square-image-container { width:calc(50% - 8px); }
    .square-image { width:100%; height:270px; object-fit:cover; border-radius:8px; display:block; }
    .caption { font-size:.7rem; color:#888; text-align:center; margin-top:6px; font-weight:500; }

    /* ─── Content Blocks ────────────────────────────────────────── */
    p.description { margin-bottom:16px; text-align:justify; }
    .inclusions-list { list-style:none; padding:0; margin:16px 0; display:grid; grid-template-columns:1fr 1fr; gap:8px 16px; }
    .inclusions-list li { font-size:.82rem; padding-left:20px; position:relative; }
    .inclusions-list li::before { content:'✓'; color:#2e7b8c; position:absolute; left:0; font-weight:700; }

    /* ─── CTA Bar ───────────────────────────────────────────────── */
    .cta-bar { background:#ebf5f7; border:1px solid #2e7b8c; border-radius:6px; padding:12px 20px; text-align:center; color:#2e7b8c; font-weight:600; font-size:.9rem; margin-top:auto; }

    /* ─── Cover Page ────────────────────────────────────────────── */
    .page.cover { background:#1a4a52; color:#faf8f5; justify-content:center; align-items:center; text-align:center; }
    .cover-line { width:100px; height:2px; background:#f0b429; margin:30px auto; }
    .cover-title { font-size:3.5rem; line-height:1.1; margin:20px 0; letter-spacing:.05em; color:#faf8f5; }
    .cover-subtitle { font-family:'Montserrat',sans-serif; text-transform:uppercase; letter-spacing:.2em; font-size:1rem; color:#faf8f5; }
    .cover-location { color:#f0b429; font-size:.9rem; margin-top:10px; text-transform:uppercase; letter-spacing:.1em; }
    .cover-footer { position:absolute; bottom:48px; opacity:.6; font-size:.8rem; letter-spacing:.1em; }

    /* ─── Tables ─────────────────────────────────────────────────── */
    .pricing-table { width:100%; border-collapse:collapse; margin:20px 0; }
    .pricing-table th,.pricing-table td { text-align:left; padding:12px; border-bottom:1px solid #eee; }
    .pricing-table th { color:#2e7b8c; font-family:'Montserrat',sans-serif; font-weight:600; }
    .pricing-table td:last-child { text-align:right; font-weight:600; color:#1a4a52; }

    /* ─── Grid Lists ─────────────────────────────────────────────── */
    .grid-list { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
    .grid-item { margin-bottom:10px; }
    .grid-item strong { color:#1a4a52; display:block; margin-bottom:2px; }
    .grid-item span { font-size:.8rem; color:#666; }

    /* ─── Top-5 Cards ────────────────────────────────────────────── */
    .top-five-item { display:flex; align-items:center; background:#f9f9f9; padding:15px; border-radius:8px; margin-bottom:15px; border-left:4px solid #f0b429; }
    .top-five-num { background:#f0b429; color:#2c2c2c; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; margin-right:15px; flex-shrink:0; }
    .top-five-content { flex-grow:1; }
    .top-five-title { font-weight:700; color:#1a4a52; display:block; }
    .top-five-detail { font-size:.85rem; color:#555; }

    /* ─── WiFi Boxes ─────────────────────────────────────────────── */
    .wifi-container { display:flex; gap:20px; margin-bottom:30px; }
    .wifi-box { flex:1; background:#1a4a52; color:#fff; padding:20px; border-radius:8px; }
    .wifi-box h3 { font-family:'Montserrat',sans-serif; font-size:.9rem; color:#f0b429; margin-bottom:10px; text-transform:uppercase; }
    .wifi-detail { font-size:.85rem; margin-bottom:4px; }
    .wifi-detail span { opacity:.7; }

    /* ─── Page Numbers ───────────────────────────────────────────── */
    .page-num { position:absolute; bottom:30px; right:48px; font-size:.7rem; color:#2e7b8c; font-weight:600; }

    /* ─── Dining Sections ────────────────────────────────────────── */
    .restaurant-card { border-bottom:1px solid #f0f0f0; padding:10px 0; }
    .restaurant-card:last-child { border-bottom:none; }
    .restaurant-card strong { color:#1a4a52; font-size:.95rem; }
    .restaurant-card .tag { display:inline-block; background:#ebf5f7; color:#2e7b8c; font-size:.65rem; font-weight:600; padding:2px 8px; border-radius:10px; margin-left:8px; text-transform:uppercase; }
    .restaurant-card p { font-size:.82rem; color:#555; margin-top:2px; }

    /* ─── Concierge Tip Box ──────────────────────────────────────── */
    .tip-box {
      background: linear-gradient(135deg, #f0f9fb 0%, #e8f5f7 100%);
      border-left: 4px solid #f0b429;
      border-radius: 0 8px 8px 0;
      padding: 14px 18px;
      font-size: .82rem;
      color: #2c2c2c;
      line-height: 1.6;
      margin-top: auto;
    }
    .tip-box strong { color: #1a4a52; }

    /* ─── UTV Vehicle Cards ──────────────────────────────────────── */
    .utv-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin:20px 0; }
    .utv-card { background:#f8f8f8; border:1px solid #e0e0e0; border-radius:12px; overflow:hidden; padding:0; text-align:center; }
    .utv-card img { width:100%; height:200px; object-fit:cover; object-position:center center; display:block; }
    .utv-card-info { padding:14px 16px 16px; }
    .utv-card-name { font-family:'Montserrat',sans-serif; font-weight:700; color:#1a4a52; font-size:.95rem; text-transform:uppercase; letter-spacing:.05em; margin:12px 0 4px; }
    .utv-card-seats { font-size:.78rem; color:#2e7b8c; font-weight:600; margin-bottom:8px; }
    .utv-card-price { font-size:1.3rem; font-weight:700; color:#f0b429; }
    .utv-card-price span { font-size:.72rem; color:#888; font-weight:400; display:block; margin-top:2px; }

    /* ─── Emergency Page ─────────────────────────────────────────── */
    .emergency-card { background:#fff8f8; border:1px solid #e88; border-radius:8px; padding:16px 20px; margin-bottom:12px; }
    .emergency-card h4 { color:#c0392b; font-family:'Montserrat',sans-serif; font-size:.9rem; margin-bottom:6px; text-transform:uppercase; }
    .emergency-card p { font-size:.85rem; color:#333; }
    .emergency-card .number { font-size:1.1rem; font-weight:700; color:#c0392b; }

    /* ─── Print ──────────────────────────────────────────────────── */
    @page {
      size: A4 portrait;
      margin: 0;
    }

    @media print {
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: none !important;
        width: 210mm;
      }

      /* Each .page = exactly one printed A4 page */
      .page {
        box-shadow: none !important;
        margin: 0 !important;
        padding: 18mm 16mm !important;
        width: 210mm !important;
        height: 297mm !important;
        min-height: unset !important;
        max-height: 297mm !important;
        overflow: hidden !important;
        page-break-before: always !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
        break-before: page !important;
        break-after: avoid !important;
        break-inside: avoid !important;
        display: flex !important;
        flex-direction: column !important;
        border-radius: 0 !important;
        position: relative !important;
      }

      /* Remove page-break-before from the very first page to avoid a leading blank page */
      .page:first-of-type {
        page-break-before: auto !important;
        break-before: auto !important;
      }

      /* Scale down hero images so they don't blow out the page */
      .hero-image {
        height: 130px !important;
        max-height: 130px !important;
        width: 100% !important;
        object-fit: cover !important;
        margin: 8px 0 !important;
      }

      .hero-image.tall {
        height: 130px !important;
        max-height: 130px !important;
      }

      /* Square images – tighten up */
      .square-image {
        height: 150px !important;
        max-height: 150px !important;
      }

      /* Reduce gaps so content fits within 297mm */
      .image-row { gap: 10px !important; margin-bottom: 8px !important; }
      .square-image-container { width: calc(50% - 5px) !important; }

      /* Section header */
      .section-header {
        padding: 8px 14px !important;
        margin-bottom: 10px !important;
        font-size: 1.1rem !important;
      }

      /* Paragraphs */
      p.description { margin-bottom: 8px !important; font-size: .8rem !important; }

      /* Inclusions list */
      .inclusions-list { margin: 8px 0 !important; gap: 4px 12px !important; }
      .inclusions-list li { font-size: .75rem !important; }

      /* Top-five items */
      .top-five-item { padding: 10px !important; margin-bottom: 8px !important; }
      .top-five-detail { font-size: .78rem !important; }

      /* Grid lists */
      .grid-list { gap: 10px !important; }
      .grid-item { margin-bottom: 6px !important; }
      .grid-item span { font-size: .72rem !important; }

      /* Restaurant cards */
      .restaurant-card { padding: 6px 0 !important; }
      .restaurant-card p { font-size: .75rem !important; }

      /* WiFi boxes */
      .wifi-container { gap: 12px !important; margin-bottom: 16px !important; }
      .wifi-box { padding: 14px !important; }
      .wifi-detail { font-size: .78rem !important; }

      /* CTA bar */
      .cta-bar { padding: 8px 14px !important; font-size: .8rem !important; margin-top: auto !important; }

      /* Page number */
      .page-num { bottom: 14px !important; right: 16mm !important; }

      /* Emergency cards */
      .emergency-card { padding: 10px 14px !important; margin-bottom: 8px !important; }
      .emergency-card p { font-size: .78rem !important; }
      .emergency-card .number { font-size: .95rem !important; }

      /* Pricing table */
      .pricing-table th, .pricing-table td { padding: 8px !important; font-size: .8rem !important; }

      /* Tip box */
      .tip-box { padding: 8px 12px !important; font-size: .72rem !important; margin-top: auto !important; border-left-width: 3px !important; }

      /* Hide print button */
      #print-btn { display: none !important; }

      /* Cover: keep centered content */
      .page.cover { justify-content: center !important; align-items: center !important; }
      .cover-title { font-size: 2.8rem !important; }
    }

    /* Print button */
    #print-btn {
      display: none;
      position: fixed;
      bottom: 32px;
      right: 32px;
      background: #1a4a52;
      color: #f0b429;
      border: 2px solid #f0b429;
      border-radius: 50px;
      padding: 14px 28px;
      font-family: 'Montserrat', sans-serif;
      font-size: .85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .1em;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,.3);
      z-index: 9999;
      transition: all .2s ease;
    }
    #print-btn:hover { background:#f0b429; color:#1a4a52; transform:scale(1.05); }
    #print-btn.visible { display:block; animation: fadeIn .3s ease; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  `;

const ConciergeGuide = () => {
  useEffect(() => {
    document.title = "Villas Sempre Avanti — Private Concierge Guide";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex,nofollow";
    document.head.appendChild(robots);
    return () => {
      robots.remove();
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div dangerouslySetInnerHTML={{ __html: HTML }} />
    </>
  );
};

export default ConciergeGuide;
