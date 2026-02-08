import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-2xl mb-4">Sempre Avanti</h3>
            <p className="text-sm opacity-80 leading-relaxed font-sans">
              A private beachfront destination just outside Sayulita, Mexico.
              Two luxury villas, five bedrooms, fully hosted.
            </p>
          </div>
          <div>
            <h4 className="font-sans text-xs uppercase tracking-widest mb-4 opacity-60">Explore</h4>
            <div className="flex flex-col gap-2">
              <Link to="/villas" className="text-sm font-sans opacity-80 hover:opacity-100 transition-opacity">The Villas</Link>
              <Link to="/chef" className="text-sm font-sans opacity-80 hover:opacity-100 transition-opacity">Private Chef</Link>
              <Link to="/wellness" className="text-sm font-sans opacity-80 hover:opacity-100 transition-opacity">Wellness</Link>
              <Link to="/experiences" className="text-sm font-sans opacity-80 hover:opacity-100 transition-opacity">Experiences</Link>
              <Link to="/events" className="text-sm font-sans opacity-80 hover:opacity-100 transition-opacity">Weddings & Events</Link>
            </div>
          </div>
          <div>
            <h4 className="font-sans text-xs uppercase tracking-widest mb-4 opacity-60">Connect</h4>
            <div className="flex flex-col gap-2">
              <Link to="/contact" className="text-sm font-sans opacity-80 hover:opacity-100 transition-opacity">Get in Touch</Link>
              <Link to="/concierge" className="text-sm font-sans opacity-80 hover:opacity-100 transition-opacity">Concierge & Staff</Link>
              <Link to="/transportation" className="text-sm font-sans opacity-80 hover:opacity-100 transition-opacity">Transportation</Link>
              <Link to="/location" className="text-sm font-sans opacity-80 hover:opacity-100 transition-opacity">Location</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-xs font-sans opacity-50">© {new Date().getFullYear()} Casa Sempre Avanti. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
