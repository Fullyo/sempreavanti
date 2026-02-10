import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import marietasImg from "@/assets/marietas-islands.jpeg";
import whaleImg from "@/assets/whale.jpeg";

const activities = [
  { name: "Snorkeling — Playa de los Muertos", desc: "Just 10 minutes from the estate. Calm, crystal-clear water with vibrant marine life — perfect for kids and first-time snorkelers." },
  { name: "Marietas Islands", desc: "A UNESCO-protected national park in Banderas Bay. Snorkeling among tropical fish, the famous Hidden Beach, and seasonal whale watching. Limited daily permits — your concierge secures access." },
  { name: "Scuba Diving", desc: "PADI-certified instructors for beginners through advanced certifications. Dive sites around the Marietas Islands and along the bay's volcanic formations." },
  { name: "Kite Surfing", desc: "Available in Punta Mita where consistent thermal winds create ideal conditions. Equipment and instruction provided for all levels." },
  { name: "Paddleboard Tours", desc: "Stand-up paddleboard excursions along the coast. Morning sessions offer the calmest water and best wildlife spotting — sea turtles, rays, and tropical fish." },
  { name: "Whale Watching", desc: "Humpback whales migrate to Banderas Bay from December through March. Private boat tours for intimate encounters with these magnificent creatures." },
];

export default function Ocean() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img src={marietasImg} alt="Marietas Islands" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Experiences</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light">Dive In</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Ocean & Water"
            title="A Bay Teeming with Life"
            description="Banderas Bay is one of the largest natural bays in the world — home to humpback whales, manta rays, sea turtles, and the UNESCO-protected Marietas Islands. From snorkeling in calm coves to paddleboarding at sunrise, the Pacific is your playground."
          />
        </div>
      </section>

      {/* Marietas Featured */}
      <section className="pb-20 md:pb-28">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            <div className="overflow-hidden rounded-xl">
              <img src={marietasImg} alt="Marietas Islands" className="w-full h-full object-cover aspect-square" />
            </div>
            <div>
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent mb-2 block">Must-See</span>
              <h2 className="font-serif text-3xl md:text-4xl font-light mb-4">Marietas Islands</h2>
              <p className="text-base font-sans text-muted-foreground leading-relaxed mb-4">
                A protected national park just off the coast of Punta de Mita. The Marietas are famous for the Hidden Beach — a secluded stretch of sand inside a collapsed volcanic crater, accessible only by swimming through a short tunnel.
              </p>
              <p className="text-base font-sans text-muted-foreground leading-relaxed">
                Snorkeling here is world-class, with visibility often exceeding 30 feet. Daily permits are limited, so your concierge books in advance to guarantee your spot.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container max-w-6xl">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent">Water Activities</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {activities.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="border-b border-border pb-4"
              >
                <h3 className="font-serif text-xl mb-1">{item.name}</h3>
                <p className="text-sm font-sans text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-4">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="aspect-video overflow-hidden rounded">
              <img src={whaleImg} alt="Whale watching" className="w-full h-full object-cover" />
            </div>
            {["Snorkeling", "Paddleboard", "Scuba Diving"].map((label) => (
              <PhotoPlaceholder key={label} label={label} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container max-w-4xl text-center">
          <SectionHeading
            eyebrow="Your Concierge"
            title="Every Ocean Adventure, Arranged"
            description="Permits, gear, guides, and transport — your concierge handles every detail. Just pick the day. All pricing provided upon inquiry."
            light
          />
          <Link
            to="/contact"
            className="inline-block mt-6 px-10 py-4 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors rounded-full"
          >
            Plan Your Ocean Day
          </Link>
        </div>
      </section>
    </Layout>
  );
}
