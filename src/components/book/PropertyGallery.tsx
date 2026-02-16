import VillaCarousel from "@/components/VillaCarousel";
import { useGuestyListings } from "@/hooks/useGuestyListings";

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

export default function PropertyGallery() {
  const { data: listings } = useGuestyListings();

  // Collect all photos from all Guesty listings
  const guestyPhotos = listings?.flatMap((l) => l.pictures || []) ?? [];
  const photos = guestyPhotos.length > 0 ? guestyPhotos : LOCAL_PHOTOS;

  return (
    <section className="py-12 md:py-16">
      <div className="container max-w-5xl">
        <VillaCarousel pictures={photos} villaName="Villas Sempre Avanti" />
      </div>
    </section>
  );
}
