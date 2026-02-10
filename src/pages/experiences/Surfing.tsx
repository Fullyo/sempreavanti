import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PageNavArrows, { experiencePages, getPageNav } from "@/components/PageNavArrows";
import InquiryDialog from "@/components/InquiryDialog";
import { motion } from "framer-motion";

import surfSayulitaAerial from "@/assets/surf-sayulita-aerial.jpg";
import surfLalancha from "@/assets/surf-lalancha.jpg";
import surfSayulitaDrone from "@/assets/surf-sayulita-drone.png";
import surfBurros from "@/assets/surf-burros.jpeg";
import surfPuntamitaAerial from "@/assets/surf-puntamita-aerial.jpg";
import surfSayulitaMain from "@/assets/surf-sayulita-main.jpg";
import surfChilloWater from "@/assets/surf-chillo-water.jpg";
import surfBeginner from "@/assets/surf-beginner.jpeg";
import surfAction from "@/assets/surf-action.jpg";
import surfWalk from "@/assets/surf-walk.jpeg";
import surfChillo from "@/assets/surf-chillo.jpg";
import surfPuntamita from "@/assets/surf-puntamita.jpeg";

const { prev, next } = getPageNav(experiencePages, "/experiences/surfing");

const surfBreaks = [
  { name: "La Lancha", desc: "World-class left point break near Punta de Mita. Transportation, boards, 1.5-hour lesson, and 30 min free surf included.", img: surfLalancha },
  { name: "Captain Pablo's", desc: "Right point break — consistent, fun, and great for intermediate surfers looking for a reliable wave.", img: surfSayulitaDrone },
  { name: "Don Pedro's", desc: "Left break right in front of the iconic beachfront restaurant in Sayulita.", img: surfSayulitaAerial },
  { name: "Burros", desc: "Powerful beach break north of Sayulita. Best suited for experienced surfers who want a challenge.", img: surfBurros },
  { name: "Punta Mita", desc: "Several breaks around the point offering varied conditions for all levels, from mellow rollers to punchy reef breaks.", img: surfPuntamitaAerial },
  { name: "Sayulita Main Break", desc: "The town's signature wave — a gentle, forgiving break perfect for longboarders and beginners.", img: surfSayulitaMain },
];

export default function Surfing() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img src={surfSayulitaAerial} alt="Surfing in Riviera Nayarit" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
        <div className="relative z-10 text-center text-primary-foreground px-4 w-full max-w-6xl mx-auto">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Experiences</p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1"><PageNavArrows prev={prev} next={undefined} variant="hero" /></div>
            <h1 className="font-serif text-5xl md:text-7xl font-light">Surfing</h1>
            <div className="flex-1"><PageNavArrows prev={undefined} next={next} variant="hero" /></div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Catch a Wave"
            title="From First Wave to Endless Barrels"
            description="The Riviera Nayarit is one of Mexico's premier surf destinations, with breaks for every level scattered along the coast. Whether you're standing on a board for the first time or chasing offshore point breaks, your concierge arranges everything — boards, transport, and the best local instructors."
          />
        </div>
      </section>

      {/* Surf Breaks */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container max-w-6xl">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent">Surf Breaks</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surfBreaks.map((spot, i) => (
              <motion.div
                key={spot.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-background rounded-xl overflow-hidden border border-border"
              >
                <div className="aspect-video">
                  <img src={spot.img} alt={spot.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl mb-1">{spot.name}</h3>
                  <p className="text-sm font-sans text-muted-foreground leading-relaxed">{spot.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chillo Featured */}
      <section className="py-20 md:py-28">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            <div className="rounded-xl overflow-hidden aspect-square">
              <img src={surfChilloWater} alt="Chillo — Surf Instructor" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent mb-2 block">Your Instructor</span>
              <h2 className="font-serif text-3xl md:text-4xl font-light mb-4">Lessons with Chillo</h2>
              <p className="text-base font-sans text-muted-foreground leading-relaxed mb-4">
                Chillo is the best beginner surf instructor in Sayulita — patient, fun, and incredible with kids and first-timers. He'll have your family standing on boards by day one.
              </p>
              <p className="text-base font-sans text-muted-foreground leading-relaxed">
                Lessons are arranged any morning during your stay. Chillo provides boards, rash guards, and all the encouragement you need. He knows every break in the area and matches the spot to your group's skill level.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-4">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[surfChillo, surfWalk, surfSayulitaAerial, surfSayulitaMain].map((img, i) => (
              <div key={i} className="aspect-video overflow-hidden rounded">
                <img src={img} alt="Surfing" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 md:py-28 text-primary-foreground overflow-hidden">
        <img src={surfWalk} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 container max-w-4xl text-center">
          <SectionHeading
            eyebrow="Your Concierge"
            title="Boards, Breaks & Transport — All Arranged"
            description="Just tell your concierge when you want to surf. They'll match you with the right break, arrange boards and instruction, and have transport ready."
            light
          />
          <InquiryDialog>
            <button className="inline-block mt-6 px-10 py-4 border border-primary-foreground/50 text-primary-foreground font-sans text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors rounded-full">
              Plan Your Surf Trip
            </button>
          </InquiryDialog>
        </div>
        <div className="relative z-10 container max-w-4xl mt-10">
          <PageNavArrows prev={prev} next={next} variant="bottom" />
        </div>
      </section>
    </Layout>
  );
}
