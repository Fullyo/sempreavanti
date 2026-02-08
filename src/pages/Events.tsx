import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const eventTypes = [
  {
    title: "Beach Ceremonies",
    description: "Exchange vows on your own private beach with the Pacific as your backdrop. Intimate or grand — the setting adapts to your vision.",
  },
  {
    title: "Fire Pit Evenings",
    description: "Gather around the fire pit as the stars come out. Post-ceremony celebrations, rehearsal dinners, or simply unforgettable evenings with your group.",
  },
  {
    title: "Long-Table Beachfront Dinners",
    description: "Chef-prepared multi-course dinners served at a beautifully set long table on the beach. Fire-lit, ocean-side, unforgettable.",
  },
  {
    title: "Retreats & Workshops",
    description: "The estate is perfectly suited for wellness retreats, creative workshops, corporate offsites, and transformational gatherings.",
  },
  {
    title: "Bachelorette & Birthday Celebrations",
    description: "Dedicated bartender, custom menus, adventure days, and beachside lounging — we create celebrations that feel effortless.",
  },
  {
    title: "Family Gatherings",
    description: "Five bedrooms, flexible sleeping configurations, and a full team to take care of everything. Multi-generational groups feel right at home.",
  },
];

export default function Events() {
  return (
    <Layout>
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-primary">
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Celebrate</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light">Weddings & Events</h1>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Your Private Venue"
            title="Where Every Celebration Belongs"
            description="Sempre Avanti isn't just a place to host an event — it's a place where events feel like they were always meant to happen. The beach, the fire pit, the long table under the stars — every space is a venue."
          />
        </div>
      </section>

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
                className="bg-card p-8"
              >
                <div className="h-48 bg-muted mb-6 flex items-center justify-center">
                  <span className="text-xs font-sans text-muted-foreground">Event photo placeholder</span>
                </div>
                <h3 className="font-serif text-2xl mb-3">{event.title}</h3>
                <p className="text-sm font-sans text-muted-foreground leading-relaxed">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container max-w-4xl text-center">
          <SectionHeading
            eyebrow="Full Support"
            title="Coordinated by Eno & Team"
            description="From event planning to after-hours catering and dedicated bartender services, your concierge Eno and the full Sempre Avanti team bring your vision to life — so you can simply be present."
            light
          />
          <Link
            to="/contact"
            className="inline-block mt-6 px-10 py-4 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors"
          >
            Plan Your Event
          </Link>
        </div>
      </section>
    </Layout>
  );
}
