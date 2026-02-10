import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  Sparkles,
  Users,
  Waves,
  Flame,
  Heart,
  Car,
  Wifi,
} from "lucide-react";

const services = [
  { icon: UtensilsCrossed, title: "Private Chef", desc: "Every meal crafted by your dedicated chefs", path: "/chef" },
  { icon: Sparkles, title: "Daily Housekeeping", desc: "Fresh linens, impeccable spaces, every day", path: "/villas" },
  { icon: Users, title: "Personal Concierge", desc: "Your dedicated concierge arranges everything", path: "/villas" },
  { icon: Waves, title: "Beach & Pool", desc: "Private beach and infinity pool, steps away", path: "/villas" },
  { icon: Flame, title: "Fire Pit", desc: "Beachside bonfires under the stars", path: "/villas" },
  { icon: Heart, title: "Wellness", desc: "Yoga, massage, sound healing on the beach", path: "/wellness" },
  { icon: Car, title: "UTV Transportation", desc: "Polaris UTVs to explore the coast", path: "/location" },
  { icon: Wifi, title: "WiFi & AC", desc: "Stay connected and comfortable throughout", path: "/villas" },
];

export default function ServicesGrid() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-card to-background" aria-label="Included services">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-xs font-sans uppercase tracking-[0.3em] mb-3 block text-golden">
            All Included
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight text-foreground">
            Everything You Need, Nothing You Don't
          </h2>
          <p className="mt-4 text-base font-sans font-light leading-relaxed text-muted-foreground">
            Every stay includes a full team, private chef, daily housekeeping, and more. No resort fees. No hidden charges.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link
                to={service.path}
                className="block text-center p-6 rounded-xl border border-transparent hover:border-golden/30 hover:shadow-[0_8px_30px_-12px_hsl(42_85%_55%/0.3)] transition-all duration-300 group"
              >
                <service.icon
                  className="w-8 h-8 mx-auto mb-4 text-golden group-hover:scale-110 transition-transform"
                  strokeWidth={1.2}
                />
                <h3 className="font-serif text-lg mb-1 group-hover:text-golden transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs font-sans text-muted-foreground leading-relaxed">
                  {service.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
