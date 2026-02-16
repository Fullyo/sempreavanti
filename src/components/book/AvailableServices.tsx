import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const services = [
  "Private Chef (Breakfast, Lunch & Dinner upon request)",
  "Surfing Lessons & Guides",
  "Yoga, Sound Healing & Massage",
  "ATV Rentals & Guided Tours",
  "Horseback Riding",
  "Hiking Excursions",
  "Zipline Adventures",
  "Cooking Classes",
  "Boat Charters & Fishing",
  "Whale Watching & Snorkeling",
  "Golf at World-Class Courses",
  "Cultural Tours & Tequila Tastings",
  "Laundry Service",
  "Concierge Assistance",
  "Wedding & Event Planning",
];

export default function AvailableServices() {
  return (
    <div className="py-8 md:py-10 border-t border-border">
      <h2 className="font-serif text-2xl md:text-3xl font-light mb-6">Available Services & Experiences</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map((s) => (
            <div key={s} className="flex items-center gap-2 font-sans text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              {s}
            </div>
          ))}
        </div>
      <div className="mt-6">
        <Link
          to="/experiences"
          className="inline-flex items-center gap-2 font-sans text-sm text-accent hover:text-accent/80 transition-colors uppercase tracking-widest"
        >
          Explore All Experiences <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
