import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import PageNavArrows, { experiencePages, getPageNav } from "@/components/PageNavArrows";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const { prev, next } = getPageNav(experiencePages, "/experiences/golf");

const courses = [
  {
    name: "Litibú Golf Course",
    designer: "Greg Norman",
    holes: 18,
    distance: "15 minutes from the estate",
    desc: "An 18-hole Greg Norman Signature design carved through tropical jungle with stunning Pacific Ocean views. The course features dramatic elevation changes and several holes that play along the coastline. Open to the public — your concierge arranges tee times and transport.",
  },
  {
    name: "Four Seasons Pacífico",
    designer: "Jack Nicklaus",
    holes: 18,
    distance: "25 minutes from the estate",
    desc: "One of two Jack Nicklaus Signature courses at the Four Seasons Punta Mita. Features the iconic 'Tail of the Whale' — a natural island green accessible only at low tide by an amphibious cart. Bucket-list golf at its finest.",
  },
  {
    name: "Four Seasons Bahía",
    designer: "Jack Nicklaus",
    holes: 18,
    distance: "25 minutes from the estate",
    desc: "The second Nicklaus course at Punta Mita, offering a different character with more jungle-framed fairways and bay panoramas. Equally world-class, slightly more forgiving than Pacífico.",
  },
  {
    name: "El Flamingo",
    designer: "Percy Clifford",
    holes: 9,
    distance: "30 minutes — near Bucerías",
    desc: "A charming 9-hole course near Bucerías. Casual, affordable, and fun — perfect for a relaxed morning round without the formality of resort courses.",
  },
  {
    name: "El Tigre",
    designer: "Robert von Hagge",
    holes: 18,
    distance: "40 minutes — Nuevo Vallarta",
    desc: "An 18-hole Robert von Hagge design in the heart of Nuevo Vallarta. Known for its signature island green and well-maintained fairways. A solid round in a resort setting.",
  },
];

export default function Golf() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <PhotoPlaceholder label="Golf" className="absolute inset-0 !aspect-auto opacity-30" />
        <div className="relative z-10 text-center text-primary-foreground px-4 w-full max-w-6xl mx-auto">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Experiences</p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1"><PageNavArrows prev={prev} next={undefined} variant="hero" /></div>
            <h1 className="font-serif text-5xl md:text-7xl font-light">Tee Off</h1>
            <div className="flex-1"><PageNavArrows prev={undefined} next={next} variant="hero" /></div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="World-Class Golf"
            title="Five Courses. Ocean Views. No Tee Time Hassle."
            description="The Riviera Nayarit is home to some of Mexico's most celebrated golf courses — from Jack Nicklaus masterpieces at Four Seasons to Greg Norman's jungle-carved Litibú. Your concierge arranges tee times, transport, and club rentals."
          />
        </div>
      </section>

      {/* Course Listings */}
      <section className="pb-20 md:pb-28">
        <div className="container max-w-6xl">
          <div className="space-y-12">
            {courses.map((course, i) => (
              <motion.div
                key={course.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-border pb-8"
              >
                <PhotoPlaceholder label={course.name} aspectRatio="video" className="rounded-xl overflow-hidden" />
                <div className="md:col-span-2">
                  <h3 className="font-serif text-2xl mb-2">{course.name}</h3>
                  <div className="flex flex-wrap gap-3 mb-3">
                    <span className="text-xs font-sans uppercase tracking-widest text-accent">{course.holes} Holes</span>
                    <span className="text-xs font-sans text-muted-foreground">•</span>
                    <span className="text-xs font-sans text-muted-foreground">{course.designer}</span>
                    <span className="text-xs font-sans text-muted-foreground">•</span>
                    <span className="text-xs font-sans text-muted-foreground">{course.distance}</span>
                  </div>
                  <p className="text-sm font-sans text-muted-foreground leading-relaxed">{course.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container max-w-4xl text-center">
          <SectionHeading
            eyebrow="Your Concierge"
            title="Tee Times, Transport & Clubs — Sorted"
            description="Your concierge books tee times, arranges transport, and can coordinate club rentals so you arrive ready to play. All pricing provided upon inquiry."
            light
          />
          <Link
            to="/contact"
            className="inline-block mt-6 px-10 py-4 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors rounded-full"
          >
            Book a Round
          </Link>
        </div>
        <div className="container max-w-4xl mt-10">
          <PageNavArrows prev={prev} next={next} variant="bottom" />
        </div>
      </section>
    </Layout>
  );
}
