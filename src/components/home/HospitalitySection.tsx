import { motion } from "framer-motion";
import { GuestyListing } from "@/hooks/useGuestyListings";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

interface HospitalitySectionProps {
  listings?: GuestyListing[];
}

export default function HospitalitySection({ listings }: HospitalitySectionProps) {
  const staffPhoto = listings?.[1]?.pictures?.[2]?.original;

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-primary via-ocean to-primary text-primary-foreground">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-turquoise mb-3 block">
              The Philosophy
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight mb-6">
              Hosted, Not Rented
            </h2>
            <p className="text-base font-sans font-light leading-relaxed opacity-85 mb-6">
              At Sempre Avanti, you're not checking into a rental — you're arriving at a fully hosted private estate. From the moment your concierge greets you to the final farewell, every detail is personally attended to.
            </p>
            <p className="text-base font-sans font-light leading-relaxed opacity-85 mb-6">
              Your team — private chefs Ricardo and Crethell, housekeeper Angy, and caretaker Paco — work seamlessly behind the scenes so you can simply be present.
            </p>
            <div className="flex gap-8 mt-8">
              {[
                { label: "Private Chefs", value: "2" },
                { label: "Dedicated Staff", value: "4+" },
                { label: "Years of Service", value: "8+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="font-serif text-3xl block text-golden">{stat.value}</span>
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
                className="w-full h-[500px] object-cover rounded-tl-[80px] rounded-br-[80px]"
              />
            ) : (
              <PhotoPlaceholder label="Your Dedicated Team" className="h-[500px] !aspect-auto rounded-tl-[80px] rounded-br-[80px]" />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
