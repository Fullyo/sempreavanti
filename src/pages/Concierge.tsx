import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const staff = [
  {
    name: "Eno",
    role: "Head Concierge",
    description: "Born and raised in Sayulita, Eno knows everything and everyone. He personally greets every guest upon arrival and sees them off at departure, while maintaining your privacy during the stay. Adventures, dining, wellness, transportation — Eno arranges it all.",
  },
  {
    name: "Ricardo & Crethell",
    role: "Private Chefs",
    description: "The heart of the culinary experience. Ricardo and Crethell craft every meal from the freshest local ingredients — from morning juices to fire-lit dinners on the beach.",
  },
  {
    name: "Angy",
    role: "Daily Housekeeping",
    description: "Angy ensures every space is impeccable — daily housekeeping, fresh linens, and the small details that make the villas feel like a five-star hotel.",
  },
  {
    name: "Paco",
    role: "Caretaker & Grounds",
    description: "Paco maintains the property, pool, gardens, and beach setup. He's the quiet force behind the scenes, ensuring everything is always ready for you.",
  },
];

export default function Concierge() {
  return (
    <Layout>
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-primary">
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Your Team</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light">Concierge & Staff</h1>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Hosted, Not Rented"
            title="You're Not Checking In — You're Being Hosted"
            description="At Sempre Avanti, every guest is personally received. Your dedicated team handles every detail — from arrival coordination to ongoing support throughout your stay. You have direct access at all times."
          />
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {staff.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-card p-8"
              >
                <div className="h-64 bg-muted mb-6 flex items-center justify-center">
                  <span className="text-xs font-sans text-muted-foreground">{person.name} photo placeholder</span>
                </div>
                <span className="text-xs font-sans uppercase tracking-widest text-accent mb-1 block">{person.role}</span>
                <h3 className="font-serif text-3xl mb-3">{person.name}</h3>
                <p className="text-sm font-sans text-muted-foreground leading-relaxed">{person.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container max-w-4xl text-center">
          <SectionHeading eyebrow="Always Included" title="The Sempre Avanti Standard" light />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 text-left">
            {[
              "Daily housekeeping",
              "Dedicated house manager & concierge",
              "Arrival coordination & personal greeting",
              "Ongoing guest support throughout your stay",
              "Event & experience coordination",
              "Direct access to your team at all times",
              "4×4 Polaris UTV transportation",
              "Beach setup & maintenance",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-accent mt-0.5">✓</span>
                <span className="text-sm font-sans opacity-90">{item}</span>
              </div>
            ))}
          </div>
          <Link
            to="/contact"
            className="inline-block mt-12 px-10 py-4 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </Layout>
  );
}
