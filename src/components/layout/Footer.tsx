import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-16 md:py-20">
        {/* Top: Brand + Tagline */}
        <div className="text-center mb-12">
          <h3 className="font-serif text-3xl md:text-4xl mb-3">Villas Sempre Avanti</h3>
          <p className="text-sm font-sans opacity-70 max-w-md mx-auto leading-relaxed">
            A private beachfront estate on Mexico's Riviera Nayarit. Villa Pietro & Villa Luisa — five bedrooms, fully hosted — always forward.
          </p>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] mb-4 opacity-50">The Estate</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/villas" className="text-sm font-sans opacity-70 hover:opacity-100 transition-opacity">The Villas</Link>
              <Link to="/chef" className="text-sm font-sans opacity-70 hover:opacity-100 transition-opacity">Private Chef</Link>
              <Link to="/wellness" className="text-sm font-sans opacity-70 hover:opacity-100 transition-opacity">Wellness</Link>
              <Link to="/concierge" className="text-sm font-sans opacity-70 hover:opacity-100 transition-opacity">Your Team</Link>
            </div>
          </div>
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] mb-4 opacity-50">Experiences</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/experiences" className="text-sm font-sans opacity-70 hover:opacity-100 transition-opacity">All Experiences</Link>
              <Link to="/experiences/surfing" className="text-sm font-sans opacity-70 hover:opacity-100 transition-opacity">Surfing</Link>
              <Link to="/experiences/boats" className="text-sm font-sans opacity-70 hover:opacity-100 transition-opacity">Boat Tours</Link>
              <Link to="/experiences/golf" className="text-sm font-sans opacity-70 hover:opacity-100 transition-opacity">Golf</Link>
            </div>
          </div>
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] mb-4 opacity-50">Celebrations</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/events" className="text-sm font-sans opacity-70 hover:opacity-100 transition-opacity">Events</Link>
              <Link to="/weddings" className="text-sm font-sans opacity-70 hover:opacity-100 transition-opacity">Weddings</Link>
              <Link to="/private-events" className="text-sm font-sans opacity-70 hover:opacity-100 transition-opacity">Private Events</Link>
            </div>
          </div>
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] mb-4 opacity-50">Plan Your Stay</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/contact" className="text-sm font-sans opacity-70 hover:opacity-100 transition-opacity">Get in Touch</Link>
              <Link to="/location" className="text-sm font-sans opacity-70 hover:opacity-100 transition-opacity">Location & Travel</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/15 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-sans opacity-40">
            © {new Date().getFullYear()} Villas Sempre Avanti. All rights reserved.
          </p>
          <p className="text-xs font-sans opacity-40">
            Designed & built by{" "}
            <a
              href="https://fullyo.io"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-100 hover:opacity-80 transition-opacity underline underline-offset-2"
            >
              Fullyo.io
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
