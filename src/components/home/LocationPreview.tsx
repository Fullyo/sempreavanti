import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GuestyListing } from "@/hooks/useGuestyListings";

interface LocationPreviewProps {
  listings?: GuestyListing[];
}

export default function LocationPreview({ listings }: LocationPreviewProps) {
  const photo = listings?.[2]?.pictures?.[0]?.original;

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
            {photo ? (
              <div className="relative">
                <img
                  src={photo}
                  alt="Aerial view of Riviera Nayarit coastline near Sayulita"
                  className="w-full h-[450px] object-cover rounded-tr-[80px] rounded-bl-[80px]"
                  loading="lazy"
                />
                <div className="absolute -bottom-3 -right-3 w-24 h-24 border-2 border-turquoise rounded-br-[40px] opacity-40" />
              </div>
            ) : (
              <div className="w-full h-[450px] overflow-hidden rounded-tr-[80px] rounded-bl-[80px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2896!2d-105.4640904!3d20.847732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x84211561ab8a6c1b%3A0xe20445bb3abc738a!2sCasa%20Sempre%20Avanti!5e0!3m2!1sen!2smx!4v1700000000000!5m2!1sen!2smx"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Casa Sempre Avanti location"
                />
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-jungle mb-3 block">
              Riviera Nayarit
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight mb-6 text-foreground">
              Between Sayulita & San Pancho
            </h2>
            <p className="text-base font-sans text-muted-foreground leading-relaxed mb-4">
              Sempre Avanti sits on a private stretch of Pacific coastline, minutes from the vibrant surf town of Sayulita and the artistic village of San Pancho. Connected by Polaris UTVs, you're never more than 10 minutes from world-class dining, shopping, and nightlife.
            </p>
            <p className="text-base font-sans text-muted-foreground leading-relaxed mb-8">
              Punta de Mita, the Four Seasons, and the St. Regis are a short drive south. The famous La Cruz Sunday Market is 20 minutes away. Private yet perfectly connected.
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
