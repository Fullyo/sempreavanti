import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Surfing",
    eyebrow: "Catch a Wave",
    items: [
      { name: "Surf Lesson — Sayulita", desc: "Learn to ride in Sayulita's friendly waves. Boards and instruction included.", price: "~$60 USD / person", note: "Minimum 2 people" },
      { name: "Surf Experience — La Lancha", desc: "World-class left point break near Punta de Mita. Transportation, boards, 1.5-hour lesson, and 30 minutes of free surf included.", price: "~$100 USD / person" },
      { name: "Captain Pablo's", desc: "Right point break — consistent, fun, great for intermediate surfers. Beachfront restaurant after." },
      { name: "Don Pedro's", desc: "Left break right in front of the iconic restaurant. Watch the surfers while you eat." },
      { name: "Burros", desc: "Powerful beach break north of Sayulita. For experienced surfers." },
      { name: "Punta Mita", desc: "Several breaks around the point — varied conditions for all levels." },
      { name: "Lessons with Chillo", desc: "The best beginner instructor in Sayulita. Patient, fun, and your kids will love him." },
    ],
  },
  {
    title: "Food & Culinary",
    eyebrow: "Taste Mexico",
    items: [
      { name: "Sayulita Taco Tour", desc: "Pickup, transportation, 3–4 taco spots, local history, and a finish at an agave field with blue corn tacos and quesadillas. Food included up to ~$20 USD — extras paid by guest.", price: "~$60 USD / person", note: "Tue–Sun, minimum 4 people" },
      { name: "Private Cooking Class", desc: "In-house Mexican cooking class with a local chef. Learn traditional recipes and enjoy what you make.", price: "~$60 USD / person" },
    ],
  },
  {
    title: "Boats & Fishing",
    eyebrow: "On the Water",
    items: [
      { name: "Private Boat Tour", desc: "Whale watching, snorkeling equipment, light trolling, water, sodas, and beer included. 3 hours, up to 7 guests.", price: "~$475 USD", note: "4-hour extension: ~$575 USD" },
      { name: "Fishing Charter", desc: "4-hour charter with water, sodas, beer, and all fishing equipment. Up to 4 people.", price: "~$500 USD" },
      { name: "Spearfishing — Inshore", desc: "4–5 hour inshore spearfishing trip. Equipment and beverages included. Up to 3–4 people.", price: "~$600 USD" },
      { name: "Spearfishing — Deep Water", desc: "Full-day deep water trip (7 AM – 4 PM). Equipment, beverages, and sashimi preparation included. Up to 3 people.", price: "~$1,050 USD" },
      { name: "Catch & Cook", desc: "Bring your catch back and Ricardo will prepare it for dinner. The freshest meal you'll ever have." },
    ],
  },
  {
    title: "Golf",
    eyebrow: "Tee Off",
    items: [
      { name: "Litibú Golf Course", desc: "15 minutes away. 18-hole Greg Norman design with ocean views. Our top recommendation." },
      { name: "Four Seasons Punta Mita", desc: "Two world-class Jack Nicklaus courses — Pacífico and Bahía. Bucket-list golf." },
      { name: "El Flamingo", desc: "9-hole course near Bucerías. Casual, fun, great for a quick round." },
      { name: "El Tigre", desc: "18-hole course in Nuevo Vallarta. Von Hagge design with water features." },
    ],
  },
  {
    title: "Ocean & Water",
    eyebrow: "Dive In",
    items: [
      { name: "Snorkeling — Playa de los Muertos", desc: "10 minutes from the house. Calm, clear water perfect for snorkeling with kids." },
      { name: "Marietas Islands", desc: "Protected national park. Snorkeling, hidden beach, whale watching in season." },
      { name: "Scuba Diving — Sebastian", desc: "PADI certified instructor. Beginner to advanced certifications available." },
      { name: "Kite Surfing", desc: "Available in Punta Mita when conditions are right. Equipment and instruction provided." },
      { name: "Paddleboard Tours", desc: "Glide along the coast on stand-up paddleboard excursions." },
      { name: "Whale Watching", desc: "Seasonal humpback encounters from December through March." },
    ],
  },
  {
    title: "Sailing",
    eyebrow: "Set Sail",
    items: [
      { name: "Fat Cat", desc: "Spacious catamaran for larger groups — sunset sails and celebrations up to 30 guests." },
      { name: "Ally Cat", desc: "Intimate sailing for up to 12 guests. Snorkeling stops, open bar, fresh ceviche on board." },
      { name: "Ally Cat Too", desc: "Private charter for up to 16. Paddleboards, snorkel gear, and onboard refreshments included." },
      { name: "Ally Cat 3", desc: "The newest and largest — luxury sailing with all amenities for bigger groups." },
    ],
  },
  {
    title: "Land & Adventure",
    eyebrow: "Explore",
    items: [
      { name: "Zipline & Canopy Tours", desc: "Soar above the jungle canopy on world-class ziplines through the Sierra Madre." },
      { name: "ATV & RZR Tours", desc: "Navigate mountain trails and coastal paths on guided off-road adventures." },
      { name: "Horseback Riding", desc: "Trail rides through the jungle and along the beach at sunset." },
      { name: "Jungle & Monkey Mountain Hikes", desc: "Guided hikes through tropical jungle with wildlife encounters." },
      { name: "Polaris UTV Rentals", desc: "Available at the property. The best way to get to Sayulita and Punta de Mita. 2-seater, 4-seater, and 6-seater options.", price: "From ~$80 USD / day" },
    ],
  },
  {
    title: "Cultural & Local",
    eyebrow: "Discover",
    items: [
      { name: "La Cruz Sunday Market", desc: "The region's best — fresh seafood, artisan crafts, live music, and authentic Mexican culture." },
      { name: "Sayulita Friday Market", desc: "Organic produce, local treats, and artisan goods in the heart of Sayulita." },
      { name: "Puerto Vallarta Malecón", desc: "Iconic seaside boardwalk with art, dining, and nightlife." },
      { name: "Tequila & Mezcal Tastings", desc: "Curated tastings of Mexico's finest spirits at La Selecta in Sayulita." },
    ],
  },
];

export default function Experiences() {
  return (
    <Layout>
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <PhotoPlaceholder label="Adventures" className="absolute inset-0 !aspect-auto opacity-30" />
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
                  <PhotoPlaceholder label={item.name} aspectRatio="video" className="mb-4" />
                  <h3 className="font-serif text-xl mb-2 group-hover:text-accent transition-colors">{item.name}</h3>
                  <p className="text-sm font-sans text-muted-foreground leading-relaxed">{item.desc}</p>
                  {item.price && (
                    <p className="text-sm font-sans font-medium text-accent mt-3">{item.price}</p>
                  )}
                  {item.note && (
                    <p className="text-xs font-sans text-muted-foreground mt-1">{item.note}</p>
                  )}
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

      <div className="container max-w-4xl py-8">
        <p className="text-xs font-sans text-muted-foreground text-center italic">
          Prices shown in USD are approximate. Final pricing is in Mexican Pesos at the current exchange rate.
        </p>
      </div>
    </Layout>
  );
}
