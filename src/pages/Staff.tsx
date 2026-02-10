import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import PageNavArrows, { estatePages, getPageNav } from "@/components/PageNavArrows";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const { prev, next } = getPageNav(estatePages, "/staff");

const staffMembers = [
  { name: "Your Concierge", role: "Head Concierge", language: "English & Spanish", description: "Your dedicated concierge is born and raised in the region, knows everything and everyone. They personally greet every guest upon arrival and see them off at departure, while maintaining your privacy during the stay. Adventures, dining, wellness, transportation — they arrange it all." },
  { name: "Ricardo", role: "Private Chef", language: "English & Spanish", description: "The lead chef and heart of the culinary experience. Ricardo crafts every meal from the freshest local ingredients — from morning juices to fire-lit dinners. He loves discussing menus, dietary needs, and creating surprise celebrations." },
  { name: "Crethell", role: "Private Chef", language: "Spanish (Google Translate works great)", description: "Ricardo's partner in the kitchen. Crethell brings deep expertise in traditional Mexican coastal cuisine and ensures every detail — from presentation to timing — is perfect." },
  { name: "Angy", role: "Daily Housekeeping", language: "Spanish (Google Translate works great)", description: "Angy ensures every space is impeccable — daily housekeeping, fresh linens, and the small details that make the villas feel like a five-star hotel." },
  { name: "Paco", role: "Caretaker & Grounds", language: "Spanish (Google Translate works great)", description: "Paco maintains the property, pool, gardens, and beach setup. He handles beach chairs, umbrellas, bonfire preparation, and everything behind the scenes. The quiet force ensuring everything is always ready." },
];

const includedServices = [
  "Daily housekeeping",
  "Dedicated house manager & concierge",
  "Arrival coordination & personal greeting",
  "Ongoing guest support throughout your stay",
  "Event & experience coordination",
  "Direct access to your team at all times",
  "4×4 Polaris UTV transportation",
  "Beach setup & maintenance",
];

export default function Staff() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-primary-foreground px-4 w-full max-w-6xl mx-auto">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">The Estate</p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1"><PageNavArrows prev={prev} next={undefined} variant="hero" /></div>
            <h1 className="font-serif text-5xl md:text-7xl font-light">Your Team</h1>
            <div className="flex-1"><PageNavArrows prev={undefined} next={next} variant="hero" /></div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28">
        <div className="container max-w-5xl">
          <SectionHeading
            eyebrow="Hosted, Not Rented"
            title="Your Dedicated Team"
            description="Every guest is personally received. Your team handles every detail — from arrival coordination to ongoing support throughout your stay."
          />

          <div className="space-y-16 mt-16">
            {staffMembers.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
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

      {/* Always Included */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container max-w-4xl text-center">
          <SectionHeading eyebrow="Always Included" title="The Sempre Avanti Standard" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 text-left">
            {includedServices.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" strokeWidth={2} />
                <span className="text-sm font-sans text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Nav */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container max-w-4xl">
          <PageNavArrows prev={prev} next={next} variant="bottom" />
        </div>
      </section>
    </Layout>
  );
}
