import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const menuCategories = [
  {
    title: "Breakfast",
    items: [
      "Fresh tropical fruits & juices",
      "Chilaquiles verdes & rojos",
      "Huevos rancheros",
      "Avocado toast with local ingredients",
      "Homemade granola & yogurt bowls",
      "Fresh-baked pastries",
    ],
  },
  {
    title: "Appetizers",
    items: [
      "Ceviche del día",
      "Guacamole trio with house-made salsas",
      "Tuna tostadas",
      "Shrimp cocktail",
      "Bruschetta with local tomatoes",
    ],
  },
  {
    title: "Lunch & Dinner",
    items: [
      "Catch-of-the-day preparations",
      "Grilled ribeye with chimichurri",
      "Lobster tail with drawn butter",
      "Mole negro with chicken",
      "Fresh pasta with seafood",
      "Wood-fired pizza nights",
      "Tacos al pastor",
    ],
  },
  {
    title: "Desserts",
    items: [
      "Tres leches cake",
      "Churros with chocolate sauce",
      "Coconut flan",
      "Fresh fruit sorbets",
      "Mexican chocolate mousse",
    ],
  },
];

export default function Chef() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-primary">
        {/* Placeholder for chef photo */}
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">Culinary Experience</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light">Private Chef</h1>
        </div>
      </section>

      {/* Ricardo & Crethell */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Your Chefs"
            title="Ricardo & Crethell"
            description="More than private chefs — Ricardo and Crethell are the heart of the Sempre Avanti dining experience. With deep roots in Mexican coastal cuisine and a passion for fresh, local ingredients, every meal becomes a celebration."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-muted h-80 flex items-center justify-center">
              <span className="text-muted-foreground font-sans text-sm">Chef photo placeholder</span>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-base font-sans text-muted-foreground leading-relaxed mb-4">
                From the first morning's fresh juice to the final fire-lit dessert, Ricardo and Crethell craft each meal around your group's preferences. They source daily from local fishermen and markets, bringing the flavors of Riviera Nayarit directly to your table.
              </p>
              <p className="text-base font-sans text-muted-foreground leading-relaxed">
                Special dietary needs, cultural requests, and surprise celebrations are all part of the experience. Simply let your concierge know, and the kitchen adapts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container max-w-5xl">
          <SectionHeading
            eyebrow="The Menu"
            title="A Taste of Every Moment"
            description="Each meal is tailored to your group. Below is a sampling of what Ricardo and Crethell prepare — always fresh, always inspired."
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

      {/* Sunset Margarita Ritual */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container max-w-4xl text-center">
          <SectionHeading
            eyebrow="Daily Ritual"
            title="The Sunset Margarita"
            description="Every evening, as the sun dips into the Pacific, your dedicated bartender serves handcrafted margaritas on the beach. A one-hour sunset window where time slows down — with non-alcoholic options always available."
            light
          />
          <p className="text-sm font-sans opacity-70 mt-4">
            A dedicated bartender is available throughout the day and evening. Required for open bar, weddings, bachelorettes, or late-night events.
          </p>
        </div>
      </section>

      {/* Pizza Night */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl text-center">
          <SectionHeading
            eyebrow="Guest Favorite"
            title="Pizza Night"
            description="A beloved tradition — Ricardo fires up the oven for handmade wood-fired pizzas with local ingredients. A casual, fun evening that brings the whole group together."
          />
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
