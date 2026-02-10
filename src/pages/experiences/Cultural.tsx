import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import PageNavArrows, { experiencePages, getPageNav } from "@/components/PageNavArrows";
import { motion } from "framer-motion";
import InquiryDialog from "@/components/InquiryDialog";

import estate12 from "@/assets/estate-12.jpeg";

const { prev, next } = getPageNav(experiencePages, "/experiences/cultural");

const experiences = [
  { name: "La Cruz Sunday Market", desc: "The region's premier open-air market. Fresh seafood, tropical fruits, artisan crafts, live music, and waterfront dining. Every Sunday morning at the La Cruz marina — 30 minutes from the estate." },
  { name: "Sayulita Friday Market", desc: "Organic produce, local treats, artisan goods, and live music in the heart of Sayulita. A smaller, more intimate market just 5 minutes away by UTV." },
  { name: "Puerto Vallarta Malecón", desc: "The iconic seaside boardwalk stretching a mile along the bay. World-class public art installations, galleries, restaurants, and vibrant nightlife. 45 minutes from the estate." },
  { name: "Tequila & Mezcal Tastings", desc: "Curated tastings at La Selecta in Sayulita — learn the difference between blanco, reposado, and añejo from experts. Private group sessions available at the estate." },
  { name: "San Pancho Cultural Center", desc: "A community-driven arts center in San Pancho (15 minutes away) featuring rotating exhibitions, workshops, live performances, and a vibrant circus arts program." },
  { name: "Huichol Art Gallery", desc: "Traditional Wixárika (Huichol) indigenous art — intricate beadwork and yarn paintings depicting spiritual visions. Available in Sayulita galleries and at the La Cruz market." },
];

const diningHighlights = [
  { name: "Don Pedro's", desc: "Beachfront fine dining in Sayulita. Fresh seafood, Mexican-international fusion, and live music with your feet in the sand." },
  { name: "Si Señor", desc: "Upscale Mexican cuisine in the heart of Sayulita. Rooftop dining with sunset views." },
  { name: "La Cruz Fish Market", desc: "Ultra-fresh seafood prepared to order at the marina. A local favorite for ceviche, whole grilled fish, and cold beers." },
  { name: "Sayulita Town", desc: "Dozens of restaurants, taco stands, and beach bars within 5 minutes of the estate — your concierge knows every hidden gem." },
];

export default function Cultural() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <PhotoPlaceholder label="Cultural & Local" className="absolute inset-0 !aspect-auto opacity-30" />
        <div className="relative z-10 text-center text-primary-foreground px-4 w-full max-w-6xl mx-auto">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Experiences</p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1"><PageNavArrows prev={prev} next={undefined} variant="hero" /></div>
            <h1 className="font-serif text-5xl md:text-7xl font-light whitespace-nowrap">Cultural & Local</h1>
            <div className="flex-1"><PageNavArrows prev={undefined} next={next} variant="hero" /></div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Discover"
            title="Markets, Art & the Soul of the Riviera"
            description="The Riviera Nayarit is more than beaches — it's a tapestry of indigenous art, vibrant markets, world-class dining, and coastal towns that each carry their own character. Sayulita is 5 minutes by UTV. San Pancho, La Cruz, and Puerto Vallarta are all within easy reach."
          />
        </div>
      </section>

      {/* Cultural Experiences */}
      <section className="pb-20 md:pb-28">
        <div className="container max-w-6xl">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent">Markets & Culture</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-card rounded-xl overflow-hidden border border-border"
              >
                <PhotoPlaceholder label={item.name} aspectRatio="video" />
                <div className="p-5">
                  <h3 className="font-serif text-xl mb-1">{item.name}</h3>
                  <p className="text-sm font-sans text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dining */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container max-w-6xl">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent">Local Dining</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <p className="text-base font-sans text-muted-foreground leading-relaxed max-w-3xl mb-8">
            While Ricardo prepares incredible meals at the estate, the surrounding towns offer dining experiences worth exploring. Your concierge makes reservations and arranges transport.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diningHighlights.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-background rounded-xl overflow-hidden border border-border"
              >
                <PhotoPlaceholder label={item.name} aspectRatio="video" />
                <div className="p-5">
                  <h3 className="font-serif text-xl mb-1">{item.name}</h3>
                  <p className="text-sm font-sans text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 md:py-28 text-primary-foreground overflow-hidden">
        <img src={estate12} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 container max-w-4xl text-center">
          <SectionHeading
            eyebrow="Your Concierge"
            title="Reservations, Transport & Local Tips"
            description="Your concierge knows every market day, every hidden restaurant, and every gallery worth visiting. Just ask — they'll plan the perfect day out."
            light
          />
          <InquiryDialog>
            <button className="inline-block mt-6 px-10 py-4 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors rounded-full">
              Ask Your Concierge
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
