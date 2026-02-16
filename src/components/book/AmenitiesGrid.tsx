import {
  Waves, Wind, Wifi, UtensilsCrossed, Flame, Sun,
  Eye, Droplets, Sparkles,
} from "lucide-react";

const amenities = [
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

export default function AmenitiesGrid() {
  return (
    <section className="py-12 md:py-16 bg-card">
      <div className="container max-w-5xl">
        <h2 className="font-serif text-3xl md:text-4xl font-light mb-8 text-center">Amenities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {amenities.map((a) => (
            <div key={a.label} className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border">
              <a.icon className="w-5 h-5 text-accent shrink-0" />
              <span className="font-sans text-sm">{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
