import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import InquiryDialog from "@/components/InquiryDialog";
import ExperienceGallery from "@/components/experiences/ExperienceGallery";

import atvImg from "@/assets/atv.jpeg";
import fishingImg from "@/assets/fishing.jpg";
import horsebackImg from "@/assets/horseback.jpg";
import marietasImg from "@/assets/marietas-islands.jpeg";
import whaleImg from "@/assets/whale.jpeg";
import ziplineImg from "@/assets/zipline.jpg";

const categories = [
  {
    title: "Surfing",
    eyebrow: "Catch a Wave",
    gallery: [
      { src: marietasImg, alt: "Ocean waves near Sayulita" },
    ],
    intro: "Vary is your go-to surf guide in Sayulita — an incredible instructor for beginners and intermediates, and the perfect companion for experienced surfers looking to discover the best breaks along the coast. We can arrange lessons and guided sessions any morning during your stay.",
    items: [
      { name: "Sessions with Vary", desc: "Expert instruction, local knowledge, and surf guidance for all levels — from first-timers to experienced wave chasers." },
      { name: "Surf Experience — La Lancha", desc: "World-class left point break near Punta de Mita. Transportation, boards, 1.5-hour lesson, and 30 min free surf." },
      { name: "Captain Pablo's", desc: "Right point break — consistent, fun, great for intermediate surfers." },
      { name: "Don Pedro's", desc: "Left break right in front of the iconic restaurant." },
      { name: "Burros", desc: "Powerful beach break north of Sayulita. For experienced surfers." },
      { name: "Punta Mita", desc: "Several breaks around the point — varied conditions for all levels." },
    ],
  },
  {
    title: "Boats & Fishing",
    eyebrow: "On the Water",
    gallery: [
      { src: fishingImg, alt: "Deep sea fishing on the Pacific" },
      { src: whaleImg, alt: "Whale watching off Banderas Bay" },
    ],
    items: [
      { name: "Private Boat Tour", desc: "Whale watching, snorkeling, light trolling, beverages included. 3 hours, up to 7 guests." },
      { name: "Fishing Charter", desc: "4-hour charter with all equipment and beverages. Up to 4 people." },
      { name: "Spearfishing — Inshore", desc: "4–5 hour inshore trip. Equipment and beverages included. Up to 3–4 people." },
      { name: "Spearfishing — Deep Water", desc: "Full-day trip (7 AM – 4 PM). Equipment, beverages, and sashimi prep. Up to 3 people." },
      { name: "Catch & Cook", desc: "Bring your catch back and Ricardo will prepare it for dinner." },
    ],
  },
  {
    title: "Golf",
    eyebrow: "Tee Off",
    gallery: [],
    items: [
      { name: "Litibú Golf Course", desc: "15 minutes away. 18-hole Greg Norman design with ocean views." },
      { name: "Four Seasons Punta Mita", desc: "Two Jack Nicklaus courses — Pacífico and Bahía. Bucket-list golf." },
      { name: "El Flamingo", desc: "9-hole course near Bucerías. Casual and fun." },
      { name: "El Tigre", desc: "18-hole Von Hagge design in Nuevo Vallarta." },
    ],
  },
  {
    title: "Ocean & Water",
    eyebrow: "Dive In",
    gallery: [
      { src: marietasImg, alt: "Marietas Islands" },
      { src: whaleImg, alt: "Whale watching in Banderas Bay" },
    ],
    items: [
      { name: "Snorkeling — Playa de los Muertos", desc: "10 min from the house. Calm, clear water perfect for kids." },
      { name: "Marietas Islands", desc: "Protected national park. Snorkeling, hidden beach, whale watching in season." },
      { name: "Scuba Diving", desc: "PADI certified instructor. Beginner to advanced certifications." },
      { name: "Kite Surfing", desc: "Available in Punta Mita. Equipment and instruction provided." },
      { name: "Paddleboard Tours", desc: "Stand-up paddleboard excursions along the coast." },
      { name: "Whale Watching", desc: "Seasonal humpback encounters from December through March." },
    ],
  },
  {
    title: "Sailing",
    eyebrow: "Set Sail",
    gallery: [],
    items: [
      { name: "Fat Cat", desc: "Spacious catamaran — sunset sails and celebrations up to 30 guests." },
      { name: "Ally Cat", desc: "Intimate sailing for up to 12. Snorkeling, open bar, fresh ceviche." },
      { name: "Ally Cat Too", desc: "Private charter for up to 16 with paddleboards and snorkel gear." },
      { name: "Ally Cat 3", desc: "The newest and largest — luxury sailing with all amenities." },
    ],
  },
  {
    title: "Land & Adventure",
    eyebrow: "Explore",
    gallery: [
      { src: ziplineImg, alt: "Zipline over the jungle canopy" },
      { src: atvImg, alt: "ATV ride through the mountains" },
      { src: horsebackImg, alt: "Horseback riding on the beach" },
    ],
    items: [
      { name: "Zipline & Canopy Tours", desc: "Soar above the jungle canopy on world-class ziplines." },
      { name: "ATV & RZR Tours", desc: "Guided off-road adventures through mountains and coast." },
      { name: "Horseback Riding", desc: "Trail rides through the jungle and along the beach at sunset." },
      { name: "Jungle & Monkey Mountain Hikes", desc: "Guided hikes with wildlife encounters." },
      { name: "Polaris UTV Rentals", desc: "Available at the property. 2, 4, and 6-seater options." },
      { name: "Bird Watching Tours", desc: "Early-morning guided tours spotting tropical species." },
    ],
  },
  {
    title: "Cultural & Local",
    eyebrow: "Discover",
    gallery: [],
    items: [
      { name: "La Cruz Sunday Market", desc: "The region's premier market. Fresh seafood, crafts, live music." },
      { name: "Sayulita Friday Market", desc: "Organic produce, local treats, and artisan goods." },
      { name: "Puerto Vallarta Malecón", desc: "Iconic seaside boardwalk with art, dining, and nightlife." },
      { name: "Tequila & Mezcal Tastings", desc: "Curated tastings at La Selecta in Sayulita." },
      { name: "San Pancho Cultural Center", desc: "Rotating exhibitions, workshops, and live performances." },
      { name: "Huichol Art Gallery", desc: "Traditional indigenous beadwork and yarn paintings." },
    ],
  },
];

export default function Experiences() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60dvh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img src={atvImg} alt="ATV adventure overlooking the Riviera Nayarit coast" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Riviera Nayarit</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light">Experiences & Adventures</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Powered by Michula Tours"
            title="Every Adventure, Arranged for You"
            description="From jungle ziplines to Pacific sailing, every experience is coordinated by your dedicated concierge and our trusted tour partner, Michula Tours. Just say the word — the adventure comes to you."
          />
        </div>
      </section>

      {/* Activity Sections */}
      {categories.map((cat, catIdx) => {
        const isAlt = catIdx % 2 === 1;
        return (
          <section key={cat.title} className={`py-14 md:py-20 ${isAlt ? "bg-card" : ""}`}>
            <div className="container max-w-6xl">
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent">{cat.eyebrow}</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <h2 className="font-serif text-3xl mb-2">{cat.title}</h2>

              {cat.intro && (
                <p className="text-base font-sans text-muted-foreground leading-relaxed max-w-3xl mb-6">
                  {cat.intro}
                </p>
              )}

              {cat.gallery && cat.gallery.length > 0 && (
                <ExperienceGallery images={cat.gallery} />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mt-6">
                {cat.items.map((item) => (
                  <div key={item.name} className="border-b border-border pb-3">
                    <h3 className="font-serif text-lg">{item.name}</h3>
                    <p className="text-sm font-sans text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="py-20 bg-card text-center">
        <div className="container">
          <SectionHeading
            eyebrow="Your Concierge"
            title="Everything Arranged for You"
            description="Your dedicated concierge knows every trail, every wave, every hidden gem. Tell them what you're dreaming of — they'll make it happen. All pricing provided upon inquiry."
          />
          <InquiryDialog>
            <button className="inline-block mt-4 px-10 py-4 bg-accent text-accent-foreground font-sans text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors rounded-full">
              Plan Your Adventures
            </button>
          </InquiryDialog>
        </div>
      </section>
    </Layout>
  );
}
