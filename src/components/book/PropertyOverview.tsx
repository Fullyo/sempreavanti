import { BedDouble, Bath, Users, Clock } from "lucide-react";

const stats = [
  { icon: BedDouble, label: "Bedrooms", value: "5" },
  { icon: BedDouble, label: "Beds", value: "7" },
  { icon: Bath, label: "Bathrooms", value: "5.5" },
  { icon: Users, label: "Guests", value: "Up to 14" },
  { icon: Clock, label: "Check-in", value: "4:00 PM" },
  { icon: Clock, label: "Check-out", value: "11:00 AM" },
];

export default function PropertyOverview() {
  return (
    <section className="py-8 border-y border-border">
      <div className="container max-w-5xl">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1.5">
              <s.icon className="w-5 h-5 text-accent" />
              <span className="font-sans text-sm font-semibold">{s.value}</span>
              <span className="font-sans text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
