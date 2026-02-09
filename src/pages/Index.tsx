import { Link } from "react-router-dom";
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

const BOOKING_URL = "https://casasempreavanti.guestybookings.com/en/properties/697bcfcf3f5e990014fbc4dd?minOccupancy=1";

function EstateCarousel({ pictures }: { pictures: Array<{ original: string; thumbnail: string }> }) {
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
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {pictures.slice(0, 8).map((pic, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0">
              <img
                src={pic.original}
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
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 text-white hover:bg-black/70 transition-colors disabled:opacity-30"
        aria-label="Previous photo"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 text-white hover:bg-black/70 transition-colors disabled:opacity-30"
        aria-label="Next photo"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function Index() {
  const { data: listings, isLoading } = useGuestyListings();

  // Combine all estate photos for the carousel
  const allEstatePhotos = listings?.flatMap((l) => l.pictures || []) || [];

  return (
    <Layout>
      <HeroSection listings={listings} />

      {/* Estate Introduction — presented as a whole */}
      <section className="py-20 md:py-32" aria-label="Estate introduction">
        <div className="container">
          <SectionHeading
            eyebrow="The Estate"
            title="More Than a Stay — A Destination"
            description="Casa Sempre Avanti is a self-contained private resort on the Riviera Nayarit coast. Two adjacent beachfront villas — Casa Pietro and Casa Luisa — create a seamless estate with private beach, pool, and every detail attended to by your dedicated team."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 max-w-6xl mx-auto items-center">
            {/* Left: Stats & description */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="grid grid-cols-3 gap-6 mb-8">
                {[
                  { value: "5", label: "Bedrooms" },
                  { value: "5", label: "Bathrooms" },
                  { value: "10", label: "Guests" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <span className="font-serif text-4xl md:text-5xl block text-foreground">{stat.value}</span>
                    <span className="text-xs font-sans uppercase tracking-widest text-muted-foreground mt-1 block">{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { value: "Private", label: "Beach" },
                  { value: "Full", label: "Staff" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <span className="font-serif text-3xl md:text-4xl block text-foreground">{stat.value}</span>
                    <span className="text-xs font-sans uppercase tracking-widest text-muted-foreground mt-1 block">{stat.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-base font-sans text-muted-foreground leading-relaxed mb-6">
                Two adjacent beachfront villas with private pool, fire pit, beachfront dining, and a dedicated team of chefs, concierge, and housekeeping. Everything you need, nothing you don't.
              </p>
              <Link
                to="/villas"
                className="inline-block px-8 py-3 bg-accent text-accent-foreground font-sans text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors"
              >
                Explore the Villas
              </Link>
            </motion.div>

            {/* Right: Scrolling photo carousel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {isLoading ? (
                <Skeleton className="h-[400px] md:h-[500px]" />
              ) : allEstatePhotos.length > 0 ? (
                <EstateCarousel pictures={allEstatePhotos} />
              ) : (
                <div className="h-[400px] md:h-[500px] bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground font-sans text-sm">Photos coming soon</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <ServicesGrid />

      <FlowOfDaySection listings={listings} />

      <LocationPreview listings={listings} />

      <CulinaryPreview listings={listings} />

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
            <div className="absolute inset-0 bg-black/50" />
          </>
        ) : (
          <div className="absolute inset-0 bg-primary" />
        )}
        <div className="container text-center relative z-10 text-primary-foreground">
          <SectionHeading
            eyebrow="Begin Your Journey"
            title="Your Private Beachfront Awaits"
            description="Sempre Avanti is more than a place to stay. It's a complete experience — designed so every guest type is supported, every stay feels intentional."
            light
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link
              to="/contact"
              className="inline-block px-10 py-4 bg-accent text-accent-foreground font-sans text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors"
            >
              Inquire Now
            </Link>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors"
            >
              Check Availability
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
