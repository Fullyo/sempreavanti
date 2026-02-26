import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface MenuItem {
  name: string;
  description: string;
}

interface MenuCategory {
  title: string;
  subtitle: string;
  items: MenuItem[];
  footnotes?: string[];
}

const menuData: MenuCategory[] = [
  {
    title: "Desayuno",
    subtitle: "Breakfast",
    items: [
      { name: "Chilaquiles with Egg", description: "Green or red, served with egg" },
      { name: "Ranchero Eggs", description: "Fried egg on top of fried tortilla with salsa" },
      { name: "Waffles with Fruit", description: "Fresh waffles topped with seasonal tropical fruit" },
      { name: "Pancakes with Fried Banana", description: "Fluffy pancakes with caramelized banana" },
      { name: "Breakfast Burritos", description: "Hearty morning wrap with eggs and fresh fillings" },
      { name: "Blueberry Pancakes", description: "Classic pancakes loaded with blueberries" },
      { name: "French Toast with Ice Cream", description: "Golden French toast served with ice cream" },
      { name: "Eggs Benedict", description: "Poached eggs with hollandaise on English muffin" },
      { name: "Enchiladas Suizas", description: "Creamy green sauce with grilled cheese on top" },
      { name: "Scrambled Eggs", description: "With pico de gallo" },
      { name: "Avocado Toast with Eggs", description: "Sourdough toasted bread with avocado on top & egg" },
      { name: "Grilled Cheese Sandwich", description: "Classic grilled cheese, golden and melty" },
      { name: "Croque Madame", description: "French classic with ham, cheese & béchamel" },
    ],
    footnotes: [
      "Fruit & yogurt bowls included",
      "Orange juice & coffee included",
    ],
  },
  {
    title: "Appetizers",
    subtitle: "Entradas",
    items: [
      { name: "Guac & Chips", description: "Fresh avocado with lime juice mix with pico de gallo served with corn chips" },
      { name: "Catch of the Day", description: "Prepared in sashimi, tiradito, ceviche or aguachile, served with corn tostados" },
      { name: "Cactus Salad", description: "Olive oil, cactus, fresh tomato, onion served with special sauce" },
      { name: "Corn & Beet Root Salad", description: "Roast beet & grilled cornlets, served on top of green leaves mix with sweet & sour vinaigrette" },
      { name: "Shrimp Sashimi", description: "Leche de tigre & coconut sauce, served with mushroom slices & toasted corn" },
      { name: "Tortilla Soup", description: "Tomato & chicken broth served w/ crispy tortilla strips, chicken, avocado, cheese & sour cream" },
      { name: "Sopes", description: "Small corn thick tortilla, topped w/ beans, slow cooked beef chest" },
      { name: "Shrimp Diabla Style", description: "Cooked shrimp into a sweet-spicy sauce, a classical dish in the Bahía area" },
      { name: "Tuna Tartar", description: "Fresh tuna chopped with spices & served with corn tostadas" },
      { name: "Sweet Potato Sashimi", description: "Served with a duo of leche de tigre & corn tostadas" },
    ],
  },
  {
    title: "Almuerzo / Cena",
    subtitle: "Lunch & Dinner",
    items: [
      { name: "Pozole", description: "Broth with corn kernels, served with your choice of chicken, shrimp, pork or vegetarian" },
      { name: "Pastor Catch of the Day", description: "Fish fillet with pastor adobo, served with purée & pineapple chutney" },
      { name: "Mexican Style Grill Steak", description: "Special beer & spices marinated rib eye steak, served with chistorra & stuffed jalapeño" },
      { name: "Mole Poblano", description: "Chicken breast dressed with a smooth poblano mole & little chocolate touch served with rice" },
      { name: "Zarandeado", description: "Fish fillet with special adobo, grilled until crispy on the outside, classical Nayarit dish" },
      { name: "Pipián Duo, Green & Red", description: "Double cooked pork belly, grilled until crispy, served over a bed of pipián duo (classic Mexican mole, made with pumpkin seeds, spices & dry peppers)" },
      { name: "Barbacoa", description: "Red beef broth with dry peppers & spices, slow cook until tender, served in its own broth with handmade tortillas" },
      { name: "Enchiladas", description: "Your choice of green or red sauce, rolled tortilla stuffed with shredded chicken, topped with salsa, lettuce, sour cream & dry aged cheese" },
      { name: "Tetela de Birria", description: "Fried quesadilla in triangle shape, stuffed with shredded beef birria, served with consomé (birria broth)" },
      { name: "Hibiscus Mole", description: "Red mole served with beef tenderloin & plantain garnish" },
      { name: "Chile Relleno", description: "Classic Mexican dish, stuffed poblano pepper (battered & served in red sauce, with sour cream garnish)" },
    ],
  },
  {
    title: "Postres",
    subtitle: "Desserts",
    items: [
      { name: "Caramel Flan", description: "Creamy caramel flan with a brûlée sugar layer on top" },
      { name: "Rice Pudding", description: "Grandma's special dessert, milky rice pudding" },
      { name: "Capirotada", description: "Mexican brioche budín, served with salty caramel sauce" },
      { name: "Churros", description: "Golden crispy churros with sugar, served with caramel sauce & ice cream" },
      { name: "Corn Bread", description: "Super creamy soft bread served with ice cream" },
      { name: "Volcán", description: "Chocolate fudge cake, served with ice cream" },
      { name: "Fried Banana", description: "Butter fried bananas flambéed, served with ice cream" },
      { name: "Buñuelos", description: "Fritters served in the most classical way with the piloncillo spiced syrup" },
      { name: "Jericalla", description: "Mexican creamy dessert, milky base similar to flan but with the top burnt in the oven. Classic from Guadalajara, served with rompope" },
    ],
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6 },
};

export default function Menu() {
  return (
    <Layout>
      {/* Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-card">
        <div className="container text-center max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-sans uppercase tracking-[0.4em] text-accent mb-4"
          >
            Sempre Avanti Kitchen
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl font-light text-foreground mb-4"
          >
            Gourmet Dining
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg font-sans text-muted-foreground font-light leading-relaxed"
          >
            Prepared fresh daily by your private chefs Ricardo & Crethell, using locally sourced ingredients from the coast and markets of Riviera Nayarit.
          </motion.p>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-16 md:py-24">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12">
            {menuData.map((category, catIdx) => (
              <motion.div
                key={category.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: catIdx * 0.1 }}
              >
                {/* Category Header */}
                <div className="mb-8">
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
                    {category.title}
                  </h2>
                  <p className="text-xs font-sans uppercase tracking-[0.25em] text-accent mt-1">
                    {category.subtitle}
                  </p>
                  <div className="w-12 h-px bg-accent/40 mt-4" />
                </div>

                {/* Items */}
                <div className="space-y-5">
                  {category.items.map((item) => (
                    <div key={item.name}>
                      <h3 className="font-serif text-lg font-medium text-foreground leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-sm font-sans text-muted-foreground leading-relaxed mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footnotes */}
                {category.footnotes && (
                  <div className="mt-6 pt-4 border-t border-border/40">
                    {category.footnotes.map((note) => (
                      <p key={note} className="text-xs font-sans italic text-muted-foreground/70">
                        *{note}
                      </p>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pizza Night Callout */}
      <section className="pb-16 md:pb-24">
        <div className="container max-w-3xl">
          <motion.div
            {...fadeUp}
            className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center"
          >
            <span className="text-xs font-sans uppercase tracking-[0.3em] opacity-60 mb-3 block">
              Guest Favorite
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light mb-4">
              Pizza Night
            </h2>
            <p className="text-sm md:text-base font-sans font-light leading-relaxed opacity-85 max-w-xl mx-auto">
              Pizza night can be arranged but we need to know the night before or first thing in the morning to make sure the oven can be heated for at least 5 hours and we have the necessary toppings for your specific pizza.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-card">
        <div className="container text-center">
          <p className="font-serif text-2xl md:text-3xl text-foreground mb-4">
            Meet the team behind every meal
          </p>
          <Link
            to="/chef"
            className="inline-block px-10 py-4 bg-accent text-accent-foreground font-sans text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors rounded-full"
          >
            The Chef Experience
          </Link>
        </div>
      </section>
    </Layout>
  );
}
