import { motion } from "framer-motion";

export default function QuoteSection() {
  return (
    <section className="py-20 md:py-32 bg-card">
      <div className="container max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-accent text-6xl font-serif leading-none block mb-6">"</span>
          <blockquote className="font-serif text-2xl md:text-4xl lg:text-5xl font-light leading-snug text-foreground italic">
            Sempre Avanti — Always Forward. A place where the rhythm of the ocean sets the pace, and every guest leaves changed.
          </blockquote>
          <div className="mt-8 w-16 h-px bg-accent mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}
