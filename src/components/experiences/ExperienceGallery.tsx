import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ExperienceGalleryProps {
  images: Array<{ src: string; alt: string }>;
}

export default function ExperienceGallery({ images }: ExperienceGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative group mt-6 mb-2">
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex">
          {images.map((img, i) => (
            <div key={i} className="flex-[0_0_80%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] min-w-0 px-1.5">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-56 md:h-72 object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-background/80 backdrop-blur-sm text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-background/80 backdrop-blur-sm text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}
