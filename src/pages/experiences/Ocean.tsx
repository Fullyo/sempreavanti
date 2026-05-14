import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import SectionHeading from "@/components/ui/SectionHeading";
import PageNavArrows, { experiencePages, getPageNav } from "@/components/PageNavArrows";
import { motion } from "framer-motion";
import InquiryDialog from "@/components/InquiryDialog";

const { prev, next } = getPageNav(experiencePages, "/experiences/ocean");

import oceanMarietasImg from "@/assets/ocean-marietas.jpeg";
import oceanSnorkelingImg from "@/assets/ocean-snorkeling.jpg";
import oceanScubaImg from "@/assets/ocean-scuba.jpg";
import oceanKiteImg from "@/assets/ocean-kite.jpeg";
import oceanPaddleboardImg from "@/assets/ocean-paddleboard.jpeg";
import oceanWhaleImg from "@/assets/ocean-whale.jpeg";

const activities = [
  { name: "Snorkeling — Playa de los Muertos", desc: "Just 10 minutes from the estate. Calm, crystal-clear water with vibrant marine life — perfect for kids and first-time snorkelers.", img: oceanSnorkelingImg },
  { name: "Marietas Islands", desc: "A UNESCO-protected national park in Banderas Bay. Snorkeling among tropical fish, the famous Hidden Beach, and seasonal whale watching. Limited daily permits — your concierge secures access.", img: oceanMarietasImg },
  { name: "Scuba Diving", desc: "PADI-certified instructors for beginners through advanced certifications. Dive sites around the Marietas Islands and along the bay's volcanic formations.", img: oceanScubaImg },
  { name: "Kite Surfing", desc: "Available in Punta Mita where consistent thermal winds create ideal conditions. Equipment and instruction provided for all levels.", img: oceanKiteImg },
  { name: "Paddleboard Tours", desc: "Stand-up paddleboard excursions along the coast. Morning sessions offer the calmest water and best wildlife spotting — sea turtles, rays, and tropical fish.", img: oceanPaddleboardImg },
  { name: "Whale Watching", desc: "Humpback whales migrate to Banderas Bay from December through March. Private boat tours for intimate encounters with these magnificent creatures.", img: oceanWhaleImg },
];

export default function Ocean() {
  return (
    <Layout>
      <SEO title="Ocean Experiences | Sempre Avanti" description="Whale watching, snorkeling, and ocean adventures along the Riviera Nayarit coast." path="/experiences/ocean" />
      {/* Hero */}
      <section className="relative h-[60dvh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img src={oceanSnorkelingImg} alt="Snorkeling in crystal-clear water" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
        <div className="relative z-10 text-center text-primary-foreground px-4 w-full max-w-6xl mx-auto">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Experiences</p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1"><PageNavArrows prev={prev} next={undefined} variant="hero" /></div>
            <h1 className="font-serif text-5xl md:text-7xl font-light">Dive In</h1>
            <div className="flex-1"><PageNavArrows prev={undefined} next={next} variant="hero" /></div>
          </div>
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
              <img src={oceanMarietasImg} alt="Marietas Islands Hidden Beach" className="w-full h-full object-cover aspect-square" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-background rounded-xl overflow-hidden border border-border"
              >
                <div className="aspect-video overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl mb-1">{item.name}</h3>
                  <p className="text-sm font-sans text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-4">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { src: oceanWhaleImg, alt: "Whale watching" },
              { src: oceanSnorkelingImg, alt: "Snorkeling" },
              { src: oceanPaddleboardImg, alt: "Paddleboard" },
              { src: oceanScubaImg, alt: "Scuba Diving" },
            ].map((photo) => (
              <div key={photo.alt} className="aspect-video overflow-hidden rounded">
                <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 md:py-28 text-primary-foreground overflow-hidden">
        <img src={oceanWhaleImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 container max-w-4xl text-center">
          <SectionHeading
            eyebrow="Your Concierge"
            title="Every Ocean Adventure, Arranged"
            description="Permits, gear, guides, and transport — your concierge handles every detail. Just pick the day. All pricing provided upon inquiry."
            light
          />
          <InquiryDialog>
            <button className="inline-block mt-6 px-10 py-4 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors rounded-full">
              Plan Your Ocean Day
            </button>
          </InquiryDialog>
        </div>
        <div className="relative z-10 container max-w-4xl mt-10">
          <PageNavArrows prev={prev} next={next} variant="bottom" />
        </div>
      </section>
    </Layout>
  );
}
