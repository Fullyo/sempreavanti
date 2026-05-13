import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import SectionHeading from "@/components/ui/SectionHeading";
import PageNavArrows, { experiencePages, getPageNav } from "@/components/PageNavArrows";
import { motion } from "framer-motion";
import InquiryDialog from "@/components/InquiryDialog";

const { prev, next } = getPageNav(experiencePages, "/experiences/boats");

import fishingImg from "@/assets/fishing.jpg";
import whaleImg from "@/assets/whale.jpeg";
import boatFishingCharter from "@/assets/boat-fishing-charter.jpeg";
import boatSpearfishing from "@/assets/boat-spearfishing.jpg";
import boatShoreSpearfishing from "@/assets/boat-shorespearfishing.jpg";
import boatCat from "@/assets/boat-cat.jpeg";
import boatFatcat from "@/assets/boat-fatcat.jpg";
import boatSunset from "@/assets/boat-sunset.jpg";
import boatCatamaran from "@/assets/boat-catamaran.jpg";
import boatAllycat from "@/assets/boat-allycat.jpg";

const boatTours = [
  { name: "Private Boat Tour", desc: "Whale watching, snorkeling, and light trolling with beverages included. 3 hours, up to 7 guests.", img: boatCatamaran },
  { name: "Fishing Charter", desc: "4-hour deep-sea charter with all equipment and beverages. Up to 4 people. Bring your catch back to the estate — Ricardo, your private chef, will prepare it for dinner.", img: boatFishingCharter },
  { name: "Spearfishing", desc: "Inshore trips (4–5 hours) or full-day deep water expeditions (7 AM – 4 PM) with all equipment, beverages, and sashimi preparation. Up to 3–4 people.", img: boatSpearfishing },
];

const sailingFleet = [
  { name: "Intimate Sailing", desc: "Perfect for smaller groups up to 12. Snorkeling stops, open bar, and fresh ceviche prepared on board.", img: boatSunset },
  { name: "Private Charter", desc: "Charter for up to 16 with paddleboards, snorkel gear, and full bar service.", img: boatCat },
  { name: "Luxury Catamaran", desc: "Spacious catamaran perfect for sunset sails and celebrations. Accommodates up to 30 guests.", img: boatFatcat },
  { name: "Large Group Sailing", desc: "The largest option — luxury sailing with all amenities for bigger parties and special occasions.", img: boatAllycat },
];

export default function Boats() {
  return (
    <Layout>
      <SEO title="Boats & Sailing Charters | Sempre Avanti" description="Sunset sails, snorkeling charters, and private day trips from the bay — curated by our concierge." path="/experiences/boats" />
      {/* Hero */}
      <section className="relative h-[60dvh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img src={boatFishingCharter} alt="Deep sea fishing on the Pacific" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
        <div className="relative z-10 text-center text-primary-foreground px-4 w-full max-w-6xl mx-auto">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Experiences</p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1"><PageNavArrows prev={prev} next={undefined} variant="hero" /></div>
            <h1 className="font-serif text-5xl md:text-7xl font-light whitespace-nowrap">Boat Tours & Sailing</h1>
            <div className="flex-1"><PageNavArrows prev={undefined} next={next} variant="hero" /></div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="On the Water"
            title="From Deep-Sea Charters to Sunset Sails"
            description="Banderas Bay is one of the largest and most biodiverse bays in the Pacific. Your concierge arranges private boat tours, fishing charters, spearfishing expeditions, and luxury sailing — all departing from marinas minutes away."
          />
        </div>
      </section>

      {/* Boat Tours */}
      <section className="pb-20 md:pb-28">
        <div className="container max-w-6xl">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent">Boat Tours & Fishing</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {boatTours.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-card rounded-xl overflow-hidden border border-border"
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

      {/* Sailing Fleet */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container max-w-6xl">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent">Sailing & Catamaran Charters</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <p className="text-base font-sans text-muted-foreground leading-relaxed max-w-3xl mb-8">
            Choose from intimate charters to full-size catamarans — all with open bar, fresh food, snorkel gear, and paddleboards. Perfect for sunset celebrations, family outings, or a day exploring the coastline.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sailingFleet.map((item, i) => (
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

      {/* Photo Gallery */}
      <section className="py-4">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="aspect-video overflow-hidden rounded">
              <img src={fishingImg} alt="Fishing charter" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-video overflow-hidden rounded">
              <img src={whaleImg} alt="Whale watching" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-video overflow-hidden rounded">
              <img src={boatSunset} alt="Sunset sailing" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-video overflow-hidden rounded">
              <img src={boatShoreSpearfishing} alt="Spearfishing" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 md:py-28 text-primary-foreground overflow-hidden">
        <img src={boatSunset} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 container max-w-4xl text-center">
          <SectionHeading
            eyebrow="Your Concierge"
            title="Charter, Sail, or Fish — We Handle It All"
            description="Your concierge coordinates directly with captains and crews. Just pick a day and tell us what you're in the mood for. All pricing provided upon inquiry."
            light
          />
          <InquiryDialog>
            <button className="inline-block mt-6 px-10 py-4 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors rounded-full">
              Plan Your Day on the Water
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
