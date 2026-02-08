import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { useGuestyListings } from "@/hooks/useGuestyListings";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Villas() {
  const { data: listings, isLoading } = useGuestyListings();

  const casaPietro = listings?.find((l) =>
    (l.title || l.nickname || "").toLowerCase().includes("pietro")
  );
  const casaLuisa = listings?.find((l) =>
    (l.title || l.nickname || "").toLowerCase().includes("luisa")
  );

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {listings?.[0]?.pictures?.[0] ? (
          <img
            src={listings[0].pictures[0].original}
            alt="The Villas"
            className="absolute inset-0 w-full h-full object-cover"
          />
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

      {/* Villa Details */}
      {isLoading ? (
        <div className="container pb-20 space-y-16">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      ) : (
        <>
          {[casaPietro, casaLuisa].filter(Boolean).map((villa, idx) => (
            <section
              key={villa!._id}
              className={`py-16 md:py-24 ${idx % 2 === 1 ? "bg-card" : ""}`}
            >
              <div className="container">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                  <motion.div
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className={idx % 2 === 1 ? "lg:order-2" : ""}
                  >
                    {villa!.pictures?.[0] ? (
                      <img
                        src={villa!.pictures[0].original}
                        alt={villa!.title || villa!.nickname}
                        className="w-full h-[500px] object-cover"
                      />
                    ) : (
                      <div className="w-full h-[500px] bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground font-sans">Photo coming soon</span>
                      </div>
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
                    <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
                      {villa!.title || villa!.nickname}
                    </h2>
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
                          <span
                            key={a}
                            className="text-xs font-sans px-3 py-1 bg-secondary text-secondary-foreground rounded-sm"
                          >
                            {a}
                          </span>
                        ))}
                        {villa!.amenities.length > 12 && (
                          <span className="text-xs font-sans px-3 py-1 text-muted-foreground">
                            +{villa!.amenities.length - 12} more
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Photo gallery */}
                {villa!.pictures && villa!.pictures.length > 1 && (
                  <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {villa!.pictures.slice(1, 9).map((pic, i) => (
                      <img
                        key={i}
                        src={pic.original}
                        alt={`${villa!.title || villa!.nickname} ${i + 1}`}
                        className="w-full h-48 md:h-56 object-cover"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          ))}
        </>
      )}

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
            className="inline-block mt-6 px-8 py-3 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors"
          >
            Inquire About Availability
          </Link>
        </div>
      </section>
    </Layout>
  );
}
