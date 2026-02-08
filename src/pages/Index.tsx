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

const BOOKING_URL = "https://casasempreavanti.guestybookings.com/en/properties/697bcfcf3f5e990014fbc4dd?minOccupancy=1";

export default function Index() {
  const { data: listings, isLoading } = useGuestyListings();

  return (
    <Layout>
      <HeroSection listings={listings} />

      {/* Estate Introduction with Stats */}
      <section className="py-20 md:py-32" aria-label="Estate introduction">
        <div className="container">
          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12"
          >
            {[
              { value: "5", label: "Bedrooms" },
              { value: "5", label: "Bathrooms" },
              { value: "10", label: "Guests" },
              { value: "Private", label: "Beach" },
              { value: "Full", label: "Staff" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="font-serif text-3xl md:text-4xl block text-foreground">{stat.value}</span>
                <span className="text-xs font-sans uppercase tracking-widest text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          <SectionHeading
            eyebrow="The Estate"
            title="More Than a Stay — A Destination"
            description="Casa Sempre Avanti is a self-contained private resort on the Riviera Nayarit coast. Two adjacent beachfront villas — Casa Pietro and Casa Luisa — create a seamless estate with private beach, pool, and every detail attended to by your dedicated team."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
            {isLoading ? (
              <>
                <Skeleton className="h-80 rounded-sm" />
                <Skeleton className="h-80 rounded-sm" />
              </>
            ) : (
              listings
                ?.filter((l) => {
                  const name = (l.title || l.nickname || "").toLowerCase();
                  return name.includes("pietro") || name.includes("luisa");
                })
                .slice(0, 2)
                .map((listing) => (
                  <motion.div
                    key={listing._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="group relative overflow-hidden"
                  >
                    <Link to="/villas">
                      {listing.pictures?.[0] ? (
                        <img
                          src={listing.pictures[0].original}
                          alt={listing.title || listing.nickname}
                          className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-80 bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground font-sans text-sm">Photo coming soon</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                        <h3 className="font-serif text-2xl text-primary-foreground">
                          {listing.title || listing.nickname}
                        </h3>
                        <p className="text-primary-foreground/80 text-sm font-sans mt-1">
                          {listing.bedrooms} bedrooms · {listing.bathrooms} bathrooms · Sleeps {listing.accommodates}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))
            )}
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
