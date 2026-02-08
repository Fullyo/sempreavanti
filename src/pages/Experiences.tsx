import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Land & Adventure",
    eyebrow: "Explore",
    items: [
      { name: "Zipline & Canopy Tours", desc: "Soar above the jungle canopy on world-class ziplines through the Sierra Madre." },
      { name: "ATV Tours", desc: "Navigate mountain trails and coastal paths on guided ATV adventures." },
      { name: "RZR Tours", desc: "Off-road through rugged terrain in powerful side-by-side vehicles." },
      { name: "Horseback Riding", desc: "Trail rides through the jungle and along the beach at sunset." },
      { name: "Jungle & Monkey Mountain Hikes", desc: "Guided hikes through tropical jungle with wildlife encounters." },
      { name: "Polaris UTV Rentals", desc: "Two UTVs available at the house — the best way to get to Sayulita and Punta de Mita." },
    ],
  },
  {
    title: "Ocean & Water",
    eyebrow: "Dive In",
    items: [
      { name: "Surf Lessons", desc: "Learn to surf at some of Mexico's best breaks with experienced local instructors." },
      { name: "Surf Spots Guide", desc: "Sayulita, La Lancha, Punta de Mita, Burros, and El Anclote — we know every break." },
      { name: "Paddleboard Tours", desc: "Glide along the coast on stand-up paddleboard excursions." },
      { name: "Snorkeling & Boat Trips", desc: "Explore the Marietas Islands and hidden beaches." },
      { name: "Sport Fishing", desc: "Deep-sea fishing for marlin, tuna, mahi-mahi, and more." },
      { name: "Whale Watching", desc: "Seasonal humpback whale encounters from December through March." },
    ],
  },
  {
    title: "Sailing",
    eyebrow: "Set Sail",
    items: [
      { name: "Fat Cat", desc: "A spacious catamaran for larger groups — perfect for sunset sails and celebrations." },
      { name: "Ally Cat", desc: "An intimate sailing experience along the Riviera Nayarit coast." },
      { name: "Ally Cat Too", desc: "Private charter with snorkeling stops and onboard refreshments." },
      { name: "Ally Cat 3", desc: "The newest addition — luxury sailing with all the amenities." },
    ],
  },
  {
    title: "Cultural & Local",
    eyebrow: "Discover",
    items: [
      { name: "La Cruz Sunday Market", desc: "The region's best market — fresh seafood, artisan crafts, live music, and authentic Mexican culture." },
      { name: "Puerto Vallarta Malecón", desc: "The iconic seaside boardwalk with art, dining, and nightlife." },
      { name: "Sayulita Friday Farmers Market", desc: "Organic produce, local treats, and artisan goods in the heart of Sayulita." },
      { name: "Cooking Classes", desc: "Learn traditional Mexican cuisine with local chefs." },
      { name: "Tequila & Mezcal Tastings", desc: "Curated tastings of Mexico's finest spirits." },
    ],
  },
  {
    title: "Combo Adventures",
    eyebrow: "Best of Both",
    items: [
      { name: "ATV + Zipline", desc: "Combine the thrill of off-road riding with canopy flying." },
      { name: "ATV + Horseback", desc: "A full day of land adventure — ATV trails and horseback riding." },
      { name: "Custom Group Packages", desc: "We design bespoke adventure days for your group. Just tell Eno what you're dreaming of." },
    ],
  },
];

export default function Experiences() {
  return (
    <Layout>
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-primary">
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Riviera Nayarit</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light">Experiences & Adventures</h1>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Powered by Michula Tours"
            title="Every Adventure, Arranged for You"
            description="From jungle ziplines to Pacific sailing, every experience is coordinated by your concierge Eno and our trusted tour partner, Michula Tours. Just say the word — the adventure comes to you."
          />
        </div>
      </section>

      {categories.map((cat, catIdx) => (
        <section key={cat.title} className={`py-16 md:py-24 ${catIdx % 2 === 1 ? "bg-card" : ""}`}>
          <div className="container max-w-6xl">
            <SectionHeading eyebrow={cat.eyebrow} title={cat.title} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.items.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group bg-background border border-border p-6 hover:border-accent transition-colors"
                >
                  <div className="h-40 bg-muted mb-4 flex items-center justify-center">
                    <span className="text-xs font-sans text-muted-foreground">Photo placeholder</span>
                  </div>
                  <h3 className="font-serif text-xl mb-2 group-hover:text-accent transition-colors">{item.name}</h3>
                  <p className="text-sm font-sans text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container">
          <SectionHeading
            eyebrow="Your Concierge"
            title="Eno Arranges Everything"
            description="Born and raised in Sayulita, Eno knows every trail, every wave, every hidden gem. Tell him what you're dreaming of — he'll make it happen."
            light
          />
          <Link
            to="/contact"
            className="inline-block mt-4 px-10 py-4 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors"
          >
            Plan Your Adventures
          </Link>
        </div>
      </section>
    </Layout>
  );
}
