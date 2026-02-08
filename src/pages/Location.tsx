import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";

const nearbyPlaces = [
  { name: "Sayulita", distance: "10 min by UTV", description: "A vibrant surf town with boutiques, restaurants, and a lively beach scene. Sayulita's Friday Farmers Market is a local gem." },
  { name: "Punta de Mita", distance: "15 min", description: "An upscale beach community with world-class dining, surf breaks, and the gateway to the Marietas Islands." },
  { name: "San Pancho", distance: "15 min", description: "A quieter, artistic village with a cultural center, beautiful beach, and local organic restaurants." },
  { name: "La Cruz de Huanacaxtle", distance: "20 min", description: "Home to the famous Sunday Market — the region's best for fresh seafood, artisan crafts, and live music." },
  { name: "Puerto Vallarta", distance: "45 min", description: "The Malecón boardwalk, art galleries, fine dining, and vibrant nightlife along the Bay of Banderas." },
];

const diningRecs = [
  "Don Pedro's — Sayulita's iconic beachfront restaurant",
  "Café Sayulita — breakfast and brunch favorite",
  "El Itacate — authentic Mexican street food elevated",
  "Tuna Blanca — Punta de Mita fine dining",
  "Si Señor — traditional Mexican cuisine with a view",
];

export default function Location() {
  return (
    <Layout>
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-primary">
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

      {/* Map placeholder */}
      <section className="pb-16">
        <div className="container max-w-5xl">
          <div className="bg-muted h-96 flex items-center justify-center">
            <span className="text-muted-foreground font-sans text-sm">Interactive map placeholder — showing Sempre Avanti, Sayulita, Punta de Mita, San Pancho, La Cruz, Puerto Vallarta</span>
          </div>
        </div>
      </section>

      {/* Nearby */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container max-w-5xl">
          <SectionHeading eyebrow="Nearby" title="Explore the Region" />
          <div className="space-y-8">
            {nearbyPlaces.map((place, i) => (
              <motion.div
                key={place.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col md:flex-row gap-4 md:gap-8 pb-8 border-b border-border last:border-b-0"
              >
                <div className="md:w-48 flex-shrink-0">
                  <h3 className="font-serif text-2xl">{place.name}</h3>
                  <span className="text-xs font-sans text-accent uppercase tracking-widest">{place.distance}</span>
                </div>
                <p className="text-sm font-sans text-muted-foreground leading-relaxed">{place.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dining */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <SectionHeading eyebrow="When You Venture Out" title="Local Dining We Love" />
          <ul className="space-y-3 max-w-2xl mx-auto">
            {diningRecs.map((rec) => (
              <li key={rec} className="text-sm font-sans text-muted-foreground flex items-start gap-3">
                <span className="text-accent mt-0.5">·</span>
                {rec}
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
