import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const yogaProviders = [
  { name: "Narayani", style: "Vinyasa & Restorative", note: "Beachfront sessions tailored to the group's energy" },
  { name: "Paraiso Yoga", style: "Group & Private Classes", note: "Local studio offering on-site sessions" },
  { name: "Vanessa", style: "Ashtanga & Hatha", note: "Deep practice for experienced yogis" },
  { name: "Hotelito de los Sueños", style: "Yoga Retreat Partnership", note: "Extended retreat programming available" },
];

const massageProviders = [
  { name: "Nirvanna Spa", services: "Shiatsu, Swedish, Aromatherapy, Deep Tissue", note: "In-villa or beachside", price: "$1,500 MXN / person" },
  { name: "Bendita Waxing Studio & Spa", services: "Relaxation massage, facials, beauty treatments", note: "Full-service spa visits" },
  { name: "Buddha Gallery Boutique Spa", services: "Holistic bodywork, energy healing", note: "Artisan spa experience" },
];

export default function Wellness() {
  return (
    <Layout>
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <PhotoPlaceholder label="Beachside Wellness" className="absolute inset-0 !aspect-auto opacity-30" />
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

      {/* Yoga */}
      <section className="pb-20 md:pb-28">
        <div className="container max-w-5xl">
          <SectionHeading eyebrow="8:30 – 9:30 AM" title="Daily Yoga & Movement" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-base font-sans text-muted-foreground leading-relaxed mb-4">
                Start each morning with a guided session on the beach or poolside. Your instructor tailors the practice to the group — yoga, stretching, breathwork, or light movement. Every day is different, every session is yours.
              </p>
              <p className="text-sm font-sans font-medium text-accent mb-6">Private Yoga — $2,500 MXN · 1 hr 15 min</p>
              <h4 className="font-serif text-xl mb-4">Our Instructors</h4>
              <div className="space-y-4">
                {yogaProviders.map((p) => (
                  <div key={p.name} className="border-l-2 border-accent pl-4">
                    <h5 className="font-sans text-sm font-medium">{p.name}</h5>
                    <p className="text-xs font-sans text-accent">{p.style}</p>
                    <p className="text-xs font-sans text-muted-foreground">{p.note}</p>
                  </div>
                ))}
              </div>
            </div>
            <PhotoPlaceholder label="Morning Yoga" aspectRatio="portrait" />
          </div>
        </div>
      </section>

      {/* Pilates & Training */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <PhotoPlaceholder label="Personal Training" aspectRatio="square" />
            <div>
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent mb-3 block">Fitness</span>
              <h2 className="font-serif text-4xl font-light mb-6">Pilates & Personal Training</h2>
              <p className="text-base font-sans text-muted-foreground leading-relaxed mb-4">
                <strong className="font-medium text-foreground">Shea</strong> — a certified personal trainer and Pilates instructor — offers personalized mat classes, outdoor workouts, and nutritional advice. Sessions are held poolside, on the beach, or in the garden.
              </p>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed mb-4">
                Whether you want to maintain your routine, try something new, or design a group fitness experience, Shea adapts to your goals.
              </p>
              <div className="space-y-2 mt-4">
                <p className="text-sm font-sans font-medium text-accent">Pilates — $1,000 MXN / person <span className="text-muted-foreground font-normal">(min 2 people)</span></p>
                <p className="text-sm font-sans font-medium text-accent">Personal Training — $2,000 MXN / person <span className="text-muted-foreground font-normal">(weights included)</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Massage */}
      <section className="py-16 md:py-24">
        <div className="container max-w-5xl">
          <SectionHeading eyebrow="Bodywork" title="Massage & Spa" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {massageProviders.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card p-6"
              >
                <PhotoPlaceholder label={p.name} aspectRatio="video" className="mb-4" />
                <h3 className="font-serif text-xl mb-2">{p.name}</h3>
                <p className="text-xs font-sans text-accent mb-2">{p.services}</p>
                <p className="text-sm font-sans text-muted-foreground">{p.note}</p>
                {p.price && <p className="text-sm font-sans font-medium text-accent mt-2">{p.price}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sound Bath */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-sans uppercase tracking-[0.3em] opacity-70 mb-3 block">Transformative</span>
              <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">Sound Bath & Healing</h2>
              <p className="text-base font-sans font-light leading-relaxed opacity-85 mb-4">
                Immersive sound healing sessions using crystal bowls and traditional instruments. Held on the beach at sunset or under the stars — a transformative group experience that resonates long after the last note fades.
              </p>
              <p className="text-base font-sans font-light leading-relaxed opacity-85 mb-4">
                Perfect for retreat groups, wedding parties, or anyone seeking a deeper connection to the rhythms of the coast.
              </p>
              <p className="text-sm font-sans font-medium opacity-90">$2,500 MXN for up to 5 people · +$500 MXN per additional person</p>
            </div>
            <PhotoPlaceholder label="Sound Healing" className="!aspect-auto h-[400px]" />
          </div>
        </div>
      </section>

      {/* Practice Spaces */}
      <section className="py-16 md:py-24">
        <div className="container max-w-5xl">
          <SectionHeading eyebrow="The Spaces" title="Your Practice, Your Setting" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Beachfront", "Pool Terrace", "Garden Area"].map((space) => (
              <PhotoPlaceholder key={space} label={space} aspectRatio="video" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
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
