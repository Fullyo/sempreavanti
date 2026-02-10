import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import VillaCarousel from "@/components/VillaCarousel";
import { useGuestyListings } from "@/hooks/useGuestyListings";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Flame, Umbrella, Waves, Star, Check } from "lucide-react";

export default function Villas() {
  const { data: listings, isLoading } = useGuestyListings();

  const casaPietro = listings?.find((l) =>
    (l.title || l.nickname || "").toLowerCase().includes("pietro")
  );
  const casaLuisa = listings?.find((l) =>
    (l.title || l.nickname || "").toLowerCase().includes("luisa")
  );

  const estateFeatures = [
    { icon: Waves, title: "Private Beach", desc: "Your own stretch of Pacific coastline — swim, surf, or simply watch the sunset." },
    { icon: Umbrella, title: "Beachfront Pool", desc: "An infinity-edge pool overlooking the ocean, surrounded by lounge areas." },
    { icon: Flame, title: "Fire Pit", desc: "Gather around the beachside fire pit for evening stories and s'mores under the stars." },
    { icon: Star, title: "Beachfront Dining", desc: "Long-table dinners on the sand, lit by fire and starlight, prepared by your private chefs." },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {listings?.[0]?.pictures?.[0] ? (
          <img src={listings[0].pictures[0].original} alt="The Villas" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-primary" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">The Estate</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light">The Villas</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28">
        <div className="container">
          <SectionHeading
            eyebrow="One Destination, Two Homes"
            title="Book as a Complete Estate"
            description="Casa Sempre Avanti brings together two adjacent beachfront villas into a single private destination. Five luxury bedrooms, a private beach, pool, and dedicated staff — designed for families, celebrations, and groups who want it all."
          />
        </div>
      </section>

      {/* Estate Grounds */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container max-w-6xl">
          <SectionHeading eyebrow="The Grounds" title="A Private Resort" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {estateFeatures.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6"
              >
                <feat.icon className="w-8 h-8 mx-auto mb-4 text-accent" strokeWidth={1.2} />
                <h3 className="font-serif text-xl mb-2">{feat.title}</h3>
                <p className="text-sm font-sans text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
          {/* Estate photo gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-12">
            {listings?.[0]?.pictures?.slice(8, 14).map((pic, i) => (
              <img key={i} src={pic.original} alt={`Estate ${i}`} className="w-full h-56 md:h-72 object-cover rounded-xl" loading="lazy" />
            )) || Array.from({ length: 6 }).map((_, i) => (
              <PhotoPlaceholder key={i} label="Estate" />
            ))}
          </div>
        </div>
      </section>

      {/* Villa Details */}
      {isLoading ? (
        <div className="container pb-20 space-y-16">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      ) : (
        <>
          {[casaPietro, casaLuisa].filter(Boolean).map((villa, idx) => (
            <section key={villa!._id} className={`py-16 md:py-24 ${idx % 2 === 1 ? "bg-card" : ""}`}>
              <div className="container">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
                  <motion.div
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className={idx % 2 === 1 ? "lg:order-2" : ""}
                  >
                    {villa!.pictures?.[0] ? (
                      <img src={villa!.pictures[0].original} alt={villa!.title || villa!.nickname} className="w-full h-[500px] object-cover rounded-tl-[40px] rounded-br-[40px]" />
                    ) : (
                      <PhotoPlaceholder label={villa!.title || villa!.nickname} className="h-[500px] !aspect-auto" />
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: idx % 2 === 0 ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className={idx % 2 === 1 ? "lg:order-1" : ""}
                  >
                    <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent mb-3 block">
                      {idx === 0 ? "Villa One" : "Villa Two"}
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">{villa!.title || villa!.nickname}</h2>
                    <div className="flex gap-6 mb-6 text-sm font-sans text-muted-foreground">
                      <span>{villa!.bedrooms} Bedrooms</span>
                      <span>{villa!.bathrooms} Bathrooms</span>
                      <span>Sleeps {villa!.accommodates}</span>
                    </div>
                    <p className="text-base font-sans text-muted-foreground leading-relaxed mb-6">
                      {villa!.publicDescription?.summary || villa!.description || "Details coming soon."}
                    </p>
                    {villa!.amenities && villa!.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {villa!.amenities.slice(0, 12).map((a) => (
                          <span key={a} className="text-xs font-sans px-3 py-1 bg-secondary text-secondary-foreground rounded-sm">{a}</span>
                        ))}
                        {villa!.amenities.length > 12 && (
                          <span className="text-xs font-sans px-3 py-1 text-muted-foreground">+{villa!.amenities.length - 12} more</span>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Photo carousel */}
                {villa!.pictures && villa!.pictures.length > 1 && (
                  <VillaCarousel pictures={villa!.pictures} villaName={villa!.title || villa!.nickname} />
                )}
              </div>
            </section>
          ))}
        </>
      )}

      {/* Emotional Center */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container max-w-4xl text-center">
          <SectionHeading
            eyebrow="The Rhythm of the Estate"
            title="A Day at Sempre Avanti"
            description="Morning wellness on the beach. Mid-morning smoothies by the pool. A chef-prepared lunch under the palapa. Afternoon adventures or hammock naps. Sunset margaritas on the sand. Fire-lit dinners under the stars. Every day flows differently, but always with intention."
          />
        </div>
      </section>

      {/* Your Team */}
      <section className="py-20 md:py-28">
        <div className="container max-w-5xl">
          <SectionHeading
            eyebrow="Hosted, Not Rented"
            title="Your Dedicated Team"
            description="Every guest is personally received. Your team handles every detail — from arrival coordination to ongoing support throughout your stay."
          />
          <div className="space-y-16">
            {[
              { name: "Your Concierge", role: "Head Concierge", language: "English & Spanish", description: "Your dedicated concierge is born and raised in the region, knows everything and everyone. They personally greet every guest upon arrival and see them off at departure, while maintaining your privacy during the stay. Adventures, dining, wellness, transportation — they arrange it all." },
              { name: "Ricardo", role: "Private Chef", language: "English & Spanish", description: "The lead chef and heart of the culinary experience. Ricardo crafts every meal from the freshest local ingredients — from morning juices to fire-lit dinners. He loves discussing menus, dietary needs, and creating surprise celebrations." },
              { name: "Crethell", role: "Private Chef", language: "Spanish (Google Translate works great)", description: "Ricardo's partner in the kitchen. Crethell brings deep expertise in traditional Mexican coastal cuisine and ensures every detail — from presentation to timing — is perfect." },
              { name: "Angy", role: "Daily Housekeeping", language: "Spanish (Google Translate works great)", description: "Angy ensures every space is impeccable — daily housekeeping, fresh linens, and the small details that make the villas feel like a five-star hotel." },
              { name: "Paco", role: "Caretaker & Grounds", language: "Spanish (Google Translate works great)", description: "Paco maintains the property, pool, gardens, and beach setup. He handles beach chairs, umbrellas, bonfire preparation, and everything behind the scenes. The quiet force ensuring everything is always ready." },
            ].map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <PhotoPlaceholder
                  label={person.name}
                  aspectRatio="portrait"
                  className={`rounded-tl-[40px] rounded-br-[40px] overflow-hidden ${i % 2 === 1 ? "md:order-2" : ""}`}
                />
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <span className="text-xs font-sans uppercase tracking-widest text-accent mb-1 block">{person.role}</span>
                  <h3 className="font-serif text-3xl md:text-4xl mb-2">{person.name}</h3>
                  <span className="text-xs font-sans text-muted-foreground mb-4 block">{person.language}</span>
                  <p className="text-base font-sans text-muted-foreground leading-relaxed">{person.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Always Included */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container max-w-4xl text-center">
          <SectionHeading eyebrow="Always Included" title="The Sempre Avanti Standard" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 text-left">
            {[
              "Daily housekeeping",
              "Dedicated house manager & concierge",
              "Arrival coordination & personal greeting",
              "Ongoing guest support throughout your stay",
              "Event & experience coordination",
              "Direct access to your team at all times",
              "4×4 Polaris UTV transportation",
              "Beach setup & maintenance",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" strokeWidth={2} />
                <span className="text-sm font-sans text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sleeping Config */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container max-w-4xl text-center">
          <SectionHeading
            eyebrow="Designed for Real Groups"
            title="Flexible Sleeping Configurations"
            description="All bedrooms are presented as luxury king suites by default, with hotel-grade mattresses and linens. Selected rooms can be configured with single beds for friends, retreat guests, or wedding parties — always intentional, always comfortable."
            light
          />
          <Link
            to="/contact"
            className="inline-block mt-6 px-8 py-3 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors rounded-full"
          >
            Inquire About Availability
          </Link>
        </div>
      </section>
    </Layout>
  );
}
