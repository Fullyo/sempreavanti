import { Camera } from "lucide-react";

interface PhotoPlaceholderProps {
  label?: string;
  className?: string;
  aspectRatio?: "video" | "square" | "portrait" | "wide";
}

const aspectClasses = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
};

export default function PhotoPlaceholder({
  label = "Photo Coming Soon",
  className = "",
  aspectRatio = "video",
}: PhotoPlaceholderProps) {
  return (
    <div
      className={`relative bg-muted flex flex-col items-center justify-center overflow-hidden ${aspectClasses[aspectRatio]} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-muted" />
      <div className="relative z-10 flex flex-col items-center gap-3 opacity-50">
        <Camera className="w-8 h-8 text-muted-foreground" strokeWidth={1} />
        <span className="font-serif text-sm italic text-muted-foreground tracking-wide">
          {label}
        </span>
      </div>
    </div>
  );
}
