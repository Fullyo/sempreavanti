import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const menuCategories = [
  {
    title: "Breakfast",
    items: [
      "Chilaquiles verdes & rojos",
      "Ranchero eggs",
      "Waffles & Blueberry pancakes",
      "French toast",
      "Breakfast burritos",
      "Eggs Benedict",
      "Enchiladas suizas",
      "Scrambled eggs",
      "Avocado toast",
      "Grilled cheese",
      "Croque madame",
      "Fresh tropical fruits & juices",
    ],
  },
  {
    title: "Appetizers",
    items: [
      "Guac and Chips with house-made salsas",
      "Catch of the Day — sashimi, ceviche, or aguachile",
      "Cactus Salad",
      "Corn and Beet Root Salad",
      "Shrimp Sashimi",
      "Tortilla Soup",
      "Sopes",
      "Shrimp Diabla",
      "Tuna Tartar",
      "Sweet Potato Sashimi",
    ],
  },
  {
    title: "Lunch & Dinner",
    items: [
      "Pozole",
      "Pastor Catch of the Day",
      "Mexican Style Grill Steak",
      "Mole Poblano",
      "Zarandeado",
      "Pipian Duo",
      "Pork Belly",
      "Barbacoa",
      "Enchiladas",
      "Tetela de Birria",
      "Hibiscus Mole",
      "Chile Relleno",
    ],
  },
  {
    title: "Desserts",
    items: [
      "Caramel Flan",
      "Rice Pudding",
      "Capirotada",
      "Churros with chocolate",
      "Corn Bread",
      "Volcán de chocolate",
      "Fried Banana",
      "Buñuelos",
      "Jericalla",
    ],
  },
];

export default function Chef() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <PhotoPlaceholder label="Chef Experience" className="absolute inset-0 !aspect-auto opacity-30" />
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Culinary Experience</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light">Private Chef</h1>
        </div>
      </section>

      {/* Ricardo & Crethell */}
      <section className="py-20 md:py-28">
        <div className="container max-w-5xl">
          <SectionHeading
            eyebrow="Your Chefs"
            title="Ricardo & Crethell"
            description="More than private chefs — Ricardo and Crethell are the heart of the Sempre Avanti dining experience. With deep roots in Mexican coastal cuisine and a passion for fresh, local ingredients, every meal becomes a celebration."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <PhotoPlaceholder label="Chef Ricardo" aspectRatio="portrait" />
            <div className="flex flex-col justify-center">
              <p className="text-base font-sans text-muted-foreground leading-relaxed mb-4">
                From the first morning's fresh juice to the final fire-lit dessert, Ricardo and Crethell craft each meal around your group's preferences. They source daily from local fishermen and markets, bringing the flavors of Riviera Nayarit directly to your table.
              </p>
              <p className="text-base font-sans text-muted-foreground leading-relaxed mb-4">
                Ricardo speaks English and is happy to discuss menus, dietary needs, and special requests. Special celebrations, cultural menus, and surprise experiences are all part of the service.
              </p>
              <p className="text-sm font-sans text-accent italic">
                "Tell us what you love — we'll handle the rest."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Menu */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container max-w-5xl">
          <SectionHeading
            eyebrow="The Menu"
            title="A Taste of Every Moment"
            description="Each meal is tailored to your group. Below is a sampling of what Ricardo and Crethell prepare — always fresh, always inspired by the coast."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            {menuCategories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <h3 className="font-serif text-2xl mb-4 text-foreground">{cat.title}</h3>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="text-sm font-sans text-muted-foreground flex items-start gap-2">
                      <span className="text-accent mt-1">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Food photo placeholders */}
      <section className="py-4">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {["Ceviche", "Mole Poblano", "Wood-Fired Pizza", "Sunset Margaritas"].map((label) => (
              <PhotoPlaceholder key={label} label={label} aspectRatio="square" />
            ))}
          </div>
        </div>
      </section>

      {/* Pizza Night */}
      <section className="py-20 md:py-28">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <PhotoPlaceholder label="Pizza Night" aspectRatio="square" />
            <div>
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-accent mb-3 block">Guest Favorite</span>
              <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">Pizza Night</h2>
              <p className="text-base font-sans text-muted-foreground leading-relaxed mb-4">
                A beloved tradition — Ricardo fires up the wood-burning oven (it takes 5 hours to heat properly) for handmade pizzas with fresh, local toppings. Guests choose their own combinations while the sun sets.
              </p>
              <p className="text-base font-sans text-muted-foreground leading-relaxed">
                It's casual, interactive, and one of the most remembered evenings of every stay. Kids and adults alike gather around to watch their creations come out of the flames.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sunset Margarita Ritual */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-sans uppercase tracking-[0.3em] opacity-70 mb-3 block">Daily Ritual</span>
              <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">The Sunset Margarita</h2>
              <p className="text-base font-sans font-light leading-relaxed opacity-85 mb-4">
                Every evening, as the sun dips into the Pacific, your dedicated bartender serves handcrafted margaritas on the beach. A one-hour sunset window where time slows down — with non-alcoholic options always available.
              </p>
              <p className="text-base font-sans font-light leading-relaxed opacity-85 mb-4">
                Pitchers of fresh margaritas, micheladas, and craft cocktails are available throughout the day. A dedicated bartender is required for open bar, weddings, bachelorettes, or late-night events.
              </p>
              <p className="text-sm font-sans opacity-60 italic">
                All pricing provided upon inquiry.
              </p>
            </div>
            <PhotoPlaceholder label="Sunset Margaritas" className="!aspect-auto h-[400px]" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card">
        <div className="container text-center">
          <p className="font-serif text-3xl md:text-4xl mb-6">Inquire About Private Chef Services</p>
          <p className="text-sm font-sans text-muted-foreground mb-8">All pricing provided upon inquiry. Menus are fully customizable to your group's preferences.</p>
          <Link
            to="/contact"
            className="inline-block px-10 py-4 bg-accent text-accent-foreground font-sans text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </Layout>
  );
}
