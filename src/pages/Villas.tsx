import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import VillaCarousel from "@/components/VillaCarousel";
import GuestReviews from "@/components/home/GuestReviews";
import { useGuestyListings } from "@/hooks/useGuestyListings";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Flame, Droplets, Waves, UtensilsCrossed } from "lucide-react";

import villaHero from "@/assets/villa-hero.jpg";
import estate1 from "@/assets/estate-1.jpeg";
import estate2 from "@/assets/estate-2.jpeg";
import estate3 from "@/assets/estate-3.jpeg";
import estate4 from "@/assets/estate-4.jpeg";
import estate5 from "@/assets/estate-5.jpeg";
import estate6 from "@/assets/estate-6.jpeg";
import estate7 from "@/assets/estate-7.jpeg";
import estate8 from "@/assets/estate-8.jpeg";
import estate9 from "@/assets/estate-9.jpeg";
import estate10 from "@/assets/estate-10.jpeg";
import estate11 from "@/assets/estate-11.jpeg";
import estate12 from "@/assets/estate-12.jpeg";
import estate13 from "@/assets/estate-13.jpeg";
import estate14 from "@/assets/estate-14.jpeg";
import estate15 from "@/assets/estate-15.jpeg";
import estate16 from "@/assets/estate-16.jpeg";

const ESTATE_GALLERY = [
  estate1, estate2, estate3, estate4, estate5, estate6, estate7, estate8,
  estate9, estate10, estate11, estate12, estate13, estate14, estate15, estate16,
];

const estateFeatures = [
  { icon: Waves, title: "250ft Private Beach", desc: "Your own stretch of Pacific coastline — swim, surf, or simply unwind on the sand." },
  { icon: Droplets, title: "Two Infinity Pools", desc: "Each villa has its own infinity-edge pool overlooking the ocean." },
  { icon: UtensilsCrossed, title: "Beachfront Dining", desc: "Long-table dinners on the sand, prepared by your private chefs with local ingredients." },
  { icon: Flame, title: "Fire Pit & Lounge", desc: "Gather around the beachside fire pit for evening stories under the stars." },
];

export default function Villas() {
  const { data: listings, isLoading } = useGuestyListings();

  const casaPietro = listings?.find((l) =>
    l._id === "697bcfb8c91d8d0015ca285a" || l.nickname === "Casa Pietro" || l._id === "casa-pietro-fallback"
  );
  const casaLuisa = listings?.find((l) =>
    l._id === "697bcfe3a874360012e8aa31" || l.nickname === "Villa Luisa" || l._id === "villa-luisa-fallback"
  );

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img src={villaHero} alt="The Villas" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">The Estate</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light">The Villas</h1>
        </div>
      </section>

      {/* Intro — Casa Pietro + Casa Luisa = Sempre Avanti */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl text-center">
          <p className="text-xs font-sans uppercase tracking-[0.4em] text-accent mb-4">Casa Pietro + Villa Luisa</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">Together, They Are Sempre Avanti</h2>
          <p className="text-base md:text-lg font-sans text-muted-foreground leading-relaxed">
            Two adjacent beachfront villas united into a single private estate. Five luxury bedrooms, a private beach, pool, and dedicated staff — designed for families, celebrations, and groups who want it all.
          </p>
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
            {[
              { villa: casaPietro, label: "Villa One" },
              { villa: casaLuisa, label: "Villa Two" },
            ]
              .filter((v) => v.villa)
              .map(({ villa, label }, idx) => {
                const displayName = villa!.nickname || villa!.title || "Villa";
                return (
                <motion.div
                  key={villa!._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="flex flex-col"
                >
                  {/* Carousel as main image */}
                  {villa!.pictures && villa!.pictures.length > 0 ? (
                    <VillaCarousel pictures={villa!.pictures} villaName={displayName} />
                  ) : (
                    <PhotoPlaceholder label={displayName} className="h-[360px] !aspect-auto rounded-tl-[40px] rounded-br-[40px]" />
                  )}

                  {/* Info */}
                  <div className="mt-6">
                    <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent mb-2 block">
                      {label}
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl font-light mb-4">{displayName}</h2>

                    {/* Stats — prominent */}
                    <div className="flex gap-6 mb-5 text-sm font-sans">
                      <div className="text-center">
                        <span className="block text-2xl font-serif text-foreground">{villa!.bedrooms}</span>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">Bedrooms</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-2xl font-serif text-foreground">{villa!.bathrooms}</span>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">Bathrooms</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-2xl font-serif text-foreground">{villa!.accommodates}</span>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">Guests</span>
                      </div>
                    </div>

                    <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                      {villa!.publicDescription?.summary || villa!.description || "Details coming soon."}
                    </p>
                  </div>
                </motion.div>
                );
              })}

          </div>
        </section>
      )}

      {/* Estate Amenities */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container max-w-6xl">
          <SectionHeading eyebrow="The Complete Estate — Sleeps 14" title="Five Bedrooms. Two Pools. One Private Beach." />
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
        </div>
      </section>

      {/* More Than a Stay — A Destination (Estate Gallery) */}
      <section className="py-16 md:py-24">
        <div className="container max-w-6xl">
          <SectionHeading eyebrow="The Estate" title="More Than a Stay — A Destination" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {ESTATE_GALLERY.map((src, i) => (
              <motion.img
                key={i}
                src={src}
                alt={`Estate ${i + 1}`}
                className="w-full h-48 md:h-64 object-cover rounded-xl"
                loading="lazy"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Guest Reviews */}
      <GuestReviews />

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
