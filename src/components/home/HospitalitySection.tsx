import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { GuestyListing } from "@/hooks/useGuestyListings";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

interface HospitalitySectionProps {
  listings?: GuestyListing[];
}

export default function HospitalitySection({ listings }: HospitalitySectionProps) {
  const staffPhoto = listings?.[1]?.pictures?.[2]?.original;

  return (
    <section className="py-20 md:py-32 bg-primary text-primary-foreground">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs font-sans uppercase tracking-[0.3em] opacity-70 mb-3 block">
              The Philosophy
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight mb-6">
              Hosted, Not Rented
            </h2>
            <p className="text-base font-sans font-light leading-relaxed opacity-85 mb-6">
              At Sempre Avanti, you're not checking into a rental — you're arriving at a fully hosted private estate. From the moment your concierge Eno greets you to the final farewell, every detail is personally attended to.
            </p>
            <p className="text-base font-sans font-light leading-relaxed opacity-85 mb-6">
              Your team — private chefs Ricardo and Crethell, housekeeper Angy, and caretaker Paco — work seamlessly behind the scenes so you can simply be present.
            </p>
            <div className="flex gap-8 mt-8">
              {[
                { label: "Private Chefs", value: "2" },
                { label: "Dedicated Staff", value: "4+" },
                { label: "On-Site Daily", value: "Yes" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="font-serif text-3xl block">{stat.value}</span>
                  <span className="text-xs font-sans uppercase tracking-widest opacity-60">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {staffPhoto ? (
              <img
                src={staffPhoto}
                alt="Sempre Avanti hospitality"
                className="w-full h-[500px] object-cover"
              />
            ) : (
              <PhotoPlaceholder label="Your Dedicated Team" className="h-[500px] !aspect-auto" />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
