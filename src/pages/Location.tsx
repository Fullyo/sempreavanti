import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { motion } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const nearbyPlaces = [
  { name: "Sayulita", distance: "5 min by UTV", description: "A vibrant surf town with boutiques, restaurants, and a lively beach scene." },
  { name: "San Pancho", distance: "8 min by UTV", description: "A quieter, artistic village with a cultural center and beautiful beach." },
  { name: "Punta de Mita", distance: "20–25 min", description: "An upscale beach community with world-class dining and surf breaks." },
  { name: "La Cruz de Huanacaxtle", distance: "25–30 min", description: "Home to the famous Sunday Market — fresh seafood, artisan crafts, live music." },
  { name: "Puerto Vallarta", distance: "45 min", description: "The Malecón boardwalk, art galleries, fine dining, and vibrant nightlife." },
  { name: "Chacala", distance: "45 min", description: "A hidden gem — serene beach town with no crowds. Perfect for a peaceful day trip." },
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
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <PhotoPlaceholder label="Riviera Nayarit" className="absolute inset-0 !aspect-auto opacity-30" />
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Riviera Nayarit</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light">Location</h1>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Just Outside Sayulita"
            title="The Best of Both Worlds"
            description="Sempre Avanti sits on a private stretch of beach between Sayulita and San Pancho on Mexico's Riviera Nayarit coast. Private and secluded, yet minutes from everything — connected by the 4×4 Polaris UTVs available at the house."
          />
        </div>
      </section>

      {/* Google Map */}
      <section className="pb-16">
        <div className="container max-w-5xl">
          <div className="w-full aspect-video rounded-2xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2896!2d-105.4640904!3d20.847732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x84211561ab8a6c1b%3A0xe20445bb3abc738a!2sCasa%20Sempre%20Avanti!5e0!3m2!1sen!2smx!4v1700000000000!5m2!1sen!2smx"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Casa Sempre Avanti location"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Nearby Places */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container max-w-5xl">
          <SectionHeading eyebrow="Nearby" title="Explore the Region" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyPlaces.map((place, i) => (
              <motion.div
                key={place.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-background p-6 border border-border rounded-xl"
              >
                <PhotoPlaceholder label={place.name} aspectRatio="video" className="mb-4" />
                <h3 className="font-serif text-xl mb-1">{place.name}</h3>
                <span className="text-xs font-sans text-accent uppercase tracking-widest block mb-2">{place.distance}</span>
                <p className="text-sm font-sans text-muted-foreground leading-relaxed">{place.description}</p>
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
              <PhotoPlaceholder label="La Cruz Sunday Market" aspectRatio="video" className="mb-4 rounded-xl overflow-hidden" />
              <h3 className="font-serif text-2xl mb-2">La Cruz Sunday Market</h3>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                The region's premier market. Fresh seafood, artisan crafts, live music, handmade jewelry, and the best tamales you've ever had. Arrive early for the best selection. 25–30 minutes from the house.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl">
              <PhotoPlaceholder label="Sayulita Friday Market" aspectRatio="video" className="mb-4 rounded-xl overflow-hidden" />
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
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container max-w-3xl text-center">
          <SectionHeading
            eyebrow="Safety & Community"
            title="A Place That Feels Like Home"
            description="The Riviera Nayarit is one of Mexico's safest regions. Sayulita is a tight-knit community where families, artists, and travelers coexist beautifully. Our team is local — they know the land, the people, and the rhythms of this coast."
            light
          />
        </div>
      </section>
    </Layout>
  );
}
