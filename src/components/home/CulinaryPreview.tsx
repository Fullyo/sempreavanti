import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import foodImg from "@/assets/food1.jpeg";

export default function CulinaryPreview() {
  return (
    <section className="py-20 md:py-28" aria-label="Culinary experience">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:order-2"
          >
            <div className="relative">
              <img
                src={foodImg}
                alt="Private chef preparing a gourmet meal at Casa Sempre Avanti"
                className="w-full h-[450px] object-cover rounded-tl-[80px] rounded-br-[80px]"
                loading="lazy"
              />
              <div className="absolute -top-3 -left-3 w-20 h-20 border-2 border-golden rounded-tl-[40px] opacity-40" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:order-1"
          >
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-golden mb-3 block">
              Culinary Experience
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight mb-6 text-foreground">
              Every Meal, a Celebration
            </h2>
            <p className="text-base font-sans text-muted-foreground leading-relaxed mb-4">
              Your private chefs Ricardo and Crethell craft every meal from the freshest local ingredients — from sunrise juices to fire-lit beachfront dinners. Menus are fully customizable around your group's tastes and dietary needs.
            </p>
            <ul className="space-y-2 mb-8">
              {[
                "Chilaquiles, enchiladas & fresh tropical fruits",
                "Catch-of-the-day ceviche & aguachile",
                "Wood-fired pizza nights by the fire pit",
                "Sunset margarita ritual every evening",
              ].map((item) => (
                <li key={item} className="text-sm font-sans text-muted-foreground flex items-start gap-2">
                  <span className="text-golden mt-0.5 text-lg leading-none">·</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/chef"
              className="inline-block px-8 py-3 bg-accent text-accent-foreground font-sans text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors rounded-full"
            >
              View Full Menu
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
