import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { motion } from "framer-motion";
import EventInquiryForm from "@/components/EventInquiryForm";

import estate6 from "@/assets/estate-6.jpeg";

const eventTypes = [
  { title: "Retreats & Workshops", description: "The estate is perfectly suited for wellness retreats, creative workshops, corporate offsites, and transformational gatherings. Five bedrooms, dedicated staff, and total privacy." },
  { title: "Corporate Offsites", description: "Escape the conference room. Strategy sessions on the terrace, team dinners on the beach, and activities that actually bond your team — from surfing to sunset sailing." },
  { title: "Bachelorette & Birthday", description: "Dedicated bartender, custom menus, adventure-packed days, and beachside lounging. We create celebrations that feel effortless and unforgettable." },
  { title: "Family Gatherings", description: "Five bedrooms, flexible sleeping configurations, and a full team to take care of everything. Multi-generational groups feel right at home with activities for every age." },
  { title: "Fire Pit Evenings", description: "Gather around the fire pit as the stars come out. Post-dinner celebrations, storytelling nights, or simply unforgettable evenings with your group under the Riviera sky." },
  { title: "Long-Table Beachfront Dinners", description: "Chef-prepared multi-course dinners served at a beautifully set long table on the beach. Fire-lit, ocean-side, and unforgettable." },
];

const venueSpaces = [
  { label: "Private Beach", desc: "250 feet of secluded beachfront for ceremonies, dinners, bonfires, and morning yoga." },
  { label: "Fire Pit", desc: "Sunken fire pit with built-in seating overlooking the Pacific. Perfect for evening gatherings." },
  { label: "Pool Terraces", desc: "Two infinity pools — one at each villa — with lounging areas and ocean views." },
  { label: "Beachfront Dining", desc: "Long-table setup on the sand or covered terrace dining with full chef service." },
];

export default function PrivateEvents() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <PhotoPlaceholder label="Private Events" className="absolute inset-0 !aspect-auto opacity-30" />
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Celebrations</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light">Private Events</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Every Gathering, Elevated"
            title="Your Private Venue on the Pacific"
            description="Sempre Avanti isn't just a place to host an event — it's a place where events feel like they were always meant to happen. A private beach, fire pit, infinity pools, and a full team to bring any vision to life."
          />
        </div>
      </section>

      {/* Event Types */}
      <section className="pb-20 md:pb-28">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventTypes.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card p-8 rounded-xl"
              >
                <PhotoPlaceholder label={event.title} aspectRatio="video" className="mb-6 rounded-xl overflow-hidden" />
                <h3 className="font-serif text-2xl mb-3">{event.title}</h3>
                <p className="text-sm font-sans text-muted-foreground leading-relaxed">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue Spaces */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container max-w-6xl">
          <SectionHeading
            eyebrow="Your Venues"
            title="Every Space Is a Stage"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {venueSpaces.map((space, i) => (
              <motion.div
                key={space.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <PhotoPlaceholder label={space.label} aspectRatio="video" className="rounded-xl overflow-hidden mb-4" />
                <h3 className="font-serif text-xl mb-1">{space.label}</h3>
                <p className="text-sm font-sans text-muted-foreground">{space.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Full Support"
            title="Coordinated by Your Team"
            description="From event planning to after-hours catering and dedicated bartender services, your concierge and the full Sempre Avanti team bring your vision to life — so you can simply be present."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 md:py-28 text-primary-foreground overflow-hidden">
        <img src={estate6} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 container max-w-4xl text-center">
          <SectionHeading
            eyebrow="Let's Plan Together"
            title="Tell Us About Your Event"
            description="Share your vision — group size, dates, and style. We'll show you how the estate can make it happen."
            light
          />
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl text-center mb-12">
          <p className="text-xs font-sans uppercase tracking-[0.3em] text-accent mb-3">Get in Touch</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light mb-4">Let's Bring It to Life</h2>
          <p className="text-base font-sans text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Tell us what you're envisioning — our events team will take it from there.
          </p>
        </div>
        <EventInquiryForm type="event" />
      </section>

      {/* Organizer note */}
      <section className="pb-20 md:pb-28">
        <div className="container max-w-3xl text-center">
          <p className="text-sm font-sans text-muted-foreground italic leading-relaxed">
            Are you a planner or coordinator looking for a private venue? We love collaborating with event professionals — reach out and let's create something extraordinary together.
          </p>
        </div>
      </section>
    </Layout>
  );
}
