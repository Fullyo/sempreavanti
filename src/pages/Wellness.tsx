import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PageNavArrows, { estatePages, getPageNav } from "@/components/PageNavArrows";
import { motion } from "framer-motion";
import InquiryDialog from "@/components/InquiryDialog";


import yogaImg from "@/assets/wellness-yoga.png";
import soundbathImg from "@/assets/wellness-soundbath.jpeg";
import nirvannaImg from "@/assets/wellness-nirvanna.png";
import benditaImg from "@/assets/wellness-bendita.jpeg";
import buddhaImg from "@/assets/wellness-buddha.jpg";
import massagesImg from "@/assets/wellness-massages.png";

// Estate photos for practice spaces
import estate3 from "@/assets/estate-3.jpeg";  // beachfront
import estate6 from "@/assets/estate-6.jpeg";  // pool terrace
import estate9 from "@/assets/estate-9.jpeg";  // garden

const { prev, next } = getPageNav(estatePages, "/wellness");

const yogaProviders = [
  { name: "Narayani", style: "Vinyasa & Restorative", note: "Beachfront sessions tailored to the group's energy" },
  { name: "Paraiso Yoga", style: "Group & Private Classes", note: "Local studio offering on-site sessions" },
  { name: "Vanessa", style: "Ashtanga & Hatha", note: "Deep practice for experienced yogis" },
  { name: "Hotelito de los Sueños", style: "Yoga Retreat Partnership", note: "Extended retreat programming available" },
];

const massageProviders = [
  { name: "Nirvanna Spa", services: "Shiatsu, Swedish, Aromatherapy, Deep Tissue", note: "In-villa or beachside", img: nirvannaImg },
  { name: "Bendita Waxing Studio & Spa", services: "Relaxation massage, facials, beauty treatments", note: "Full-service spa visits", img: benditaImg },
  { name: "Buddha Gallery Boutique Spa", services: "Holistic bodywork, energy healing", note: "Artisan spa experience", img: buddhaImg },
];

const practiceSpaces = [
  { label: "Beachfront", img: estate3 },
  { label: "Pool Terrace", img: estate6 },
  { label: "Garden Area", img: estate9 },
];

export default function Wellness() {
  return (
    <Layout>
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-[hsl(var(--primary))]">
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-primary-foreground px-4 w-full max-w-6xl mx-auto">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">The Estate</p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1"><PageNavArrows prev={prev} next={undefined} variant="hero" /></div>
            <h1 className="font-serif text-5xl md:text-7xl font-light">Wellness</h1>
            <div className="flex-1"><PageNavArrows prev={undefined} next={next} variant="hero" /></div>
          </div>
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

      {/* Yoga, Pilates & Personal Training */}
      <section className="pb-20 md:pb-28">
        <div className="container max-w-5xl">
          <SectionHeading eyebrow="8:30 – 9:30 AM" title="Yoga, Pilates & Personal Training" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-base font-sans text-muted-foreground leading-relaxed mb-4">
                Start each morning with a guided session on the beach or poolside. Your instructor tailors the practice to the group — yoga, pilates, stretching, breathwork, or light movement. Every day is different, every session is yours.
              </p>
              <p className="text-base font-sans text-muted-foreground leading-relaxed mb-6">
                <strong className="font-medium text-foreground">Shea</strong> — a certified personal trainer and Pilates instructor — offers personalized mat classes, outdoor workouts, and nutritional advice. Whether you want to maintain your routine, try something new, or design a group fitness experience, Shea adapts to your goals.
              </p>
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
            <img src={yogaImg} alt="Morning Yoga" className="w-full aspect-[3/4] object-cover rounded-tl-[40px] rounded-br-[40px]" />
          </div>
        </div>
      </section>

      {/* Massages at Home */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <img src={massagesImg} alt="In-villa massages" className="w-full aspect-square object-cover object-top rounded-tr-[40px] rounded-bl-[40px]" />
            <div>
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent mb-3 block">Bodywork</span>
              <h2 className="font-serif text-4xl font-light mb-6">Massages at Home</h2>
              <p className="text-base font-sans text-muted-foreground leading-relaxed mb-4">
                Professional massage therapists come directly to the estate — poolside, on the terrace, or beachfront. Deep tissue, Swedish, aromatherapy, and more, all without leaving the property.
              </p>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                Arrange group sessions for your entire party or enjoy a private treatment tailored to your preferences. Your concierge handles all the scheduling.
              </p>
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
                className="bg-card p-6 rounded-xl"
              >
                <img src={p.img} alt={p.name} className="w-full aspect-video object-cover mb-4 rounded-xl" />
                <h3 className="font-serif text-xl mb-2">{p.name}</h3>
                <p className="text-xs font-sans text-accent mb-2">{p.services}</p>
                <p className="text-sm font-sans text-muted-foreground">{p.note}</p>
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
              <p className="text-base font-sans font-light leading-relaxed opacity-85">
                Perfect for retreat groups, wedding parties, or anyone seeking a deeper connection to the rhythms of the coast.
              </p>
            </div>
            <img src={soundbathImg} alt="Sound Healing" className="w-full h-[400px] object-cover rounded-lg" />
          </div>
        </div>
      </section>

      {/* Practice Spaces */}
      <section className="py-16 md:py-24">
        <div className="container max-w-5xl">
          <SectionHeading eyebrow="The Spaces" title="Your Practice, Your Setting" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {practiceSpaces.map((space) => (
              <div key={space.label} className="relative aspect-video overflow-hidden rounded-xl group">
                <img src={space.img} alt={space.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                  <span className="font-serif text-lg text-white">{space.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 overflow-hidden">
        <img src={soundbathImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 container text-center text-primary-foreground">
          <p className="font-serif text-3xl md:text-4xl mb-6">All Wellness Services by Inquiry</p>
          <p className="text-sm font-sans opacity-80 mb-8">Pricing and scheduling arranged through your concierge.</p>
          <InquiryDialog>
            <button className="inline-block px-10 py-4 bg-accent text-accent-foreground font-sans text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors rounded-full">
              Inquire Now
            </button>
          </InquiryDialog>
          <div className="mt-10">
            <PageNavArrows prev={prev} next={next} variant="bottom" />
          </div>
        </div>
      </section>
    </Layout>
  );
}
