import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import chefHero from "@/assets/chef-hero.jpeg";
import foodImg from "@/assets/food1.jpeg";

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

/* ── Decorative SVG Components ── */

function AgaveAccent({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 80" className={`w-10 md:w-14 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 75 C30 75 10 50 14 30 C16 20 24 15 30 10 C36 15 44 20 46 30 C50 50 30 75 30 75Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M30 70 C30 70 20 50 22 35 C23 28 27 24 30 20 C33 24 37 28 38 35 C40 50 30 70 30 70Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M30 10 L30 75" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
    </svg>
  );
}

function AgaveDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2 text-accent/50">
      <div className="h-px flex-1 max-w-16 bg-accent/30" />
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2 L14 8 L12 6 L10 8 Z M12 22 L14 16 L12 18 L10 16 Z M12 6 L12 18" stroke="currentColor" strokeWidth="0.5" fill="none" />
      </svg>
      <div className="h-px flex-1 max-w-16 bg-accent/30" />
    </div>
  );
}

function OrnamentalLine() {
  return (
    <div className="flex items-center gap-2 text-accent/40">
      <div className="h-px flex-1 bg-accent/25" />
      <svg viewBox="0 0 12 12" className="w-2 h-2 text-accent/50" fill="currentColor">
        <rect x="3" y="3" width="6" height="6" transform="rotate(45 6 6)" />
      </svg>
      <div className="h-px flex-1 bg-accent/25" />
    </div>
  );
}

function CategoryHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8 text-center">
      <div className="flex items-center gap-4 justify-center mb-2">
        <div className="h-px w-8 md:w-12 bg-accent/40" />
        <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
          {title}
        </h2>
        <div className="h-px w-8 md:w-12 bg-accent/40" />
      </div>
      <p className="text-xs font-sans uppercase tracking-[0.3em] text-accent">
        {subtitle}
      </p>
    </div>
  );
}

function ItemDivider() {
  return (
    <div className="flex justify-center my-1">
      <svg viewBox="0 0 8 8" className="w-1.5 h-1.5 text-accent/30" fill="currentColor">
        <rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" />
      </svg>
    </div>
  );
}

export default function Menu() {
  return (
    <Layout>
      {/* Hero Header */}
      <section className="relative h-[50dvh] md:h-[60dvh] flex items-center justify-center overflow-hidden">
        <img
          src={chefHero}
          alt="Gourmet dining at Sempre Avanti"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        <div className="relative z-10 text-center text-white px-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-sans uppercase tracking-[0.4em] opacity-70 mb-4"
          >
            Sempre Avanti Kitchen
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-light mb-4"
          >
            Gourmet Dining
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base font-sans font-light leading-relaxed opacity-80 max-w-lg mx-auto"
          >
            Prepared fresh daily by your private chefs Ricardo & Crethell, using locally sourced ingredients from the coast and markets of Riviera Nayarit.
          </motion.p>
        </div>
      </section>

      {/* Menu Card Container */}
      <section className="py-12 md:py-20">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative bg-cream/50 border border-accent/25 rounded-2xl md:rounded-3xl p-6 md:p-12 lg:p-16"
          >
            {/* Top agave decoration */}
            <div className="flex justify-center -mt-12 md:-mt-18 mb-8">
              <div className="bg-cream/80 px-4 py-1 rounded-full">
                <AgaveAccent className="text-accent/60" />
              </div>
            </div>

            {/* Top ornamental line */}
            <div className="max-w-xs mx-auto mb-10">
              <OrnamentalLine />
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-10">
              {menuData.map((category, catIdx) => (
                <motion.div
                  key={category.title}
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: catIdx * 0.1 }}
                >
                  <CategoryHeader title={category.title} subtitle={category.subtitle} />

                  {/* Items */}
                  <div className="space-y-1">
                    {category.items.map((item, itemIdx) => (
                      <div key={item.name}>
                        <div className="text-center px-2 py-2">
                          <h3 className="font-serif text-lg md:text-xl font-medium text-foreground leading-snug">
                            {item.name}
                          </h3>
                          <p className="text-sm font-sans text-muted-foreground leading-relaxed mt-0.5 max-w-sm mx-auto">
                            {item.description}
                          </p>
                        </div>
                        {itemIdx < category.items.length - 1 && <ItemDivider />}
                      </div>
                    ))}
                  </div>

                  {/* Footnotes */}
                  {category.footnotes && (
                    <div className="mt-6 pt-4 border-t border-accent/15 text-center">
                      {category.footnotes.map((note) => (
                        <p key={note} className="text-xs font-sans italic text-muted-foreground/70">
                          *{note}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Agave divider between categories on mobile */}
                  {catIdx < menuData.length - 1 && (
                    <div className="md:hidden mt-10">
                      <AgaveDivider />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Bottom ornamental line */}
            <div className="max-w-xs mx-auto mt-12">
              <OrnamentalLine />
            </div>

            {/* Bottom agave decoration */}
            <div className="flex justify-center mt-6">
              <AgaveAccent className="text-accent/40 rotate-180" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pizza Night Callout */}
      <section className="pb-12 md:pb-20">
        <div className="container max-w-3xl">
          <motion.div
            {...fadeUp}
            className="relative bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center overflow-hidden"
          >
            {/* Subtle decorative corners */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t border-l border-primary-foreground/20 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t border-r border-primary-foreground/20 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b border-l border-primary-foreground/20 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b border-r border-primary-foreground/20 rounded-br-lg" />

            <span className="text-xs font-sans uppercase tracking-[0.3em] opacity-60 mb-3 block">
              🍕 Guest Favorite
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

      {/* CTA with photo background */}
      <section className="relative h-[40dvh] md:h-[50dvh] flex items-center justify-center overflow-hidden">
        <img
          src={foodImg}
          alt="Fresh cuisine at Sempre Avanti"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
        <div className="relative z-10 text-center text-white px-4">
          <p className="font-serif text-2xl md:text-4xl lg:text-5xl font-light mb-6">
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
