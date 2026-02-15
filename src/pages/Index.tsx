import { Link } from "react-router-dom";
import InquiryDialog from "@/components/InquiryDialog";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { useGuestyListings } from "@/hooks/useGuestyListings";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import HeroSection from "@/components/home/HeroSection";
import ServicesGrid from "@/components/home/ServicesGrid";
import FlowOfDaySection from "@/components/home/FlowOfDaySection";
import LocationPreview from "@/components/home/LocationPreview";
import CulinaryPreview from "@/components/home/CulinaryPreview";
import HospitalitySection from "@/components/home/HospitalitySection";
import GuestReviews from "@/components/home/GuestReviews";
import QuoteSection from "@/components/home/QuoteSection";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import estate1 from "@/assets/estate-1.jpeg";
import estate2 from "@/assets/estate-2.jpeg";
import estate3 from "@/assets/estate-3.jpeg";
import estate4 from "@/assets/estate-4.jpeg";
import estate5 from "@/assets/estate-5.jpeg";
import estate6 from "@/assets/estate-6.jpeg";
import estate7 from "@/assets/estate-7.jpeg";
import estate8 from "@/assets/estate-8.jpeg";

const ESTATE_PHOTOS = [estate1, estate2, estate3, estate4, estate5, estate6, estate7, estate8];



function EstateCarousel({ pictures }: { pictures: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-tr-[60px] rounded-bl-[60px]" ref={emblaRef}>
        <div className="flex">
          {pictures.map((src, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0">
              <img
                src={src}
                alt={`Estate view ${i + 1}`}
                className="w-full h-[400px] md:h-[500px] object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 text-white hover:bg-black/60 transition-colors disabled:opacity-30 rounded-full"
        aria-label="Previous photo"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 text-white hover:bg-black/60 transition-colors disabled:opacity-30 rounded-full"
        aria-label="Next photo"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function Index() {
  const { data: listings, isLoading } = useGuestyListings();

  return (
    <Layout>
      <HeroSection listings={listings} />

      {/* Estate Introduction — Casa Tara style two-column */}
      <section className="py-20 md:py-32" aria-label="Estate introduction">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text + Stats */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-golden mb-3 block">
                The Estate
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight mb-4 text-foreground">
                More Than a Stay — A Destination
              </h2>
              {/* Decorative divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-golden" />
                <div className="w-2 h-2 rounded-full bg-golden" />
                <div className="h-px w-12 bg-golden" />
              </div>
              <p className="text-base font-sans text-muted-foreground leading-relaxed mb-4">
                Villas Sempre Avanti is a self-contained private resort on the Riviera Nayarit coast. Two adjacent beachfront villas — Villa Pietro and Villa Luisa — create a seamless estate with private beach, pool, and every detail attended to by your dedicated team.
              </p>
              <p className="text-base font-sans text-muted-foreground leading-relaxed mb-8">
                Two adjacent beachfront villas with private pool, beachfront dining, and a dedicated team of chefs, concierge, and housekeeping. Everything you need, nothing you don't.
              </p>
              {/* 2x2 Stats Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { value: "5", label: "Bedrooms" },
                  { value: "14", label: "Guests" },
                  { value: "5", label: "Bathrooms" },
                  { value: "Private", label: "Beach" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center border border-border rounded-xl p-4">
                    <span className="font-serif text-3xl md:text-4xl block text-golden">{stat.value}</span>
                    <span className="text-xs font-sans uppercase tracking-widest text-muted-foreground mt-1 block">{stat.label}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/villas"
                className="inline-block px-8 py-3 border border-foreground/30 text-foreground font-sans text-sm uppercase tracking-widest hover:bg-foreground/5 transition-colors rounded-full"
              >
                Explore the Villas
              </Link>
            </motion.div>

            {/* Right: Full carousel with thumbnails */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <EstateCarousel pictures={ESTATE_PHOTOS} />
              {/* Thumbnail strip */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {ESTATE_PHOTOS.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Preview ${i + 1}`}
                    className="w-16 h-12 object-cover rounded-lg opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
                    loading="lazy"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ServicesGrid />

      <FlowOfDaySection listings={listings} />

      <LocationPreview />

      <CulinaryPreview />

      <HospitalitySection listings={listings} />

      <GuestReviews />

      <QuoteSection />

      {/* CTA */}
      <section className="relative py-20 md:py-32 overflow-hidden" aria-label="Call to action">
        {listings?.[2]?.pictures?.[1] ? (
          <>
            <img
              src={listings[2].pictures[1].original}
              alt="Sempre Avanti beachfront estate at sunset"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-ocean to-primary" />
        )}
        <div className="container text-center relative z-10 text-primary-foreground">
          <SectionHeading
            eyebrow="Begin Your Journey"
            title="Your Private Beachfront Awaits"
            description="Sempre Avanti is more than a place to stay. It's a complete experience — designed so every guest type is supported, every stay feels intentional."
            light
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <InquiryDialog>
              <button className="inline-block px-10 py-4 bg-accent text-accent-foreground font-sans text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors rounded-full">
                Inquire Now
              </button>
            </InquiryDialog>
            <Link
              to="/book"
              className="inline-block px-10 py-4 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors rounded-full"
            >
              Check Availability
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
