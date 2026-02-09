import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GuestyListing } from "@/hooks/useGuestyListings";

interface HeroSectionProps {
  listings?: GuestyListing[];
}

export default function HeroSection({ listings }: HeroSectionProps) {
  // Find the specific aerial villa photo from the Full Estate listing
  const HERO_PHOTO_ID = "2833d32f-6cd7-42-HKYrT";
  const heroImage = (() => {
    if (!listings) return undefined;
    for (const listing of listings) {
      const match = listing.pictures?.find((p) => p.original?.includes(HERO_PHOTO_ID));
      if (match) return match.original;
    }
    return listings[0]?.pictures?.[0]?.original;
  })();

  return (
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
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
            className="inline-block px-8 py-3 bg-accent text-accent-foreground font-sans text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors rounded-full"
          >
            Inquire
          </Link>
          <Link
            to="/villas"
            className="inline-block px-8 py-3 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors rounded-full"
          >
            Explore the Estate
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
