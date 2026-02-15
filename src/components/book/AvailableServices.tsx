import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const services = [
  "Private Chef (Breakfast & Lunch included)",
  "Surfing Lessons",
  "Yoga & Wellness Sessions",
  "ATV & Jungle Tours",
  "Horseback Riding",
  "Boat Charters & Fishing",
  "Whale Watching & Snorkeling",
  "Golf at World-Class Courses",
  "Cultural Tours & Tequila Tastings",
  "Wedding & Event Planning",
];

export default function AvailableServices() {
  return (
    <section className="py-12 md:py-16">
      <div className="container max-w-5xl">
        <h2 className="font-serif text-3xl md:text-4xl font-light mb-8 text-center">Available Services & Experiences</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {services.map((s) => (
            <div key={s} className="flex items-center gap-2 font-sans text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              {s}
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/experiences"
            className="inline-flex items-center gap-2 font-sans text-sm text-accent hover:text-accent/80 transition-colors uppercase tracking-widest"
          >
            Explore All Experiences <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
