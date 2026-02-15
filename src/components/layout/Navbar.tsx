import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import InquiryDialog from "@/components/InquiryDialog";

interface DropdownGroup {
  label: string;
  children: { label: string; path: string }[];
}

interface DirectLink {
  label: string;
  path: string;
  isInquiry?: boolean;
}

type NavItem = DropdownGroup | DirectLink;

const isDropdown = (item: NavItem): item is DropdownGroup => "children" in item;

const navItems: NavItem[] = [
  {
    label: "The Estate",
    children: [
      { label: "The Villas", path: "/villas" },
      { label: "In-Villa Chef", path: "/chef" },
      { label: "Wellness", path: "/wellness" },
      { label: "Your Team", path: "/staff" },
    ],
  },
  {
    label: "Experiences",
    children: [
      { label: "Surfing", path: "/experiences/surfing" },
      { label: "Boat Tours & Sailing", path: "/experiences/boats" },
      { label: "Tee Off", path: "/experiences/golf" },
      { label: "Dive In", path: "/experiences/ocean" },
      { label: "Land & Adventure", path: "/experiences/land" },
      { label: "Cultural & Local", path: "/experiences/cultural" },
    ],
  },
  {
    label: "Celebrations",
    children: [
      { label: "Weddings", path: "/weddings" },
      { label: "Private Events", path: "/events" },
    ],
  },
  { label: "Location", path: "/location" },
  { label: "Get in Touch", path: "/contact", isInquiry: true },
];

function NavDropdown({
  group,
  scrolled,
  pathname,
}: {
  group: DropdownGroup;
  scrolled: boolean;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const isActive = group.children.some((c) => pathname === c.path || pathname.startsWith(c.path + "/"));

  const handleEnter = () => {
    clearTimeout(timeout.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className={`flex items-center gap-1 text-xs font-sans font-medium uppercase tracking-widest transition-colors hover:text-turquoise ${
          isActive
            ? "text-turquoise"
            : scrolled
            ? "text-foreground"
            : "text-white/80"
        }`}
      >
        {group.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-[100]"
          >
            <div className="bg-white rounded-lg shadow-lg border border-border/40 py-2 min-w-[180px]">
              {group.children.map((child) => (
                <Link
                  key={child.path}
                  to={child.path}
                  className={`block px-5 py-2.5 text-xs font-sans font-medium uppercase tracking-widest transition-colors hover:bg-muted hover:text-turquoise ${
                    pathname === child.path
                      ? "text-turquoise"
                      : "text-foreground"
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
          ? "bg-white/[0.98] backdrop-blur-lg shadow-sm border-b border-border/30"
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
          Villas Sempre Avanti
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) =>
            isDropdown(item) ? (
              <NavDropdown
                key={item.label}
                group={item}
                scrolled={scrolled}
                pathname={location.pathname}
              />
            ) : (item as DirectLink).isInquiry ? (
              <InquiryDialog key={item.label}>
                <button
                  className={`text-xs font-sans font-medium uppercase tracking-widest transition-colors hover:text-turquoise ${
                    scrolled ? "text-foreground" : "text-white/80"
                  }`}
                >
                  {item.label}
                </button>
              </InquiryDialog>
            ) : (
              <Link
                key={(item as DirectLink).path}
                to={(item as DirectLink).path}
                className={`text-xs font-sans font-medium uppercase tracking-widest transition-colors hover:text-turquoise ${
                  location.pathname === (item as DirectLink).path
                    ? "text-turquoise"
                    : scrolled
                    ? "text-foreground"
                    : "text-white/80"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
          <Button
            asChild
            size="sm"
            className="ml-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link to="/book">
              Check Availability
            </Link>
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
            <div className="container py-6 flex flex-col gap-1">
              {navItems.map((item) =>
                isDropdown(item) ? (
                  <div key={item.label} className="mb-2">
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-primary-foreground/50 mb-1 block px-1">
                      {item.label}
                    </span>
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        onClick={() => setMobileOpen(false)}
                        className={`block py-2 px-3 text-sm font-sans font-medium uppercase tracking-widest transition-colors hover:text-turquoise ${
                          location.pathname === child.path
                            ? "text-turquoise"
                            : "text-primary-foreground/80"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (item as DirectLink).isInquiry ? (
                  <InquiryDialog key={item.label}>
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 px-1 text-sm font-sans font-medium uppercase tracking-widest transition-colors hover:text-turquoise text-primary-foreground/80 text-left"
                    >
                      {item.label}
                    </button>
                  </InquiryDialog>
                ) : (
                  <Link
                    key={(item as DirectLink).path}
                    to={(item as DirectLink).path}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-2 px-1 text-sm font-sans font-medium uppercase tracking-widest transition-colors hover:text-turquoise ${
                      location.pathname === (item as DirectLink).path
                        ? "text-turquoise"
                        : "text-primary-foreground/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="mt-3 w-full rounded-full"
              >
                <Link to="/book" onClick={() => setMobileOpen(false)}>
                  Check Availability
                </Link>
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
