import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";

const pricingData = [
  {
    category: "Wellness",
    items: [
      { name: "Private Yoga Session", price: "~$125 USD", note: "1 hr 15 min" },
      { name: "Pilates (Group)", price: "~$50 USD / person", note: "Min 2 people" },
      { name: "Personal Training", price: "~$100 USD / person", note: "Weights included" },
      { name: "Massage (Nirvanna Spa)", price: "~$75 USD / person", note: "In-villa or beachside" },
      { name: "Sound Bath", price: "~$125 USD", note: "Up to 5 people, +~$25 per additional" },
    ],
  },
  {
    category: "Experiences & Adventures",
    items: [
      { name: "Surf Lesson — Sayulita", price: "~$60 USD / person", note: "Min 2 people" },
      { name: "Surf Experience — La Lancha", price: "~$100 USD / person" },
      { name: "Sayulita Taco Tour", price: "~$60 USD / person", note: "Tue–Sun, min 4 people" },
      { name: "Private Cooking Class", price: "~$60 USD / person" },
      { name: "Private Boat Tour (3 hrs)", price: "~$475 USD", note: "Up to 7 guests. 4-hr extension: ~$575 USD" },
      { name: "Fishing Charter (4 hrs)", price: "~$500 USD", note: "Up to 4 people" },
      { name: "Spearfishing — Inshore", price: "~$600 USD", note: "4–5 hrs, up to 3–4 people" },
      { name: "Spearfishing — Deep Water", price: "~$1,050 USD", note: "Full day, up to 3 people" },
      { name: "Polaris UTV — 2-Seater", price: "~$80 USD / day" },
      { name: "Polaris UTV — 4-Seater", price: "~$95 USD / day" },
      { name: "Polaris UTV — 6-Seater", price: "~$110 USD / day" },
    ],
  },
  {
    category: "Transportation",
    items: [
      { name: "Private Airport Transfer (Round Trip)", price: "~$250 USD", note: "Luxury Suburban, seats up to 7" },
    ],
  },
];

export default function Pricing() {
  return (
    <Layout>
      <section className="pt-24 pb-12">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Reference"
            title="Pricing Guide"
            description="All pricing is approximate and provided for reference only. Final charges are in Mexican Pesos at the current exchange rate. Please inquire for exact pricing and availability."
          />
        </div>
      </section>

      {pricingData.map((cat) => (
        <section key={cat.category} className="py-8">
          <div className="container max-w-4xl">
            <h2 className="font-serif text-2xl md:text-3xl mb-6 text-foreground">{cat.category}</h2>
            <div className="divide-y divide-border">
              {cat.items.map((item) => (
                <div key={item.name} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-1">
                  <div>
                    <span className="text-sm font-sans font-medium text-foreground">{item.name}</span>
                    {item.note && (
                      <span className="text-xs font-sans text-muted-foreground block">{item.note}</span>
                    )}
                  </div>
                  <span className="text-sm font-sans font-medium text-accent">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <div className="container max-w-4xl py-12">
        <p className="text-xs font-sans text-muted-foreground text-center italic">
          Prices shown in USD are approximate. Final pricing is in Mexican Pesos at the current exchange rate.
        </p>
      </div>
    </Layout>
  );
}
