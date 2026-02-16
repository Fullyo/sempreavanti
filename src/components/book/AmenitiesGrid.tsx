import { useState } from "react";
import {
  Waves, Wind, Wifi, UtensilsCrossed, Flame, Sun,
  Eye, Droplets, Sparkles, ChevronDown,
} from "lucide-react";
import { useGuestyListings } from "@/hooks/useGuestyListings";

const keyAmenities = [
  { icon: Waves, label: "Private Beach" },
  { icon: Droplets, label: "Two Infinity Pools" },
  { icon: Eye, label: "Ocean Views" },
  { icon: Wind, label: "Air Conditioning" },
  { icon: Wifi, label: "High-Speed WiFi" },
  { icon: UtensilsCrossed, label: "Gourmet Kitchen" },
  { icon: Flame, label: "BBQ & Pizza Oven" },
  { icon: Sun, label: "Poolside Tiki Bar" },
  { icon: Sparkles, label: "Daily Housekeeping" },
];

// Items to filter out (internal/redundant Guesty fields)
const FILTERED_AMENITIES = new Set([
  "Essentials", "Cleaning Disinfection", "Enhanced Clean",
  "Host greets you", "Lockbox", "Self check-in",
  "Cleaning before checkout", "Long term stays allowed",
]);

// Category mapping for Guesty amenities
const CATEGORY_MAP: Record<string, string[]> = {
  "Accessibility": [
    "Wide doorway", "Wide clearance to bed", "Wide clearance to shower",
    "Wide entryway", "Step-free access", "Flat smooth pathway to front door",
    "Well-lit path to entrance", "Accessible-height bed", "Accessible-height toilet",
    "Fixed grab bars for shower", "Fixed grab bars for toilet",
  ],
  "Bathroom": [
    "Body soap", "Shampoo", "Conditioner", "Shower gel", "Hot water",
    "Bath towel", "Hand towel", "Toilet paper", "Hair dryer", "Bidet",
  ],
  "Safety": [
    "Smoke detector", "Carbon monoxide detector", "Fire extinguisher",
    "First aid kit", "Buzzer/wireless intercom",
  ],
  "Kitchen & Dining": [
    "Coffee maker", "Coffee", "Blender", "Cookware", "Microwave",
    "Refrigerator", "Dishwasher", "Dishes and silverware", "Oven",
    "Stove", "Toaster", "Cooking basics", "Dining table",
  ],
  "Outdoor": [
    "Private pool", "Pool", "BBQ grill", "Fire pit", "Fire Pit",
    "Hammock", "Patio or balcony", "Outdoor furniture", "Outdoor dining area",
    "Sun loungers", "Beach essentials", "Garden or backyard",
  ],
  "Activities": [
    "Fishing", "Horseback Riding", "Cycling", "Water Sports",
    "Surfing", "Snorkeling", "Kayaking", "Hiking",
  ],
};

function categorizeAmenity(amenity: string): string {
  for (const [category, items] of Object.entries(CATEGORY_MAP)) {
    if (items.some(item => amenity.toLowerCase().includes(item.toLowerCase()))) {
      return category;
    }
  }
  return "General";
}

export default function AmenitiesGrid() {
  const [expanded, setExpanded] = useState(false);
  const { data: listings } = useGuestyListings();

  // Deduplicate amenities across all listings
  const allAmenities = Array.from(
    new Set(listings?.flatMap((l) => l.amenities || []) ?? [])
  )
    .filter((a) => !FILTERED_AMENITIES.has(a))
    .sort();

  // Group by category
  const grouped: Record<string, string[]> = {};
  for (const amenity of allAmenities) {
    const cat = categorizeAmenity(amenity);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(amenity);
  }

  // Sort categories: named ones first, General last
  const categoryOrder = ["Accessibility", "Bathroom", "Kitchen & Dining", "Outdoor", "Activities", "Safety", "General"];
  const sortedCategories = categoryOrder.filter((c) => grouped[c]?.length);

  return (
    <div className="py-8 md:py-10 border-t border-border">
      <h2 className="font-serif text-2xl md:text-3xl font-light mb-6">Amenities</h2>

        {/* Key amenities grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {keyAmenities.map((a) => (
            <div key={a.label} className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border">
              <a.icon className="w-5 h-5 text-accent shrink-0" />
              <span className="font-sans text-sm">{a.label}</span>
            </div>
          ))}
        </div>

        {/* Expandable full amenities */}
        {allAmenities.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setExpanded(!expanded)}
              className="mx-auto flex items-center gap-2 text-sm font-sans text-golden hover:text-golden/80 transition-colors"
            >
              <span>{expanded ? "Hide" : "View"} all {allAmenities.length} amenities</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
            </button>

            {expanded && (
              <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                {sortedCategories.map((category) => (
                  <div key={category}>
                    <h3 className="font-sans text-xs uppercase tracking-widest text-muted-foreground mb-3">{category}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {grouped[category].map((amenity) => (
                        <div key={amenity} className="flex items-center gap-2 py-1.5 px-3 text-sm font-sans text-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-golden shrink-0" />
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  );
}
