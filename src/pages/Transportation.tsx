import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";

const driveTimes = [
  { destination: "Puerto Vallarta Airport (PVR)", time: "~45 min", note: "Private Suburban transfer" },
  { destination: "Sayulita town center", time: "~10 min", note: "By UTV — the fun way" },
  { destination: "Punta de Mita", time: "~15 min", note: "By UTV or car" },
  { destination: "San Pancho", time: "~15 min", note: "By UTV" },
  { destination: "La Cruz de Huanacaxtle", time: "~20 min", note: "Sunday Market" },
];

export default function Transportation() {
  return (
    <Layout>
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <PhotoPlaceholder label="Arrival" className="absolute inset-0 !aspect-auto opacity-30" />
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Getting Here & Around</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light">Transportation</h1>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Seamless Arrival"
            title="From the Airport to the Beach"
            description="Your journey begins the moment you land at Puerto Vallarta International Airport (PVR). Private luxury Suburban transfers bring you directly to the estate — comfortable, air-conditioned, and stress-free. Approximately 45 minutes door-to-door."
          />
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-card p-8"
            >
              <PhotoPlaceholder label="Private Suburban Transfer" aspectRatio="video" className="mb-6" />
              <h3 className="font-serif text-2xl mb-3">Private Airport Transfers</h3>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed mb-3">
                Luxury Suburban vehicles with professional drivers. Arranged through your concierge prior to arrival. We'll track your flight and be there when you land — no waiting, no hassle. Seats up to 7 people.
              </p>
              <p className="text-sm font-sans font-medium text-accent">$5,000 MXN round trip</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-card p-8"
            >
              <PhotoPlaceholder label="Polaris UTV" aspectRatio="video" className="mb-6" />
              <h3 className="font-serif text-2xl mb-3">Polaris UTV Rentals</h3>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed mb-4">
                Polaris UTVs are available at the property for guest use. They're the best way to get around — zip to Sayulita in 10 minutes, Punta de Mita in 15. The 4×4 carritos remove any sense of isolation and make exploring the coast effortless and fun.
              </p>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed mb-4">
                Wind in your hair, ocean on your left, jungle on your right — it's part of the Sempre Avanti experience.
              </p>
              <div className="space-y-1 mb-3">
                <p className="text-sm font-sans font-medium text-accent">2-Seater — $1,600 MXN / day</p>
                <p className="text-sm font-sans font-medium text-accent">4-Seater — $1,900 MXN / day</p>
                <p className="text-sm font-sans font-medium text-accent">6-Seater — $2,200 MXN / day</p>
              </div>
              <p className="text-xs font-sans text-muted-foreground">Range: Punta de Mita (south) to San Pancho (north)</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Drive Times */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container max-w-3xl">
          <SectionHeading eyebrow="Distances" title="Drive Times from the Estate" />
          <div className="space-y-4">
            {driveTimes.map((dt, i) => (
              <motion.div
                key={dt.destination}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-accent flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <span className="text-sm font-sans font-medium text-foreground">{dt.destination}</span>
                    <span className="text-xs font-sans text-muted-foreground block">{dt.note}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
                  <span className="text-sm font-sans text-accent font-medium">{dt.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container max-w-3xl">
          <SectionHeading
            eyebrow="Arrange Your Transfer"
            title="We Handle Everything"
            description="Airport pickups, drop-offs, and UTV availability are all coordinated by your concierge Eno before you arrive. Just send us your flight details."
            light
          />
          <Link
            to="/contact"
            className="inline-block mt-6 px-10 py-4 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors"
          >
            Arrange Transportation
          </Link>
        </div>
      </section>
    </Layout>
  );
}
