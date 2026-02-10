import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import patzcuaritoImg from "@/assets/patzcuarito.png";

export default function LocationPreview() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-background via-card to-background" aria-label="Location preview">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              <img
                src={patzcuaritoImg}
                alt="Aerial view of Patzcuarito coastline along the Riviera Nayarit"
                className="w-full h-[450px] object-cover rounded-tr-[80px] rounded-bl-[80px]"
                loading="lazy"
              />
              <div className="absolute -bottom-3 -right-3 w-24 h-24 border-2 border-turquoise rounded-br-[40px] opacity-40" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-jungle mb-3 block">
              Patzcuarito, Riviera Nayarit
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight mb-6 text-foreground">
              Between Sayulita & Punta de Mita
            </h2>
            <p className="text-base font-sans text-muted-foreground leading-relaxed mb-4">
              Nestled in the private community of Patzcuarito, Sempre Avanti sits on a secluded stretch of Pacific coastline just minutes from Sayulita. Connected by Polaris UTVs, you're just 5 minutes from Sayulita's surf, dining, and nightlife — with Punta de Mita and the Four Seasons 25 minutes south.
            </p>
            <p className="text-base font-sans text-muted-foreground leading-relaxed mb-8">
              The La Cruz Sunday Market is a 30-minute drive. San Pancho is 15 minutes north through Sayulita. A private beachfront retreat with the entire Riviera Nayarit at your fingertips.
            </p>
            <Link
              to="/location"
              className="inline-block px-8 py-3 bg-jungle text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-jungle/90 transition-colors rounded-full"
            >
              Explore the Area
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
