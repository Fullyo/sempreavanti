const menuData = [
  {
    title: "Breakfast",
    subtitle: "Desayuno",
    items: [
      { name: "Chilaquiles with Egg", desc: "Green or red, served with egg" },
      { name: "Ranchero Eggs", desc: "Fried egg on top of fried tortilla with salsa" },
      { name: "Waffles with Fruit", desc: "Fresh waffles topped with seasonal tropical fruit" },
      { name: "Pancakes with Fried Banana", desc: "Fluffy pancakes with caramelized banana" },
      { name: "Breakfast Burritos", desc: "Hearty morning wrap with eggs and fresh fillings" },
      { name: "Blueberry Pancakes", desc: "Classic pancakes loaded with blueberries" },
      { name: "French Toast with Ice Cream", desc: "Golden French toast served with ice cream" },
      { name: "Eggs Benedict", desc: "Poached eggs with hollandaise on English muffin" },
      { name: "Enchiladas Suizas", desc: "Creamy green sauce with grilled cheese on top" },
      { name: "Scrambled Eggs", desc: "With pico de gallo" },
      { name: "Avocado Toast with Eggs", desc: "Sourdough toasted bread with avocado on top & egg" },
      { name: "Grilled Cheese Sandwich", desc: "Classic grilled cheese, golden and melty" },
      { name: "Croque Madame", desc: "French classic with ham, cheese & béchamel" },
    ],
    footnotes: ["*Fruit & yogurt bowls included", "*Orange juice & coffee included"],
  },
  {
    title: "Appetizers",
    subtitle: "Entradas",
    items: [
      { name: "Guac & Chips", desc: "Fresh avocado with lime juice mix with pico de gallo served with corn chips" },
      { name: "Catch of the Day", desc: "Prepared in sashimi, tiradito, ceviche or aguachile, served with corn tostados" },
      { name: "Cactus Salad", desc: "Olive oil, cactus, fresh tomato, onion served with special sauce" },
      { name: "Corn & Beet Root Salad", desc: "Roast beet & grilled cornlets, served on top of green leaves mix with sweet & sour vinaigrette" },
      { name: "Shrimp Sashimi", desc: "Leche de tigre & coconut sauce, served with mushroom slices & toasted corn" },
      { name: "Tortilla Soup", desc: "Tomato & chicken broth served w/ crispy tortilla strips, chicken, avocado, cheese & sour cream" },
      { name: "Sopes", desc: "Small corn thick tortilla, topped w/ beans, slow cooked beef chest" },
      { name: "Shrimp Diabla Style", desc: "Cooked shrimp into a sweet-spicy sauce, a classical dish in the Bahía area" },
      { name: "Tuna Tartar", desc: "Fresh tuna chopped with spices & served with corn tostadas" },
      { name: "Sweet Potato Sashimi", desc: "Served with a duo of leche de tigre & corn tostadas" },
    ],
  },
  {
    title: "Lunch & Dinner",
    subtitle: "Almuerzo / Cena",
    items: [
      { name: "Pozole", desc: "Broth with corn kernels, served with your choice of chicken, shrimp, pork or vegetarian" },
      { name: "Pastor Catch of the Day", desc: "Fish fillet with pastor adobo, served with purée & pineapple chutney" },
      { name: "Mexican Style Grill Steak", desc: "Special beer & spices marinated rib eye steak, served with chistorra & stuffed jalapeño" },
      { name: "Mole Poblano", desc: "Chicken breast dressed with a smooth poblano mole & little chocolate touch served with rice" },
      { name: "Zarandeado", desc: "Fish fillet with special adobo, grilled until crispy on the outside, classical Nayarit dish" },
      { name: "Pipián Duo, Green & Red", desc: "Double cooked pork belly, grilled until crispy, served over a bed of pipián duo" },
      { name: "Barbacoa", desc: "Red beef broth with dry peppers & spices, slow cook until tender, served with handmade tortillas" },
      { name: "Enchiladas", desc: "Your choice of green or red sauce, rolled tortilla stuffed with shredded chicken" },
      { name: "Tetela de Birria", desc: "Fried quesadilla in triangle shape, stuffed with shredded beef birria, served with consomé" },
      { name: "Hibiscus Mole", desc: "Red mole served with beef tenderloin & plantain garnish" },
      { name: "Chile Relleno", desc: "Stuffed poblano pepper, battered & served in red sauce, with sour cream garnish" },
    ],
  },
  {
    title: "Desserts",
    subtitle: "Postres",
    items: [
      { name: "Caramel Flan", desc: "Creamy caramel flan with a brûlée sugar layer on top" },
      { name: "Rice Pudding", desc: "Grandma's special dessert, milky rice pudding" },
      { name: "Capirotada", desc: "Mexican brioche budín, served with salty caramel sauce" },
      { name: "Churros", desc: "Golden crispy churros with sugar, served with caramel sauce & ice cream" },
      { name: "Corn Bread", desc: "Super creamy soft bread served with ice cream" },
      { name: "Volcán", desc: "Chocolate fudge cake, served with ice cream" },
      { name: "Fried Banana", desc: "Butter fried bananas flambéed, served with ice cream" },
      { name: "Buñuelos", desc: "Fritters served in the most classical way with the piloncillo spiced syrup" },
      { name: "Jericalla", desc: "Mexican creamy dessert, milky base similar to flan with the top burnt in the oven. Classic from Guadalajara" },
    ],
  },
];

export default function MenuScreenshot() {
  return (
    <div
      style={{
        width: "1400px",
        aspectRatio: "16 / 10",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        background: "linear-gradient(135deg, #0a1628 0%, #0f2027 40%, #132a2e 100%)",
        color: "#f0e6d3",
        padding: "36px 40px 28px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Subtle border frame */}
      <div
        style={{
          position: "absolute",
          inset: "12px",
          border: "1px solid rgba(196, 164, 106, 0.2)",
          borderRadius: "4px",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px", position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontSize: "10px",
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#c4a46a",
            marginBottom: "4px",
          }}
        >
          Sempre Avanti Estate
        </p>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 300,
            margin: 0,
            letterSpacing: "0.05em",
            color: "#f0e6d3",
          }}
        >
          Gourmet Menu
        </h1>
        <div
          style={{
            width: "60px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, #c4a46a, transparent)",
            margin: "8px auto 0",
          }}
        />
      </div>

      {/* 4-Column Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "24px",
          flex: 1,
          minHeight: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        {menuData.map((cat) => (
          <div key={cat.title} style={{ display: "flex", flexDirection: "column" }}>
            {/* Category Header */}
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 500,
                  margin: 0,
                  color: "#f0e6d3",
                  letterSpacing: "0.03em",
                }}
              >
                {cat.title}
              </h2>
              <p
                style={{
                  fontSize: "9px",
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#c4a46a",
                  margin: "2px 0 0",
                }}
              >
                {cat.subtitle}
              </p>
              <div
                style={{
                  width: "30px",
                  height: "1px",
                  background: "#c4a46a",
                  margin: "6px auto 0",
                  opacity: 0.4,
                }}
              />
            </div>

            {/* Items */}
            <div style={{ flex: 1 }}>
              {cat.items.map((item) => (
                <div key={item.name} style={{ marginBottom: "5px", textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: "11.5px",
                      fontWeight: 600,
                      margin: 0,
                      lineHeight: 1.25,
                      color: "#f0e6d3",
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      fontSize: "8.5px",
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 300,
                      margin: "1px 0 0",
                      lineHeight: 1.3,
                      color: "rgba(240, 230, 211, 0.55)",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Footnotes for Breakfast */}
            {cat.footnotes && (
              <div style={{ marginTop: "6px", borderTop: "1px solid rgba(196,164,106,0.15)", paddingTop: "4px" }}>
                {cat.footnotes.map((fn) => (
                  <p
                    key={fn}
                    style={{
                      fontSize: "7.5px",
                      fontFamily: "'Montserrat', sans-serif",
                      fontStyle: "italic",
                      color: "rgba(240,230,211,0.45)",
                      margin: "1px 0",
                      textAlign: "center",
                    }}
                  >
                    {fn}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pizza Night Footer */}
      <div
        style={{
          marginTop: "12px",
          borderTop: "1px solid rgba(196, 164, 106, 0.25)",
          paddingTop: "10px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontSize: "8px",
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#c4a46a",
            marginBottom: "2px",
          }}
        >
          Guest Favorite
        </p>
        <p style={{ fontSize: "16px", fontWeight: 400, margin: "0 0 4px", color: "#f0e6d3" }}>
          Pizza Night
        </p>
        <p
          style={{
            fontSize: "8px",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            color: "rgba(240, 230, 211, 0.5)",
            maxWidth: "500px",
            margin: "0 auto",
            lineHeight: 1.4,
          }}
        >
          Pizza night can be arranged but we need to know the night before or first thing in the morning to make sure the oven can be heated for at least 5 hours and we have the necessary toppings for your specific pizza.
        </p>
      </div>
    </div>
  );
}
