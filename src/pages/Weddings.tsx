import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, UtensilsCrossed, Wine, BedDouble, Users } from "lucide-react";

import estate3 from "@/assets/estate-3.jpeg";
import weddingImg from "@/assets/wedding2.png";

const weddingFeatures = [
  {
    icon: Heart,
    title: "Beach Ceremony",
    desc: "Exchange vows on your own 250-foot private beach with the Pacific as your backdrop. Sunset ceremonies, barefoot elegance, and an intimate setting that feels worlds apart.",
  },
  {
    icon: UtensilsCrossed,
    title: "Beachfront Dining",
    desc: "Long-table dinners on the sand, prepared by your private chef Ricardo. Multi-course menus tailored to your celebration — from fresh-caught seafood to wood-fired pizza from the estate's outdoor oven.",
  },
  {
    icon: Wine,
    title: "Bar & Cocktails",
    desc: "Your dedicated bartender serves craft cocktails, premium spirits, and the estate's signature sunset margarita ritual. Full open bar service for your entire stay.",
  },
  {
    icon: BedDouble,
    title: "Accommodation",
    desc: "Five luxury bedrooms across two villas sleep up to 14 guests. Flexible configurations with single beds available for larger wedding parties. The entire estate is exclusively yours.",
  },
  {
    icon: Users,
    title: "Full Coordination",
    desc: "Your concierge handles vendor coordination, music, decor logistics, and day-of timing. The full Sempre Avanti team — chef, bartender, housekeeper, and maintenance — ensures every detail is flawless.",
  },
];

export default function Weddings() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img src={weddingImg} alt="Beachfront wedding" className="absolute inset-0 w-full h-full object-cover" />
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
                <PhotoPlaceholder label={feature.title} aspectRatio="video" className="rounded-xl overflow-hidden" />
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
            {["Beach Ceremony", "Long Table Dinner", "Cocktail Hour", "First Dance"].map((label) => (
              <PhotoPlaceholder key={label} label={label} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
          <Link
            to="/contact"
            className="inline-block mt-6 px-10 py-4 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors rounded-full"
          >
            Inquire About Weddings
          </Link>
        </div>
      </section>
    </Layout>
  );
}
