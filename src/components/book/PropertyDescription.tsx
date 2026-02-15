import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function PropertyDescription() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-12 md:py-16">
      <div className="container max-w-5xl">
        <h2 className="font-serif text-3xl md:text-4xl font-light mb-6">About the Estate</h2>

        <div className={`font-sans text-muted-foreground leading-relaxed space-y-4 ${!expanded ? "max-h-[200px] overflow-hidden relative" : ""}`}>
          <p>
            Villas Sempre Avanti is an exclusive beachfront estate located in the prestigious gated community of La Cruz de Huanacaxtle, Riviera Nayarit, Mexico. Set on a private stretch of pristine beach, the property offers an unparalleled luxury retreat for families, groups, and special events.
          </p>
          <p>
            The estate comprises two stunning villas — <strong>Villa Luisa</strong> and <strong>Casa Pietro</strong> — which can be booked together for full exclusivity accommodating up to 14 guests across 5 beautifully appointed bedrooms.
          </p>
          <p>
            <strong>Villa Luisa</strong> features 3 spacious bedrooms, each with ensuite bathrooms and ocean views. The open-concept living area flows seamlessly to an infinity pool overlooking the Pacific Ocean. A fully equipped gourmet kitchen, outdoor dining terrace, and private rooftop palapa provide the perfect settings for entertaining.
          </p>
          <p>
            <strong>Casa Pietro</strong> offers 2 additional bedrooms with ensuite bathrooms, a private plunge pool, and its own living area. Connected to Villa Luisa by tropical garden pathways, it provides a perfect balance of togetherness and privacy.
          </p>
          <p>
            Included with your stay: daily housekeeping, a private chef for breakfast and lunch, a dedicated concierge to arrange activities and excursions, and complimentary high-speed WiFi throughout the property.
          </p>
          <p>
            The estate also features a private beach area with lounge chairs and palapa shade, a wood-fired pizza oven, BBQ area, outdoor shower, and lush tropical landscaping. Whether you're here for a family vacation, a celebration with friends, or a destination wedding, Villas Sempre Avanti provides an unforgettable backdrop.
          </p>

          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
          )}
        </div>

        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="mt-4 flex items-center gap-1 font-sans text-sm text-accent hover:text-accent/80 transition-colors"
          >
            Read More <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>
    </section>
  );
}
