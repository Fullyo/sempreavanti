import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import VillaCarousel from "@/components/VillaCarousel";
import { useGuestyListings } from "@/hooks/useGuestyListings";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Flame, Umbrella, Waves, Star } from "lucide-react";

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

      {/* Villa Listings — side by side */}
      {isLoading ? (
        <section className="pb-20">
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-[500px] rounded-xl" />
            <Skeleton className="h-[500px] rounded-xl" />
          </div>
        </section>
      ) : (
        <section className="pb-20">
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-10">
            {[casaPietro, casaLuisa].filter(Boolean).map((villa, idx) => (
              <motion.div
                key={villa!._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="flex flex-col"
              >
                {villa!.pictures?.[0] ? (
                  <img
                    src={villa!.pictures[0].original}
                    alt={villa!.title || villa!.nickname}
                    className="w-full h-[360px] object-cover rounded-tl-[40px] rounded-br-[40px]"
                  />
                ) : (
                  <PhotoPlaceholder label={villa!.title || villa!.nickname} className="h-[360px] !aspect-auto rounded-tl-[40px] rounded-br-[40px]" />
                )}
                <div className="mt-6">
                  <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent mb-2 block">
                    {idx === 0 ? "Villa One" : "Villa Two"}
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl font-light mb-4">{villa!.title || villa!.nickname}</h2>
                  <div className="flex gap-5 mb-4 text-sm font-sans text-muted-foreground">
                    <span>{villa!.bedrooms} Bedrooms</span>
                    <span>{villa!.bathrooms} Bathrooms</span>
                    <span>Sleeps {villa!.accommodates}</span>
                  </div>
                  <p className="text-sm font-sans text-muted-foreground leading-relaxed mb-5">
                    {villa!.publicDescription?.summary || villa!.description || "Details coming soon."}
                  </p>
                  {villa!.amenities && villa!.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {villa!.amenities.slice(0, 8).map((a) => (
                        <span key={a} className="text-xs font-sans px-3 py-1 bg-secondary text-secondary-foreground rounded-sm">{a}</span>
                      ))}
                      {villa!.amenities.length > 8 && (
                        <span className="text-xs font-sans px-3 py-1 text-muted-foreground">+{villa!.amenities.length - 8} more</span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Villa Photo Carousels */}
      {!isLoading && [casaPietro, casaLuisa].filter(Boolean).map((villa) => (
        villa!.pictures && villa!.pictures.length > 1 && (
          <section key={`carousel-${villa!._id}`} className="pb-16">
            <div className="container">
              <h3 className="font-serif text-2xl mb-6 text-center">{villa!.title || villa!.nickname} Gallery</h3>
              <VillaCarousel pictures={villa!.pictures} villaName={villa!.title || villa!.nickname} />
            </div>
          </section>
        )
      ))}

      {/* Estate Amenities */}
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

      {/* Sleeping Config CTA */}
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
