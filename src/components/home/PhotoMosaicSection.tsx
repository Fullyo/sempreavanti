import { motion } from "framer-motion";
import { GuestyListing } from "@/hooks/useGuestyListings";

interface PhotoMosaicSectionProps {
  listings?: GuestyListing[];
}

const mosaicCorners = [
  "rounded-tl-[40px]",
  "rounded-tr-[40px]",
  "rounded-bl-[40px] rounded-tr-[40px]",
  "rounded-br-[40px]",
  "rounded-tl-[60px] rounded-br-[60px]",
  "",
  "rounded-tr-[60px] rounded-bl-[60px]",
  "rounded-bl-[40px]",
  "rounded-tl-[40px] rounded-br-[40px]",
  "",
  "rounded-tr-[40px]",
  "rounded-bl-[60px]",
];

export default function PhotoMosaicSection({ listings }: PhotoMosaicSectionProps) {
  const allPictures = listings?.flatMap((l) => l.pictures || []) || [];
  const mosaicPhotos = allPictures.slice(0, 12);

  if (mosaicPhotos.length < 4) return null;

  return (
    <section className="py-4 md:py-8">
      <div className="container max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mosaicPhotos.map((pic, i) => {
            const isLarge = i === 0 || i === 5;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`overflow-hidden ${mosaicCorners[i] || ""} ${isLarge ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <img
                  src={pic.original}
                  alt={`Villas Sempre Avanti ${i + 1}`}
                  className={`w-full object-cover hover:scale-105 transition-transform duration-700 ${
                    isLarge ? "h-64 md:h-full" : "h-48 md:h-64"
                  }`}
                  loading="lazy"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
