import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { useGuestyListings } from "@/hooks/useGuestyListings";
import { Skeleton } from "@/components/ui/skeleton";

const highlights = [
  {
    title: "Wellness",
    description: "Daily yoga, breathwork, massage, and sound healing on the beach.",
    icon: "🧘",
    path: "/wellness",
  },
  {
    title: "Private Dining",
    description: "Chef-prepared meals, sunset margaritas, and fire-lit evenings.",
    icon: "🍽",
    path: "/chef",
  },
  {
    title: "Adventures",
    description: "Surfing, sailing, ATV tours, and the best of Riviera Nayarit.",
    icon: "🌊",
    path: "/experiences",
  },
  {
    title: "Celebrations",
    description: "Weddings, retreats, and gatherings on your own private beach.",
    icon: "🎉",
    path: "/events",
  },
];

export default function Index() {
  const { data: listings, isLoading } = useGuestyListings();

  // Try to find a hero image from listings
  const heroImage = listings?.[0]?.pictures?.[0]?.original;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {heroImage ? (
          <img
            src={heroImage}
            alt="Casa Sempre Avanti beachfront"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-primary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        <div className="relative z-10 text-center text-primary-foreground px-4 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xs md:text-sm font-sans uppercase tracking-[0.4em] mb-6 opacity-90"
          >
            A Private Beachfront Destination
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-light mb-6"
          >
            Sempre Avanti
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-base md:text-xl font-sans font-light max-w-2xl mx-auto opacity-90 leading-relaxed"
          >
            Two luxury beachfront villas. Five bedrooms. Fully hosted.
            Where wellness, dining, adventure, and celebration flow seamlessly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/contact"
              className="inline-block px-8 py-3 bg-accent text-accent-foreground font-sans text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors"
            >
              Inquire
            </Link>
            <Link
              to="/villas"
              className="inline-block px-8 py-3 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors"
            >
              Explore the Estate
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Estate Introduction */}
      <section className="py-20 md:py-32">
        <div className="container">
          <SectionHeading
            eyebrow="The Estate"
            title="More Than a Stay — A Destination"
            description="Casa Sempre Avanti is a self-contained private resort on the Riviera Nayarit coast. Two adjacent beachfront villas — Casa Pietro and Casa Luisa — create a seamless estate with private beach, pool, and every detail attended to by your dedicated team."
          />

          {/* Listings preview */}
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

      {/* Experience Highlights */}
      <section className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="container">
          <SectionHeading
            eyebrow="Your Stay"
            title="Every Moment, Curated"
            description="From sunrise yoga to fire-lit dinners, every hour flows with intention. You don't plan — you simply arrive."
            light
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link to={item.path} className="block text-center group">
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <h3 className="font-serif text-2xl mb-2 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm font-sans opacity-70 leading-relaxed">
                    {item.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Strip from Guesty */}
      {listings && listings[0]?.pictures && listings[0].pictures.length > 1 && (
        <section className="py-4">
          <div className="flex overflow-x-auto gap-1 scrollbar-hide">
            {listings[0].pictures.slice(1, 7).map((pic, i) => (
              <img
                key={i}
                src={pic.original}
                alt={`Casa Sempre Avanti ${i + 1}`}
                className="h-64 md:h-80 w-auto object-cover flex-shrink-0"
                loading="lazy"
              />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 md:py-32">
        <div className="container text-center">
          <SectionHeading
            eyebrow="Begin Your Journey"
            title="Your Private Beachfront Awaits"
            description="Sempre Avanti is more than a place to stay. It's a complete experience — designed so every guest type is supported, every stay feels intentional."
          />
          <Link
            to="/contact"
            className="inline-block px-10 py-4 bg-accent text-accent-foreground font-sans text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors"
          >
            Inquire Now
          </Link>
        </div>
      </section>
    </Layout>
  );
}
