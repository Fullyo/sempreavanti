import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import EventInquiryForm from "@/components/EventInquiryForm";
import { Heart, UtensilsCrossed, Wine, BedDouble, Users } from "lucide-react";

import estate3 from "@/assets/estate-3.jpeg";
import estate8 from "@/assets/estate-8.jpeg";
import chefMargarita from "@/assets/chef-margarita.jpeg";
import weddingHero from "@/assets/wedding2.png";
import weddingCeremony from "@/assets/wedding-ceremony.png";
import weddingBeachCeremony from "@/assets/wedding-beach-ceremony.png";
import weddingCelebration from "@/assets/wedding-celebration.png";
import wedding4 from "@/assets/wedding4.png";
import wedding1 from "@/assets/wedding1.png";
import wedding2_2 from "@/assets/wedding2-2.png";
import food1 from "@/assets/food1.jpeg";

const weddingFeatures = [
  {
    icon: Heart,
    title: "Beach Ceremony",
    desc: "Exchange vows on your own 250-foot private beach with the Pacific as your backdrop. Sunset ceremonies, barefoot elegance, and an intimate setting that feels worlds apart.",
    image: wedding4,
  },
  {
    icon: UtensilsCrossed,
    title: "Beachfront Dining",
    desc: "Long-table dinners on the sand, prepared by your private chef Ricardo. Multi-course menus tailored to your celebration — from fresh-caught seafood to wood-fired pizza from the estate's outdoor oven.",
    image: food1,
  },
  {
    icon: Wine,
    title: "Bar & Cocktails",
    desc: "Your dedicated bartender serves craft cocktails, premium spirits, and the estate's signature sunset margarita ritual. Full open bar service for your entire stay.",
    image: chefMargarita,
  },
  {
    icon: BedDouble,
    title: "Accommodation",
    desc: "Five luxury bedrooms across two villas sleep up to 14 guests. Flexible configurations with single beds available for larger wedding parties. The entire estate is exclusively yours.",
    image: estate3,
  },
  {
    icon: Users,
    title: "Full Coordination",
    desc: "Your concierge handles vendor coordination, music, decor logistics, and day-of timing. The full Sempre Avanti team — chef, bartender, housekeeper, and maintenance — ensures every detail is flawless.",
    image: weddingCelebration,
  },
];

const galleryImages = [
  { src: wedding1, alt: "Sunset celebration on the beach" },
  { src: wedding4, alt: "Beach ceremony on the sand" },
  { src: weddingCelebration, alt: "Full coordination celebration" },
  { src: weddingBeachCeremony, alt: "Beachfront ceremony setup" },
];

export default function Weddings() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img src={weddingHero} alt="Beachfront wedding" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Celebrations</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light">Weddings</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Your Private Beachfront Venue"
            title="An Intimate Setting for the Biggest Day"
            description="Sempre Avanti isn't a hotel or a resort — it's a private estate with a dedicated team that becomes yours for the week. The beach, the fire pit, the long table under the stars — every space was made for celebrations like this."
          />
        </div>
      </section>

      {/* Features */}
      <section className="pb-20 md:pb-28">
        <div className="container max-w-6xl">
          <div className="space-y-16">
            {weddingFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? "md:direction-rtl" : ""}`}
              >
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                </div>
                <div className={i % 2 === 1 ? "md:text-right" : ""}>
                  <feature.icon className="w-8 h-8 text-accent mb-3" strokeWidth={1.5} />
                  <h3 className="font-serif text-2xl md:text-3xl mb-3">{feature.title}</h3>
                  <p className="text-base font-sans text-muted-foreground leading-relaxed">{feature.desc}</p>
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
            {galleryImages.map((img) => (
              <div key={img.alt} className="aspect-square overflow-hidden rounded-lg">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl text-center mb-12">
          <p className="text-xs font-sans uppercase tracking-[0.3em] text-accent mb-3">Get in Touch</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light mb-4">Start the Conversation</h2>
          <p className="text-base font-sans text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Share your vision and we'll show you how Sempre Avanti can bring it to life.
          </p>
        </div>
        <EventInquiryForm type="wedding" />
      </section>

      {/* Organizer note */}
      <section className="pb-20 md:pb-28">
        <div className="container max-w-3xl text-center">
          <p className="text-sm font-sans text-muted-foreground italic leading-relaxed">
            Planning on behalf of a client? We work closely with wedding planners, coordinators, and event professionals to ensure a seamless experience from first inquiry to farewell brunch.
          </p>
        </div>
      </section>

      {/* CTA Hero Banner */}
      <section className="relative py-20 md:py-28 text-primary-foreground overflow-hidden">
        <img src={estate3} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 container max-w-4xl text-center">
          <SectionHeading
            eyebrow="Begin Planning"
            title="Your Dream Wedding Starts Here"
            description="Tell us about your vision — guest count, dates, and style. We'll share how the estate can bring it to life, with full coordination from your dedicated team."
            light
          />
          <p className="mt-6 text-xs font-sans text-primary-foreground/60 italic">
            Wedding planners and coordinators — we'd love to collaborate. Reach out above and let's create something extraordinary together.
          </p>
        </div>
      </section>
    </Layout>
  );
}
