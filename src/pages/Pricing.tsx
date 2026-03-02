import { useEffect, useRef, useState } from "react";
import Layout from "@/components/layout/Layout";

const categories = [
  {
    id: "wellness",
    title: "Wellness",
    items: [
      {
        name: "Private Yoga",
        price: "$2,500 MXN",
        details: "Duration: 1 hr 15 min",
        desc: "Enjoy a personalized yoga session in the comfort of your villa.",
      },
      {
        name: "Sound Bath (Sound Bowls)",
        price: "$2,500 MXN (up to 5 people)",
        details: "Additional guests: $500 MXN per person",
        desc: "Immerse yourself in a deeply relaxing sound healing experience.",
      },
      {
        name: "In-House Massage",
        price: "$1,500 MXN per person",
        desc: "Relax and unwind with a professional massage in your villa.",
      },
      {
        name: "Personal Training (Weights Included)",
        price: "$2,000 MXN per person",
        desc: "Private strength or conditioning session tailored to you.",
      },
      {
        name: "Pilates",
        price: "$1,000 MXN per person",
        details: "Minimum 2 people",
        desc: "A focused session designed to strengthen and energize.",
      },
    ],
  },
  {
    id: "culinary",
    title: "Food & Culinary",
    items: [
      {
        name: "Sayulita Taco Tour",
        price: "$1,200 MXN per person",
        details: "Available Tuesday–Sunday | Minimum 4 people",
        desc: "A guided tour through Sayulita's best taco spots.",
        includes: [
          "Transportation",
          "3–4 taco stops",
          "Local history",
          "Finish at the agave field with blue corn tacos/quesadillas",
        ],
        note: "Additional food beyond included tastings is paid directly by the guest.",
      },
      {
        name: "Private Mexican Cooking Class (In-House)",
        price: "$1,200 MXN per person",
        desc: "Learn to prepare authentic Mexican dishes from scratch in your villa.",
      },
    ],
  },
  {
    id: "surf",
    title: "Surf",
    items: [
      {
        name: "Surf Lesson — Sayulita",
        price: "$1,200 MXN per person",
        details: "Minimum 2 people",
        desc: "Perfect for beginners or those looking to refine their skills.",
      },
      {
        name: "Surf Experience — Punta de Mita (La Lancha)",
        price: "$2,000 MXN per person",
        desc: "A premium surf session at one of the coast's best breaks.",
        includes: [
          "Transportation",
          "Boards",
          "1.5-hour lesson",
          "30 minutes of free surf",
        ],
      },
    ],
  },
  {
    id: "boats",
    title: "Boats & Fishing",
    items: [
      {
        name: "Private Boat Tour (3 Hours)",
        price: "$9,500 MXN",
        details: "Maximum 7 guests",
        desc: "Cruise the coast with whale watching, snorkeling, and light trolling.",
        includes: [
          "Whale watching (seasonal)",
          "Snorkelling equipment",
          "Light trolling",
          "Water, sodas, beer",
        ],
        note: "Optional 4-hour tour: $11,500 MXN",
      },
      {
        name: "Fishing Charter (4 Hours)",
        price: "$10,000 MXN",
        details: "Maximum 4 guests",
        includes: ["Fishing equipment", "Water, sodas, beer"],
      },
      {
        name: "Spearfishing — Inshore",
        price: "$12,000 MXN",
        details: "4–5 hours | Maximum 3–4 guests",
      },
      {
        name: "Spearfishing — Deep Water (Full Day)",
        price: "$21,000 MXN",
        details: "7:00 a.m. – 4:00 p.m. | Maximum 3 guests",
        includes: ["Equipment", "Beverages", "Fresh sashimi preparation"],
      },
    ],
  },
  {
    id: "polaris",
    title: "Polaris Rentals",
    items: [
      {
        name: "2-Seater",
        price: "$1,600 MXN",
      },
      {
        name: "4-Seater",
        price: "$1,900 MXN",
      },
      {
        name: "6-Seater",
        price: "$2,200 MXN",
      },
    ],
    footerNote: "Operating limits: South — Punta de Mita · North — San Pancho",
  },
  {
    id: "transportation",
    title: "Transportation",
    items: [
      {
        name: "Airport SUV (Round Trip)",
        price: "$5,000 MXN",
        details: "Up to 7 guests",
      },
    ],
  },
];

export default function Pricing() {
  const [activeId, setActiveId] = useState(categories[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <Layout>
      {/* Intro */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-14">
        <div className="container max-w-3xl text-center">
          <p className="text-xs font-sans uppercase tracking-[0.4em] text-accent mb-4">
            Activities & Experiences
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-light leading-tight text-foreground mb-6">
            Make the Most of Your Stay
          </h1>
          <p className="text-base md:text-lg font-sans font-light leading-relaxed text-muted-foreground">
            Sayulita and the surrounding coastline offer far more than just
            beautiful views. From private wellness sessions in your villa to surf
            adventures, boat excursions, and unforgettable culinary experiences,
            we've curated a selection of activities designed to elevate your
            stay.
          </p>
          <p className="mt-4 text-base font-sans font-light text-muted-foreground">
            Whether you're looking to relax, explore, or chase a little
            adrenaline, our concierge team is here to arrange everything
            seamlessly.
          </p>
          <p className="mt-6 text-xs font-sans uppercase tracking-widest text-accent">
            All experiences require a minimum of 24 hours' notice
          </p>
        </div>
      </section>

      {/* Sticky category nav */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container max-w-4xl">
          <nav className="flex overflow-x-auto gap-1 py-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollTo(cat.id)}
                className={`whitespace-nowrap px-4 py-2 text-xs font-sans uppercase tracking-widest transition-colors rounded-full ${
                  activeId === cat.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Category sections */}
      {categories.map((cat) => (
        <section
          key={cat.id}
          id={cat.id}
          ref={(el) => { sectionRefs.current[cat.id] = el; }}
          className="py-12 md:py-16"
        >
          <div className="container max-w-4xl">
            {/* Category header */}
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground whitespace-nowrap">
                {cat.title}
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Items */}
            <div className="space-y-8">
              {cat.items.map((item) => (
                <div key={item.name}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="font-sans text-sm font-semibold text-foreground">
                      {item.name}
                    </h3>
                    <span className="text-sm font-sans font-medium text-accent shrink-0">
                      {item.price}
                    </span>
                  </div>

                  {item.details && (
                    <p className="text-xs font-sans text-muted-foreground mt-1">
                      {item.details}
                    </p>
                  )}

                  {item.desc && (
                    <p className="text-sm font-sans text-muted-foreground mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  )}

                  {item.includes && (
                    <ul className="mt-2 space-y-1">
                      {item.includes.map((inc) => (
                        <li
                          key={inc}
                          className="flex items-start gap-2 text-sm font-sans text-muted-foreground"
                        >
                          <span className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                          {inc}
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.note && (
                    <p className="text-xs font-sans text-muted-foreground/70 italic mt-2">
                      {item.note}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {cat.footerNote && (
              <p className="mt-6 text-xs font-sans text-muted-foreground italic">
                {cat.footerNote}
              </p>
            )}
          </div>
        </section>
      ))}

      {/* Footer disclaimer */}
      <div className="container max-w-4xl py-12">
        <p className="text-xs font-sans text-muted-foreground text-center italic">
          All experiences require a minimum of 24 hours' notice. Prices shown in
          MXN.
        </p>
      </div>
    </Layout>
  );
}
