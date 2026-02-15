import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";

import { motion } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import sayulitaTown from "@/assets/cultural-sayulita-town.jpeg";
import patzcuaritoHero from "@/assets/patzcuarito-hero.png";
import transportImg from "@/assets/transport.png";
import landAtvImg from "@/assets/land-atv.jpg";

const nearbyPlaces = [
  { name: "Sayulita", distance: "5 min by UTV", description: "A vibrant surf town with boutiques, restaurants, and a lively beach scene." },
  { name: "San Pancho", distance: "15 min via Sayulita", description: "A quieter, artistic village with a cultural center and beautiful beach." },
  { name: "Punta de Mita", distance: "25 min by UTV", description: "An upscale beach community with world-class dining, surf breaks, and the Four Seasons & St. Regis resorts." },
  { name: "La Cruz de Huanacaxtle", distance: "30 min by car", description: "Home to the famous Sunday Market — fresh seafood, artisan crafts, live music." },
  { name: "Puerto Vallarta", distance: "45 min by car", description: "The Malecón boardwalk, art galleries, fine dining, and vibrant nightlife." },
  { name: "Chacala", distance: "45 min by car", description: "A hidden gem — serene beach town with no crowds. Perfect for a peaceful day trip." },
];

const diningByArea = [
  {
    area: "Sayulita",
    restaurants: [
      "Don Pedro's — iconic beachfront, watch surfers while you eat",
      "Café Sayulita — breakfast and brunch favorite",
      "Xochi — elevated Mexican cuisine",
      "Purillo — fresh Italian-Mexican fusion",
      "Naty's Kitchen — authentic homestyle cooking",
      "Los Corazones — romantic rooftop dining",
      "Esperanza — local favorite for seafood",
      "Choco Banana — smoothie bowls and health food",
      "Paninos — great sandwiches and coffee",
      "El Break — casual beachside eats",
      "Captain Pablo — right on the surf break",
      "El Costeño — traditional Mexican street food",
      "Falafel and Friends — Mediterranean flavors",
      "La Terrazola — sunset views and cocktails",
      "Tacos Ivan — the best tacos in town (ask anyone)",
      "Aaleya's — creative international menu",
      "Sayulita Public House — craft cocktails",
      "Escondido Wine Bar — curated wines",
      "Hotel Hafa Wine Bar — boutique hotel bar with views",
    ],
  },
  {
    area: "San Pancho",
    restaurants: [
      "Café del Mar — oceanfront dining with fresh catches",
      "Mar Plata — Argentine-style seafood",
      "La Perla — local gem with traditional flavors",
      "La Ola Rica — organic and creative cuisine",
    ],
  },
  {
    area: "El Anclote & Punta Mita",
    restaurants: [
      "Si Señor — traditional Mexican with a view",
      "Si Sushi — surprisingly excellent Japanese",
      "Blue Shrimp — seafood on the beach",
      "Tuna Blanca — upscale fine dining",
      "Casa Teresa — homestyle Mexican",
      "Rosa Mexicana — colorful and flavorful",
      "La Serenata BBQ — grilled specialties",
      "El Coral — fresh catches right off the boats",
      "Tino's — casual beachfront",
      "El Dorado — romantic sunset spot",
      "NAEF Cuisine — modern gastronomy",
    ],
  },
  {
    area: "Four Seasons & St. Regis",
    restaurants: [
      "Aramara — Asian-Pacific fine dining at Four Seasons",
      "Bahía — beachfront seafood at Four Seasons",
      "Ketsi — Mexican cuisine at Four Seasons",
      "Carolina — Mediterranean at St. Regis",
      "Sea Breeze — casual oceanfront at St. Regis",
      "Las Marietta's — Mexican grill at St. Regis",
    ],
  },
];

const shopping = [
  "Pachamama — bohemian clothing and accessories",
  "Artefacto — handcrafted art and home goods",
  "Galleria Hamaca — local artists and hammocks",
  "Gypsy Galleria — eclectic jewelry and gifts",
  "Espuma do Mar — beachwear and surf style",
  "Revolution del Sueño — artisan crafts and dreamcatchers",
  "Ula — boutique resort wear",
  "Debbie Cuevas — designer jewelry",
  "La Selecta — premium tequila and mezcal tastings",
  "Terrenal — organic grocery and health products",
];

const nightlife = [
  "Monday — Salsa night at Don Pedro's. Live band, dancing on the beach.",
  "Thursday — Cumbia night. The whole town comes alive.",
  "Bar Don Pato — late-night cocktails and live music",
  "Sayulita Public House — craft cocktails in a speakeasy setting",
];

function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full flex items-center justify-between py-4 border-b border-border group cursor-pointer">
        <h3 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors">{title}</h3>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 pb-8">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function Location() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60dvh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img src={patzcuaritoHero} alt="Aerial view of Patzcuarito coastline" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Patzcuarito, Riviera Nayarit</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light">Secluded, Yet Connected</h1>
        </div>
      </section>

      {/* Getting Here */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container max-w-5xl">
          <SectionHeading
            eyebrow="Seamless Arrival"
            title="Getting Here & Around"
            description="Your journey begins the moment you land at Puerto Vallarta International Airport (PVR). Private luxury Suburban transfers bring you directly to the estate — approximately 45 minutes door-to-door."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-background p-8 rounded-xl border border-border"
            >
              <img src={transportImg} alt="Private Suburban Transfer" className="w-full aspect-video object-cover rounded-xl mb-6" />
              <h3 className="font-serif text-2xl mb-3">Private Airport Transfers</h3>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed mb-3">
                Luxury Suburban vehicles with professional drivers. We'll track your flight and be there when you land — no waiting, no hassle. Seats up to 7 people.
              </p>
              <p className="text-sm font-sans text-muted-foreground italic">~$250 USD round-trip</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-background p-8 rounded-xl border border-border"
            >
              <img src={landAtvImg} alt="Polaris UTV" className="w-full aspect-video object-cover rounded-xl mb-6" />
              <h3 className="font-serif text-2xl mb-3">Polaris UTV Rentals</h3>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed mb-3">
                The best way to explore the coast — zip to Sayulita in 5 minutes, Punta de Mita in 25. Available in 2, 4, and 6-seater options.
              </p>
              <p className="text-sm font-sans text-muted-foreground italic">Pricing provided upon inquiry</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Patzcuarito"
            title="The Best of Both Worlds"
          />
          <div className="max-w-3xl mx-auto space-y-5 text-base font-sans text-muted-foreground leading-relaxed">
            <p>
              Sempre Avanti sits in Patzcuarito — a private, gated beachfront community along the coast road between Sayulita and Punta de Mita. It's a world apart: a secluded stretch of Pacific coastline with no crowds, no noise, and no neighbors in sight.
            </p>
            <p>
              Yet everything the Riviera Nayarit has to offer is minutes away. Jump in a Polaris UTV and you're in Sayulita in 5 minutes — its surf breaks, tacos, boutiques, and nightlife all at your doorstep. Punta de Mita, with the Four Seasons and St. Regis, is a 25-minute drive south. The famous La Cruz Sunday Market is 30 minutes away.
            </p>
            <p>
              This is what makes the location extraordinary: you wake up on a private beach with nothing but jungle and ocean around you, and by lunch you're eating fresh ceviche at Don Pedro's or teeing off at a Jack Nicklaus course. It's the feeling of being completely away — while never being far from anything.
            </p>
          </div>
        </div>
      </section>

      {/* Map — satellite, zoomed out */}
      <section className="pb-16">
        <div className="container max-w-4xl">
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28500!2d-105.48!3d20.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x84211561ab8a6c1b%3A0xe20445bb3abc738a!2sCasa%20Sempre%20Avanti!5e1!3m2!1sen!2smx!4v1700000000000!5m2!1sen!2smx"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Villas Sempre Avanti — between Sayulita and Punta de Mita"
              className="w-full h-full"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3 font-sans">
            Patzcuarito sits on the coast road between Sayulita and Punta de Mita
          </p>
        </div>
      </section>

      {/* Travel Times */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container max-w-5xl">
          <SectionHeading eyebrow="Your Doorstep" title="Minutes from Everything" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {nearbyPlaces.map((place, i) => (
              <motion.div
                key={place.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-background p-5 border border-border rounded-xl text-center"
              >
                <h3 className="font-serif text-lg mb-1">{place.name}</h3>
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-sans text-accent uppercase tracking-widest">{place.distance}</span>
                </div>
                <p className="text-xs font-sans text-muted-foreground leading-relaxed">{place.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dining Guide */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <SectionHeading eyebrow="When You Venture Out" title="The Local Dining Guide" description="Our personal recommendations, organized by area. Every restaurant has been visited and approved by the Sempre Avanti team." />
          <div className="space-y-2">
            {diningByArea.map((area) => (
              <CollapsibleSection key={area.area} title={area.area}>
                <ul className="space-y-2 pl-4">
                  {area.restaurants.map((r) => (
                    <li key={r} className="text-sm font-sans text-muted-foreground flex items-start gap-2">
                      <span className="text-accent mt-1">·</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            ))}
          </div>
        </div>
      </section>

      {/* Shopping */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container max-w-4xl">
          <SectionHeading eyebrow="Sayulita" title="Shopping & Boutiques" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            {shopping.map((item) => (
              <div key={item} className="text-sm font-sans text-muted-foreground flex items-start gap-2 py-1">
                <span className="text-accent mt-1">·</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Markets */}
      <section className="py-16 md:py-24">
        <div className="container max-w-5xl">
          <SectionHeading eyebrow="Don't Miss" title="Local Markets" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-xl">
              <h3 className="font-serif text-2xl mb-2">La Cruz Sunday Market</h3>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                The region's premier market. Fresh seafood, artisan crafts, live music, handmade jewelry, and the best tamales you've ever had. Arrive early for the best selection. 30 minutes from the house.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl">
              <h3 className="font-serif text-2xl mb-2">Sayulita Friday Market</h3>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                Organic produce, local treats, artisan goods, and live music in the heart of Sayulita's plaza. A more intimate, locals-focused market. 5 minutes by UTV.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nightlife */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container max-w-4xl">
          <SectionHeading eyebrow="After Dark" title="Nightlife & Music" />
          <ul className="space-y-4 max-w-2xl mx-auto">
            {nightlife.map((item) => (
              <li key={item} className="text-sm font-sans text-muted-foreground flex items-start gap-3">
                <span className="text-accent mt-0.5">♪</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Safety */}
      <section className="relative py-16 md:py-24 text-primary-foreground overflow-hidden">
        <img src={sayulitaTown} alt="Sayulita town" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 container max-w-3xl text-center">
          <SectionHeading
            eyebrow="Safety & Community"
            title="A Place That Feels Like Home"
            description="The Riviera Nayarit is one of Mexico's safest regions. Patzcuarito is a private, gated community with 24/7 security. Sayulita is a tight-knit town where families, artists, and travelers coexist beautifully. Our team is local — they know the land, the people, and the rhythms of this coast."
            light
          />
        </div>
      </section>
    </Layout>
  );
}
