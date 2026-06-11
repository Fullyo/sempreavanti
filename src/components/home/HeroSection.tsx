import { Link } from "react-router-dom";
import InquiryDialog from "@/components/InquiryDialog";
import { motion } from "framer-motion";
import heroVilla from "@/assets/hero-villa-new.png";

interface HeroSectionProps {
  listings?: unknown[];
}

export default function HeroSection({ listings }: HeroSectionProps) {

  return (
    <section className="relative h-[100dvh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {heroVilla ? (
        <img
          src={heroVilla}
          alt="Villas Sempre Avanti beachfront"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-[center_60%]"
        />
      ) : (
        <div className="absolute inset-0 bg-primary" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/70" />
      <div className="relative z-10 text-center text-primary-foreground px-4 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xs md:text-sm font-sans uppercase tracking-[0.4em] mb-5 opacity-90 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]"
        >
          Riviera Nayarit · Sayulita
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-light mb-4 [text-shadow:0_2px_20px_rgba(0,0,0,0.45)]"
        >
          Sempre Avanti
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="font-serif text-xl md:text-3xl font-light tracking-wide opacity-95 [text-shadow:0_2px_14px_rgba(0,0,0,0.5)]"
        >
          Secluded beachfront on Patzcuarito Beach
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-6 justify-center"
        >
          <InquiryDialog>
            <button className="inline-block px-7 py-2.5 bg-accent text-accent-foreground font-sans text-xs uppercase tracking-widest font-light hover:bg-accent/90 transition-colors rounded-full">
              Inquire
            </button>
          </InquiryDialog>
          <Link
            to="/villas"
            className="group inline-flex items-center gap-1.5 text-primary-foreground/90 font-sans text-xs uppercase tracking-widest font-light hover:text-primary-foreground transition-colors [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]"
          >
            <span className="border-b border-primary-foreground/40 pb-0.5 group-hover:border-primary-foreground/80 transition-colors">
              Explore the Estate
            </span>
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
