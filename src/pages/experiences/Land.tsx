import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import atvImg from "@/assets/atv.jpeg";
import ziplineImg from "@/assets/zipline.jpg";
import horsebackImg from "@/assets/horseback.jpg";

const activities = [
  { name: "Zipline & Canopy Tours", desc: "Soar above the jungle canopy on world-class ziplines with panoramic views of the Sierra Madre and the Pacific coastline. Multiple courses available from beginner-friendly to adrenaline-pumping." },
  { name: "ATV & RZR Tours", desc: "Guided off-road adventures through the mountains and along the coast. Half-day and full-day options available — all vehicles, helmets, and guides included." },
  { name: "Horseback Riding", desc: "Trail rides through the jungle and along the beach at sunset. Experienced horses suited for all riding levels, from first-timers to experienced equestrians." },
  { name: "Jungle & Monkey Mountain Hikes", desc: "Guided hikes through tropical jungle with wildlife encounters — spider monkeys, tropical birds, and stunning viewpoints over Banderas Bay." },
  { name: "Polaris UTV Rentals", desc: "Two Polaris UTVs are available at the property in 2, 4, and 6-seater configurations. Perfect for exploring the coast between Punta de Mita and San Pancho at your own pace." },
  { name: "Bird Watching Tours", desc: "Early-morning guided tours spotting tropical species in the Sierra Madre foothills. The region hosts over 350 bird species including trogons, parrots, and the rare military macaw." },
];

export default function Land() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img src={atvImg} alt="ATV adventure in the mountains" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Experiences</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light">Land & Adventure</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Explore"
            title="Jungle, Mountains & Coastline"
            description="Beyond the beach, the Sierra Madre mountains rise into tropical jungle — home to ziplines, off-road trails, horseback rides, and wildlife encounters. Your concierge arranges everything through our trusted tour partner, Michula Tours."
          />
        </div>
      </section>

      {/* Activities */}
      <section className="pb-20 md:pb-28">
        <div className="container max-w-6xl">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent">Adventures</span>
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

      {/* Photo Gallery */}
      <section className="py-4">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { src: ziplineImg, alt: "Zipline over the jungle" },
              { src: atvImg, alt: "ATV adventure" },
              { src: horsebackImg, alt: "Horseback riding on the beach" },
            ].map((img) => (
              <div key={img.alt} className="aspect-video overflow-hidden rounded">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container max-w-4xl text-center">
          <SectionHeading
            eyebrow="Your Concierge"
            title="Trails, Rides & Adventures — All Arranged"
            description="From sunrise hikes to sunset horseback rides, your concierge coordinates every detail with Michula Tours. All pricing provided upon inquiry."
            light
          />
          <Link
            to="/contact"
            className="inline-block mt-6 px-10 py-4 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors rounded-full"
          >
            Plan Your Adventure
          </Link>
        </div>
      </section>
    </Layout>
  );
}
