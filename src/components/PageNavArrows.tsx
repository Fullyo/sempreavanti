import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PageNavItem {
  label: string;
  path: string;
}

interface PageNavArrowsProps {
  prev?: PageNavItem;
  next?: PageNavItem;
  variant?: "hero" | "bottom";
}

export default function PageNavArrows({ prev, next, variant = "hero" }: PageNavArrowsProps) {
  const isHero = variant === "hero";

  const baseClasses = isHero
    ? "flex items-center gap-1.5 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-xs font-sans uppercase tracking-widest"
    : "flex items-center gap-1.5 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-xs font-sans uppercase tracking-widest";

  return (
    <div className="flex items-center justify-between w-full">
      {prev ? (
        <Link to={prev.path} className={baseClasses}>
          <ChevronLeft size={16} strokeWidth={1.5} />
          <span className="hidden sm:inline">{prev.label}</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link to={next.path} className={baseClasses}>
          <span className="hidden sm:inline">{next.label}</span>
          <ChevronRight size={16} strokeWidth={1.5} />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

// Navigation sequences
export const experiencePages: PageNavItem[] = [
  { label: "Surfing", path: "/experiences/surfing" },
  { label: "Boat Tours & Sailing", path: "/experiences/boats" },
  { label: "Tee Off", path: "/experiences/golf" },
  { label: "Dive In", path: "/experiences/ocean" },
  { label: "Land & Adventure", path: "/experiences/land" },
  { label: "Cultural & Local", path: "/experiences/cultural" },
];

export const estatePages: PageNavItem[] = [
  { label: "The Villas", path: "/villas" },
  { label: "In-Villa Chef", path: "/chef" },
  { label: "Wellness", path: "/wellness" },
  { label: "Your Team", path: "/staff" },
];

export function getPageNav(pages: PageNavItem[], currentPath: string) {
  const idx = pages.findIndex((p) => p.path === currentPath);
  if (idx === -1) return { prev: undefined, next: undefined };
  return {
    prev: pages[(idx - 1 + pages.length) % pages.length],
    next: pages[(idx + 1) % pages.length],
  };
}
