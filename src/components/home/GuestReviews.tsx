import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    quote: "From the moment Eno greeted us to the last sunset margarita, everything was flawless. The chefs, the beach, the privacy — it's the best vacation our family has ever taken.",
    name: "The Martinez Family",
    occasion: "Family Vacation, February 2026",
    rating: 5,
  },
  {
    quote: "We booked Sempre Avanti for our wedding and it exceeded every expectation. Beach ceremony, fire-lit dinner, and a team that made it all look effortless. Our guests are still talking about it.",
    name: "Sarah & James",
    occasion: "Destination Wedding, December 2025",
    rating: 5,
  },
  {
    quote: "As a wellness retreat leader, I need a space that feels intentional. Beachfront yoga, sound healing at sunset, meals that nourish — Sempre Avanti is now our permanent home base.",
    name: "Dr. Vanessa Ríos",
    occasion: "Wellness Retreat, March 2025",
    rating: 5,
  },
  {
    quote: "The UTVs, the surfing, the spearfishing followed by Ricardo cooking our catch for dinner — pure magic. Already planning our return trip.",
    name: "Mike & Friends",
    occasion: "Adventure Trip, January 2026",
    rating: 5,
  },
];

export default function GuestReviews() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-primary/5 via-turquoise/5 to-background" aria-label="Guest reviews">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-xs font-sans uppercase tracking-[0.3em] mb-3 block text-turquoise">
            Guest Stories
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight text-foreground">
            What Our Guests Say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-xl p-8 border-l-4 border-golden"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-golden text-golden"
                    strokeWidth={0}
                  />
                ))}
              </div>
              <blockquote className="font-serif text-lg md:text-xl leading-relaxed text-foreground italic mb-6">
                "{review.quote}"
              </blockquote>
              <div>
                <p className="font-sans text-sm font-medium text-foreground">
                  {review.name}
                </p>
                <p className="font-sans text-xs text-muted-foreground">
                  {review.occasion}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
