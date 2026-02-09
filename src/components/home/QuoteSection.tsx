import { motion } from "framer-motion";

export default function QuoteSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-card to-cream relative overflow-hidden">
      {/* Subtle botanical pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 10 C40 10 50 30 40 50 C30 30 40 10 40 10Z' fill='%23000' opacity='0.5'/%3E%3Cpath d='M20 40 C20 40 40 35 50 50 C30 45 20 40 20 40Z' fill='%23000' opacity='0.3'/%3E%3C/svg%3E")`,
        backgroundSize: '80px 80px',
      }} />
      <div className="container max-w-4xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-golden text-6xl font-serif leading-none block mb-6">"</span>
          <blockquote className="font-serif text-2xl md:text-4xl lg:text-5xl font-light leading-snug text-foreground italic">
            Sempre Avanti — Always Forward. A place where the rhythm of the ocean sets the pace, and every guest leaves changed.
          </blockquote>
          <div className="mt-8 w-16 h-px bg-golden mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}
