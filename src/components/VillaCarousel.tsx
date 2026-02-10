import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface VillaCarouselProps {
  pictures: Array<{ original: string; thumbnail?: string; caption?: string }>;
  villaName: string;
}

export default function VillaCarousel({ pictures, villaName }: VillaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!pictures || pictures.length === 0) return null;

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-tl-[40px] rounded-br-[40px]" ref={emblaRef}>
        <div className="flex">
          {pictures.map((pic, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0">
              <img
                src={pic.original}
                alt={`${villaName} ${i + 1}`}
                className="w-full h-80 md:h-[28rem] object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-background/80 backdrop-blur-sm text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous photo"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-background/80 backdrop-blur-sm text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next photo"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
