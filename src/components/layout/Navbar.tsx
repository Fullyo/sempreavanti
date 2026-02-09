import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const BOOKING_URL = "https://casasempreavanti.guestybookings.com/en/properties/697bcfcf3f5e990014fbc4dd?minOccupancy=1";

const navLinks = [
  { label: "The Villas", path: "/villas" },
  { label: "Private Chef", path: "/chef" },
  { label: "Wellness", path: "/wellness" },
  { label: "Experiences", path: "/experiences" },
  { label: "Weddings & Events", path: "/events" },
  { label: "Location", path: "/location" },
  { label: "Concierge", path: "/concierge" },
  { label: "Transportation", path: "/transportation" },
  { label: "Get in Touch", path: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-md border-b border-border/50"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link
          to="/"
          className={`font-serif text-xl md:text-2xl font-semibold tracking-wide transition-colors duration-300 ${
            scrolled ? "text-foreground" : "text-white"
          }`}
        >
          Sempre Avanti
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs font-sans font-medium uppercase tracking-widest transition-colors hover:text-turquoise ${
                location.pathname === link.path
                  ? "text-turquoise"
                  : scrolled
                  ? "text-muted-foreground"
                  : "text-white/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
              Check Availability
            </a>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          className={`lg:hidden p-2 transition-colors duration-300 ${
            scrolled ? "text-foreground" : "text-white"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-primary border-b border-border overflow-hidden"
          >
            <div className="container py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-sans font-medium uppercase tracking-widest transition-colors hover:text-turquoise ${
                    location.pathname === link.path ? "text-turquoise" : "text-primary-foreground/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild size="sm" variant="secondary" className="mt-2 w-full rounded-full">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  Check Availability
                </a>
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
