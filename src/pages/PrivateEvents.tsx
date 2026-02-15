import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import EventInquiryForm from "@/components/EventInquiryForm";

import estate3 from "@/assets/estate-3.jpeg";
import estate6 from "@/assets/estate-6.jpeg";
import estate7 from "@/assets/estate-7.jpeg";
import estate8 from "@/assets/estate-8.jpeg";
import estate11 from "@/assets/estate-11.jpeg";
import wellnessYoga from "@/assets/wellness-yoga.png";
import food1 from "@/assets/food1.jpeg";
import food3 from "@/assets/food3.jpeg";
import eventBeachfire from "@/assets/event-beachfire.png";
import eventFamily from "@/assets/event-family.png";
import eventBachelorette from "@/assets/event-bachelorette.png";
import privateBeach from "@/assets/private-beach.png";

const eventTypes = [
  { title: "Retreats & Workshops", description: "The estate is perfectly suited for wellness retreats, creative workshops, corporate offsites, and transformational gatherings. Five bedrooms, dedicated staff, and total privacy.", image: wellnessYoga },
  { title: "Corporate Offsites", description: "Escape the conference room. Strategy sessions on the terrace, team dinners on the beach, and activities that actually bond your team — from surfing to sunset sailing.", image: estate7 },
  { title: "Bachelorette & Birthday", description: "Dedicated bartender, custom menus, adventure-packed days, and beachside lounging. We create celebrations that feel effortless and unforgettable.", image: eventBachelorette },
  { title: "Family Gatherings", description: "Five bedrooms, flexible sleeping configurations, and a full team to take care of everything. Multi-generational groups feel right at home with activities for every age.", image: eventFamily },
  { title: "Beach Fire Evenings", description: "Gather around the beach fire as the stars come out. Post-dinner celebrations, storytelling nights, or simply unforgettable evenings with your group under the Riviera sky.", image: eventBeachfire },
  { title: "Long-Table Beachfront Dinners", description: "Chef-prepared multi-course dinners served at a beautifully set long table on the beach. Fire-lit, ocean-side, and unforgettable.", image: food1 },
];

const venueSpaces = [
  { label: "Private Beach", desc: "250 feet of secluded beachfront for ceremonies, dinners, bonfires, and morning yoga.", image: estate3 },
  { label: "Beach Fire", desc: "Gather around the beach fire with built-in seating overlooking the Pacific. Perfect for evening gatherings.", image: eventBeachfire },
  { label: "Pool Terraces", desc: "Two infinity pools — one at each villa — with lounging areas and ocean views.", image: estate6 },
  { label: "Beachfront Dining", desc: "Long-table setup on the sand or covered terrace dining with full chef service.", image: food3 },
];

export default function PrivateEvents() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60dvh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img src={estate3} alt="Private estate venue" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
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
                <div className="aspect-video mb-6 rounded-xl overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                </div>
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
                <div className="aspect-video rounded-xl overflow-hidden mb-4">
                  <img src={space.image} alt={space.label} className="w-full h-full object-cover" />
                </div>
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

      {/* CTA Hero Banner */}
      <section className="relative py-20 md:py-28 text-primary-foreground overflow-hidden">
        <img src={privateBeach} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 container max-w-4xl text-center">
          <SectionHeading
            eyebrow="Let's Plan Together"
            title="Tell Us About Your Event"
            description="Share your vision — group size, dates, and style. We'll show you how the estate can make it happen."
            light
          />
          <p className="mt-6 text-xs font-sans text-primary-foreground/60 italic">
            Event planners and coordinators — we'd love to work with you. Get in touch above and let's bring your client's vision to life.
          </p>
        </div>
      </section>
    </Layout>
  );
}
