import { motion } from "framer-motion";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  light?: boolean;
}

export default function SectionHeading({ eyebrow, title, description, className = "", light }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className={`text-center max-w-3xl mx-auto mb-12 md:mb-16 ${className}`}
    >
      {eyebrow && (
        <span className={`text-xs font-sans uppercase tracking-[0.3em] mb-3 block ${light ? "opacity-70" : "text-accent"}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`font-serif text-3xl md:text-5xl lg:text-6xl font-light leading-tight ${light ? "" : "text-foreground"}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base md:text-lg font-sans font-light leading-relaxed ${light ? "opacity-80" : "text-muted-foreground"}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
