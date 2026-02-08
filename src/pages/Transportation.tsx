import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Transportation() {
  return (
    <Layout>
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-primary">
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
            description="Your journey begins the moment you land at Puerto Vallarta International Airport (PVR). Private luxury Suburban transfers bring you directly to the estate — comfortable, air-conditioned, and stress-free."
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
              <div className="h-48 bg-muted mb-6 flex items-center justify-center">
                <span className="text-xs font-sans text-muted-foreground">Suburban photo placeholder</span>
              </div>
              <h3 className="font-serif text-2xl mb-3">Private Airport Transfers</h3>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                Luxury Suburban vehicles with professional drivers. Approximately 45 minutes from PVR airport to Sempre Avanti. Arranged through your concierge prior to arrival.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-card p-8"
            >
              <div className="h-48 bg-muted mb-6 flex items-center justify-center">
                <span className="text-xs font-sans text-muted-foreground">Polaris UTV photo placeholder</span>
              </div>
              <h3 className="font-serif text-2xl mb-3">Polaris UTV Rentals</h3>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                Two Polaris UTVs are available at the property for guest use. They're the best way to get around — zip to Sayulita in 10 minutes, Punta de Mita in 15. The 4×4 carritos remove any sense of isolation and connect you to everything.
              </p>
            </motion.div>
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
