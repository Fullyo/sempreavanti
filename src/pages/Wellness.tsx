import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const wellnessOfferings = [
  {
    title: "Daily Wellness Practice",
    time: "8:30 – 9:30 AM",
    description: "Start each morning with a guided session on the beach or poolside. Your instructor tailors the practice to the group — yoga, stretching, breathwork, or light movement. Every day is different, every session is yours.",
  },
  {
    title: "Personal Trainer",
    description: "A certified personal trainer is available to come on-site for individual or group sessions. Whether you want to maintain your routine or try something new, the beach is your gym.",
  },
  {
    title: "Massage & Bodywork",
    description: "In-house massage services with experienced therapists. Deep tissue, relaxation, or sports massage — scheduled at your convenience, in the comfort of the villa or beachside.",
  },
  {
    title: "Sound Bath & Healing",
    description: "Immersive sound healing sessions using crystal bowls and traditional instruments. Held on the beach at sunset or under the stars — a transformative group experience.",
  },
];

export default function Wellness() {
  return (
    <Layout>
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-primary">
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Mind · Body · Spirit</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light">Wellness</h1>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Intentional Downtime"
            title="Wellness Is Woven into Every Day"
            description="At Sempre Avanti, wellness isn't an add-on — it's part of the rhythm. From sunrise movement to evening sound healing, every practice is set against the backdrop of the Pacific."
          />
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {wellnessOfferings.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-card p-8"
              >
                <h3 className="font-serif text-2xl mb-2">{item.title}</h3>
                {item.time && (
                  <span className="text-xs font-sans uppercase tracking-widest text-accent mb-3 block">{item.time}</span>
                )}
                <p className="text-sm font-sans text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Spaces */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container max-w-4xl text-center">
          <SectionHeading
            eyebrow="The Spaces"
            title="Your Practice, Your Setting"
            description="The beachfront, poolside terrace, and dedicated practice areas provide the perfect backdrop for morning flows, meditation, and healing work. The ocean is always present."
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {["Beachfront", "Pool Terrace", "Garden Area"].map((space) => (
              <div key={space} className="bg-primary-foreground/10 h-48 flex items-center justify-center">
                <span className="text-sm font-sans opacity-60">{space} photo placeholder</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container text-center">
          <p className="font-serif text-3xl md:text-4xl mb-6">All Wellness Services by Inquiry</p>
          <p className="text-sm font-sans text-muted-foreground mb-8">Pricing and scheduling arranged through your concierge.</p>
          <Link
            to="/contact"
            className="inline-block px-10 py-4 bg-accent text-accent-foreground font-sans text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors"
          >
            Inquire Now
          </Link>
        </div>
      </section>
    </Layout>
  );
}
