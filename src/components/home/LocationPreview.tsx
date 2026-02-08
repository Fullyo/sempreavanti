import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GuestyListing } from "@/hooks/useGuestyListings";

interface LocationPreviewProps {
  listings?: GuestyListing[];
}

export default function LocationPreview({ listings }: LocationPreviewProps) {
  const photo = listings?.[2]?.pictures?.[0]?.original;

  return (
    <section className="py-20 md:py-28" aria-label="Location preview">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {photo ? (
              <img
                src={photo}
                alt="Aerial view of Riviera Nayarit coastline near Sayulita"
                className="w-full h-[450px] object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-[450px] bg-muted" />
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent mb-3 block">
              Riviera Nayarit
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight mb-6 text-foreground">
              Between Sayulita & San Pancho
            </h2>
            <p className="text-base font-sans text-muted-foreground leading-relaxed mb-4">
              Sempre Avanti sits on a private stretch of Pacific coastline, minutes from the vibrant surf town of Sayulita and the artistic village of San Pancho. Connected by Polaris UTVs, you're never more than 10 minutes from world-class dining, shopping, and nightlife.
            </p>
            <p className="text-base font-sans text-muted-foreground leading-relaxed mb-8">
              Punta de Mita, the Four Seasons, and the St. Regis are a short drive south. The famous La Cruz Sunday Market is 20 minutes north. Private yet perfectly connected.
            </p>
            <Link
              to="/location"
              className="inline-block px-8 py-3 bg-accent text-accent-foreground font-sans text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors"
            >
              Explore the Area
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
