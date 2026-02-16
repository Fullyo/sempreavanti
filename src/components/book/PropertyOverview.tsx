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
    <div className="py-6 border-b border-border">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <s.icon className="w-4 h-4 text-accent shrink-0" />
              <div>
                <span className="font-sans text-sm font-semibold block">{s.value}</span>
                <span className="font-sans text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
