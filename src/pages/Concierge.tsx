import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const staff = [
  {
    name: "Eno",
    role: "Head Concierge",
    language: "English & Spanish",
    description: "Born and raised in Sayulita, Eno knows everything and everyone. He personally greets every guest upon arrival and sees them off at departure, while maintaining your privacy during the stay. Adventures, dining, wellness, transportation — Eno arranges it all.",
  },
  {
    name: "Ricardo",
    role: "Private Chef",
    language: "English & Spanish",
    description: "The lead chef and heart of the culinary experience. Ricardo crafts every meal from the freshest local ingredients — from morning juices to fire-lit dinners. He loves discussing menus, dietary needs, and creating surprise celebrations.",
  },
  {
    name: "Crethell",
    role: "Private Chef",
    language: "Spanish (Google Translate works great)",
    description: "Ricardo's partner in the kitchen. Crethell brings deep expertise in traditional Mexican coastal cuisine and ensures every detail — from presentation to timing — is perfect.",
  },
  {
    name: "Angy",
    role: "Daily Housekeeping",
    language: "Spanish (Google Translate works great)",
    description: "Angy ensures every space is impeccable — daily housekeeping, fresh linens, and the small details that make the villas feel like a five-star hotel.",
  },
  {
    name: "Paco",
    role: "Caretaker & Grounds",
    language: "Spanish (Google Translate works great)",
    description: "Paco maintains the property, pool, gardens, and beach setup. He handles beach chairs, umbrellas, bonfire preparation, and everything behind the scenes. The quiet force ensuring everything is always ready.",
  },
];

const included = [
  "Daily housekeeping",
  "Dedicated house manager & concierge",
  "Arrival coordination & personal greeting",
  "Ongoing guest support throughout your stay",
  "Event & experience coordination",
  "Direct access to your team at all times",
  "4×4 Polaris UTV transportation",
  "Beach setup & maintenance",
];

export default function Concierge() {
  return (
    <Layout>
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <PhotoPlaceholder label="Your Team" className="absolute inset-0 !aspect-auto opacity-30" />
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
          <div className="space-y-16">
            {staff.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? "" : ""}`}
              >
                <PhotoPlaceholder
                  label={person.name}
                  aspectRatio="portrait"
                  className={`rounded-tl-[40px] rounded-br-[40px] overflow-hidden ${i % 2 === 1 ? "md:order-2" : ""}`}
                />
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <span className="text-xs font-sans uppercase tracking-widest text-accent mb-1 block">{person.role}</span>
                  <h3 className="font-serif text-3xl md:text-4xl mb-2">{person.name}</h3>
                  <span className="text-xs font-sans text-muted-foreground mb-4 block">{person.language}</span>
                  <p className="text-base font-sans text-muted-foreground leading-relaxed">{person.description}</p>
                </div>
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
            {included.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" strokeWidth={2} />
                <span className="text-sm font-sans opacity-90">{item}</span>
              </div>
            ))}
          </div>
          <Link
            to="/contact"
            className="inline-block mt-12 px-10 py-4 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors rounded-full"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </Layout>
  );
}
