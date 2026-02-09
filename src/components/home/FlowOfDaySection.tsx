import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GuestyListing } from "@/hooks/useGuestyListings";

import foodImg from "@/assets/food3.jpeg";
import weddingImg from "@/assets/wedding2.png";
import atvImg from "@/assets/atv.jpeg";

const flowItems = [
  {
    title: "Wellness",
    subtitle: "Morning Flow",
    description: "Yoga, breathwork, and beachside meditation to start the day.",
    path: "/wellness",
    staticImage: undefined as string | undefined,
    apiPhotoCaption: "Pool with ocean view",
  },
  {
    title: "Private Dining",
    subtitle: "Chef-Crafted",
    description: "Fire-lit dinners, sunset margaritas, and wood-fired pizza nights.",
    path: "/chef",
    staticImage: foodImg,
  },
  {
    title: "Adventures",
    subtitle: "Ocean & Land",
    description: "Surf, sail, fish, and explore the Riviera Nayarit coast.",
    path: "/experiences",
    staticImage: atvImg,
  },
  {
    title: "Celebrations",
    subtitle: "Your Venue",
    description: "Weddings, retreats, and gatherings on your private beach.",
    path: "/events",
    staticImage: weddingImg,
  },
  {
    title: "Transportation",
    subtitle: "UTV & Transfers",
    description: "Polaris UTVs and private Suburban transfers from the airport.",
    path: "/transportation",
    staticImage: undefined as string | undefined,
  },
  {
    title: "Location",
    subtitle: "Riviera Nayarit",
    description: "5 min to Sayulita, 20–25 min to Punta de Mita — the best of the coast.",
    path: "/location",
    staticImage: undefined as string | undefined,
  },
];

// Alternating organic corner styles
const cornerStyles = [
  "rounded-tl-[60px] rounded-br-[60px]",
  "rounded-tr-[60px] rounded-bl-[60px]",
  "rounded-tl-[40px] rounded-tr-[40px]",
  "rounded-bl-[60px] rounded-tr-[60px]",
  "rounded-tl-[60px] rounded-bl-[40px]",
  "rounded-br-[60px] rounded-tl-[40px]",
];

interface FlowOfDaySectionProps {
  listings?: GuestyListing[];
}

export default function FlowOfDaySection({ listings }: FlowOfDaySectionProps) {
  const allPictures = listings?.flatMap((l) => l.pictures || []) || [];

  return (
    <section className="py-20 md:py-32" aria-label="Experiences and services">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <span className="text-xs font-sans uppercase tracking-[0.3em] mb-3 block text-turquoise">
            Your Stay
          </span>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light leading-tight text-foreground">
            Every Moment, Curated
          </h2>
          <p className="mt-4 text-base md:text-lg font-sans font-light leading-relaxed text-muted-foreground">
            From sunrise yoga to fire-lit dinners, every hour flows with intention. You don't plan — you simply arrive.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {flowItems.map((item, i) => {
            const photo = item.staticImage || allPictures[i + 2]?.original;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <Link to={item.path} className={`block group relative overflow-hidden h-[380px] ${cornerStyles[i]}`}>
                  {photo ? (
                    <img
                      src={photo}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-primary" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
                    <span className="text-xs font-sans uppercase tracking-[0.3em] opacity-70 block mb-2">
                      {item.subtitle}
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl mb-2 group-hover:text-golden transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm font-sans opacity-80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
