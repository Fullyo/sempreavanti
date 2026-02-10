import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import PageNavArrows, { experiencePages, getPageNav } from "@/components/PageNavArrows";
import { motion } from "framer-motion";
import InquiryDialog from "@/components/InquiryDialog";

const { prev, next } = getPageNav(experiencePages, "/experiences/boats");

import fishingImg from "@/assets/fishing.jpg";
import whaleImg from "@/assets/whale.jpeg";

const boatTours = [
  { name: "Private Boat Tour", desc: "Whale watching, snorkeling, and light trolling with beverages included. 3 hours, up to 7 guests." },
  { name: "Fishing Charter", desc: "4-hour deep-sea charter with all equipment and beverages. Up to 4 people." },
  { name: "Spearfishing — Inshore", desc: "4–5 hour inshore trip with equipment and beverages included. Up to 3–4 people." },
  { name: "Spearfishing — Deep Water", desc: "Full-day trip (7 AM – 4 PM) with equipment, beverages, and sashimi preparation. Up to 3 people." },
  { name: "Catch & Cook", desc: "Bring your catch back to the estate and Ricardo, your private chef, will prepare it for dinner — ceviche, grilled, or however you like." },
];

const sailingFleet = [
  { name: "Ally Cat", desc: "Intimate sailing for up to 12 guests. Snorkeling stops, open bar, and fresh ceviche prepared on board." },
  { name: "Ally Cat Too", desc: "Private charter for up to 16 with paddleboards, snorkel gear, and full bar service." },
  { name: "Ally Cat 3", desc: "The newest and largest in the fleet — luxury sailing with all amenities for larger groups." },
  { name: "Fat Cat", desc: "Spacious catamaran perfect for sunset sails and celebrations. Accommodates up to 30 guests." },
];

export default function Boats() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img src={fishingImg} alt="Deep sea fishing on the Pacific" className="absolute inset-0 w-full h-full object-cover" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boatTours.map((item, i) => (
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

      {/* Sailing Fleet */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container max-w-6xl">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent">The Ally Cat Fleet</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <p className="text-base font-sans text-muted-foreground leading-relaxed max-w-3xl mb-8">
            The Ally Cat fleet is the premier sailing experience in Banderas Bay. Choose from intimate charters to full-size catamarans — all with open bar, fresh food, snorkel gear, and paddleboards. Perfect for sunset celebrations, family outings, or a day exploring the coastline.
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
            {["Ally Cat Sailing", "Sunset Cruise"].map((label) => (
              <PhotoPlaceholder key={label} label={label} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 md:py-28 text-primary-foreground overflow-hidden">
        <img src={fishingImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 container max-w-4xl text-center">
          <SectionHeading
            eyebrow="Your Concierge"
            title="Charter, Sail, or Fish — We Handle It All"
            description="Your concierge coordinates directly with captains and the Ally Cat crew. Just pick a day and tell us what you're in the mood for. All pricing provided upon inquiry."
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
