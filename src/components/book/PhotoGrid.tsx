import { useState } from "react";
import { Grid2X2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGuestyListings } from "@/hooks/useGuestyListings";
import useEmblaCarousel from "embla-carousel-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Local fallback photos
import estate1 from "@/assets/estate-1.jpeg";
import estate2 from "@/assets/estate-2.jpeg";
import estate3 from "@/assets/estate-3.jpeg";
import estate4 from "@/assets/estate-4.jpeg";
import estate5 from "@/assets/estate-5.jpeg";
import estate6 from "@/assets/estate-6.jpeg";
import estate7 from "@/assets/estate-7.jpeg";
import estate8 from "@/assets/estate-8.jpeg";
import estate9 from "@/assets/estate-9.jpeg";
import estate10 from "@/assets/estate-10.jpeg";
import estate11 from "@/assets/estate-11.jpeg";
import estate12 from "@/assets/estate-12.jpeg";
import estate13 from "@/assets/estate-13.jpeg";
import estate14 from "@/assets/estate-14.jpeg";
import estate15 from "@/assets/estate-15.jpeg";
import estate16 from "@/assets/estate-16.jpeg";
import estateSleeping from "@/assets/estate-sleeping.jpg";
import villaHero from "@/assets/villa-hero.jpg";
import privateBeach from "@/assets/private-beach.png";
import wellnessDrone from "@/assets/wellness-drone.jpg";

const LOCAL_PHOTOS = [
  estate1, estate2, estate3, estate4, estate5, estate6, estate7, estate8,
  estate9, estate10, estate11, estate12, estate13, estate14, estate15, estate16,
  estateSleeping, villaHero, privateBeach, wellnessDrone,
].map((src, i) => ({ original: src, caption: `Estate photo ${i + 1}` }));

type Photo = { original: string; caption?: string; thumbnail?: string };

export default function PhotoGrid() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { data: listings } = useGuestyListings();
  const isMobile = useIsMobile();

  const guestyPhotos = listings?.flatMap((l) => l.pictures || []) ?? [];
  const photos: Photo[] = guestyPhotos.length > 0 ? guestyPhotos : LOCAL_PHOTOS;
  const displayPhotos = photos.slice(0, 5);

  if (isMobile) {
    return (
      <>
        <MobileCarousel photos={photos} onShowAll={() => setLightboxOpen(true)} />
        <LightboxGallery photos={photos} open={lightboxOpen} onClose={() => setLightboxOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className="relative rounded-xl overflow-hidden">
        <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-[28rem] md:h-[32rem]">
          {/* Main large photo */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="col-span-2 row-span-2 relative group cursor-pointer"
          >
            <img
              src={displayPhotos[0]?.original}
              alt={displayPhotos[0]?.caption || "Main photo"}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </button>

          {/* 4 smaller photos */}
          {displayPhotos.slice(1, 5).map((photo, i) => (
            <button
              key={i}
              onClick={() => setLightboxOpen(true)}
              className="relative group cursor-pointer overflow-hidden"
            >
              <img
                src={photo.original}
                alt={photo.caption || `Photo ${i + 2}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
              />
            </button>
          ))}
        </div>

        {/* Show all photos button */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm text-foreground border border-border px-4 py-2 rounded-lg font-sans text-sm hover:bg-background transition-colors shadow-sm"
        >
          <Grid2X2 className="w-4 h-4" />
          Show all {photos.length} photos
        </button>
      </div>

      <LightboxGallery photos={photos} open={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </>
  );
}

/* ───────── Mobile Carousel ───────── */

function MobileCarousel({ photos, onShowAll }: { photos: Photo[]; onShowAll: () => void }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  emblaApi?.on("select", () => {
    setCurrentIndex(emblaApi.selectedScrollSnap());
  });

  return (
    <div className="relative rounded-xl overflow-hidden">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {photos.slice(0, 20).map((photo, i) => (
            <div key={i} className="min-w-0 shrink-0 grow-0 basis-full">
              <img
                src={photo.original}
                alt={photo.caption || `Photo ${i + 1}`}
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Counter */}
      <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs font-sans px-3 py-1.5 rounded-full backdrop-blur-sm">
        {currentIndex + 1} / {Math.min(photos.length, 20)}
      </div>

      {/* Show all */}
      <button
        onClick={onShowAll}
        className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm text-foreground border border-border px-3 py-1.5 rounded-lg font-sans text-xs shadow-sm"
      >
        <Grid2X2 className="w-3.5 h-3.5" />
        All photos
      </button>
    </div>
  );
}

/* ───────── Lightbox Gallery ───────── */

function LightboxGallery({ photos, open, onClose }: { photos: Photo[]; open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90dvh] overflow-y-auto p-4 md:p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 w-9 h-9 flex items-center justify-center rounded-full bg-background border border-border hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <h3 className="font-serif text-2xl font-light mb-4">All Photos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {photos.map((photo, i) => (
            <img
              key={i}
              src={photo.original}
              alt={photo.caption || `Photo ${i + 1}`}
              className="w-full aspect-[4/3] object-cover rounded-lg"
              loading="lazy"
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
