import { useEffect, useRef, useState } from "react";
import Layout from "@/components/layout/Layout";

const mustDos = [
  {
    name: "Ally Cat Sailing",
    teaser: "The best way to experience the bay — snorkeling, open bar, ceviche, and unforgettable sunsets on the water.",
  },
  {
    name: "Surf with Vary",
    teaser: "Whether it's your first wave or your hundredth, a session with our local guide is pure magic.",
  },
  {
    name: "Cachasol Farm Distillery",
    teaser: "A 90-minute farm-to-glass tour at the coastal agave plantation just minutes from the house. Tastings, open-fire kitchen, and craft cocktails.",
  },
  {
    name: "In-House Massage",
    teaser: "Nothing beats a professional massage on the terrace with the sound of the ocean below.",
  },
  {
    name: "UTV Coastal Cruise",
    teaser: "Grab a Polaris and explore the coast at your own pace — from Punta de Mita to San Pancho.",
  },
];

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
        name: "Cachasol Farm Distillery Tour",
        price: "$1,500 MXN per person",
        details: "90 minutes | Tuesday–Sunday at 1 PM & 5 PM",
        desc: "A farm-to-glass experience at the coastal agave plantation just minutes from the house. Taste small-batch tequilas and coastal raicillas, explore six acres of agaves and gardens, and enjoy bites from the open-fire kitchen.",
        includes: [
          "Guided distillery walkthrough",
          "Spirit tastings (tequila & raicilla)",
          "Craft cocktail",
          "Open-fire kitchen bites",
        ],
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
        desc: "Perfect for beginners or those looking to refine their skills. Board and rash guard included.",
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
      {
        name: "Surf Guiding — Intermediate",
        price: "$2,500 MXN per person",
        details: "Half day | Minimum 2 people",
        desc: "Already comfortable on a board? Vary takes you to the best break for the day's conditions — from La Lancha to Captain Pablo's and beyond.",
        includes: [
          "Local guide & coaching",
          "Transportation",
          "Board if needed",
        ],
      },
      {
        name: "Advanced Coaching & Guiding",
        price: "$3,500 MXN per person",
        details: "Half day | Experienced surfers only",
        desc: "For surfers chasing bigger waves and sharper technique. Vary guides you to the advanced spots — Burros, El Anclote reef, and hidden points along the coast.",
        includes: [
          "Expert coaching & wave selection",
          "Transportation to advanced breaks",
          "Board if needed",
        ],
      },
      {
        name: "Boat Trip Surf Safari — Punta de Mita",
        price: "$15,000 MXN (up to 4 surfers)",
        details: "Full day | Departure from Punta de Mita | Intermediate to advanced",
        desc: "Access the coast's most exclusive and uncrowded breaks by boat. A full-day surf adventure hitting multiple spots along the Punta de Mita coastline that you can't reach by land.",
        includes: [
          "Private boat & captain",
          "Surf guide",
          "Water, sodas, beer",
          "Multiple break access",
        ],
      },
    ],
  },
  {
    id: "boats",
    title: "Boats & Fishing",
    items: [
      {
        name: "Ally Cat Sailing",
        price: "$3,200 MXN per person",
        details: "4 hours | Up to 12 guests",
        desc: "Our top recommendation — an intimate sailing experience along Banderas Bay with snorkeling, paddleboarding, open bar, and fresh ceviche prepared onboard. Perfect for groups.",
        includes: [
          "Open bar",
          "Fresh ceviche & snacks",
          "Snorkeling & paddleboard gear",
          "Sunset option available",
        ],
      },
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
  const [activeId, setActiveId] = useState("favorites");
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

  const allNavItems = [{ id: "favorites", title: "Guest Favorites" }, ...categories];

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
        <div className="container">
          <nav className="flex flex-wrap justify-center gap-2 py-2">
            {allNavItems.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollTo(cat.id)}
                className={`whitespace-nowrap px-5 py-2 text-[10px] sm:text-xs font-sans uppercase tracking-widest transition-colors rounded-full ${
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

      {/* Guest Favorites */}
      <section
        id="favorites"
        ref={(el) => { sectionRefs.current["favorites"] = el; }}
        className="py-12 md:py-16"
      >
        <div className="container max-w-4xl">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground whitespace-nowrap">
              5 Guest Favorites
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <p className="text-sm font-sans text-muted-foreground mb-8">
            The experiences our guests love most — and the ones we always recommend first.
          </p>

          <div className="space-y-6">
            {mustDos.map((item, i) => (
              <div key={item.name} className="flex gap-4 items-start">
                <span className="text-2xl font-serif text-accent leading-none mt-0.5">{i + 1}</span>
                <div>
                  <h3 className="font-sans text-sm font-semibold text-foreground">
                    {item.name}
                  </h3>
                  <p className="text-sm font-sans text-muted-foreground leading-relaxed mt-0.5">
                    {item.teaser}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category sections */}
      {categories.map((cat) => (
        <section
          key={cat.id}
          id={cat.id}
          ref={(el) => { sectionRefs.current[cat.id] = el; }}
          className="py-12 md:py-16"
        >
          <div className="container max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground whitespace-nowrap">
                {cat.title}
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>

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

      {/* Passive CTA footer */}
      <section className="relative h-[40dvh] md:h-[50dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div className="relative z-10 text-center text-white px-6 max-w-2xl mx-auto">
          <p className="font-serif text-2xl md:text-4xl lg:text-5xl font-light mb-4">
            Ready to book an experience?
          </p>
          <p className="text-sm md:text-base font-sans font-light leading-relaxed opacity-80">
            Simply reply to this email with the activities you'd like and your preferred dates — our concierge team will handle the rest.
          </p>
        </div>
      </section>
    </Layout>
  );
}
