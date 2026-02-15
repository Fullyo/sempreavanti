import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GuestyListing {
  _id: string;
  title: string;
  nickname: string;
  pictures: Array<{ original: string; thumbnail: string; caption?: string }>;
  description: string;
  publicDescription?: {
    summary?: string;
    space?: string;
    access?: string;
    neighborhood?: string;
    transit?: string;
    notes?: string;
    interactionWithGuests?: string;
    houseRules?: string;
  };
  amenities: string[];
  address: {
    full?: string;
    city?: string;
    state?: string;
    country?: string;
    lat?: number;
    lng?: number;
  };
  bedrooms: number;
  bathrooms: number;
  beds: number;
  guests: number;
  accommodates: number;
}

// Metadata-only fallback (no photos) used when Guesty API is unavailable
const fallbackListings: GuestyListing[] = [
  {
    _id: "casa-pietro-fallback",
    title: "Villa Pietro",
    nickname: "Villa Pietro",
    pictures: [],
    description: "Villa Pietro in Patzcuarito offers an exclusive blend of tropical serenity and refined design within the private Patzcuaro Beach enclave.",
    publicDescription: {
      summary: "Villa Pietro in Patzcuarito offers an exclusive blend of tropical serenity and refined design within the private Patzcuaro Beach enclave. This two-bedroom beachfront villa is part of the Villas Sempre Avanti estate, featuring five-star architecture, ocean views, and personalized hospitality in a more intimate and romantic setting. Surrounded by lush jungle and the sound of the Pacific, the villa sits along 250 feet of private beachfront, just 8–10 minutes from both Sayulita and Punta de Mita.",
    },
    amenities: ["Beachfront", "Private Pool", "Air Conditioning", "WiFi", "Full Kitchen", "BBQ", "Fire Pit", "Beach Access", "Ocean View", "Parking", "Outdoor Dining", "Terrace"],
    address: { city: "Patzcuarito", state: "Nayarit", country: "Mexico" },
    bedrooms: 2,
    bathrooms: 2.5,
    beds: 3,
    guests: 6,
    accommodates: 6,
  },
  {
    _id: "villa-luisa-fallback",
    title: "Villa Luisa - Private Beach Poolside Ocean View",
    nickname: "Villa Luisa",
    pictures: [],
    description: "Villa Luisa is a 3-bedroom beachfront retreat within the Villas Sempre Avanti estate, featuring spacious living areas, a poolside tiki bar, pizza oven, and panoramic ocean views from every room.",
    publicDescription: {
      summary: "Villa Luisa is a 3-bedroom beachfront retreat within the Villas Sempre Avanti estate, offering tropical elegance across spacious indoor-outdoor living areas. Highlights include a poolside tiki bar, wood-fired pizza oven, panoramic ocean views from every room, and direct access to 250 feet of private beach. Located just 10 minutes from Sayulita and Punta de Mita.",
    },
    amenities: ["Beachfront", "Private Pool", "Air Conditioning", "WiFi", "Full Kitchen", "Beach Access", "Ocean View", "Terrace", "Fire Pit", "Outdoor Kitchen"],
    address: { city: "Patzcuarito", state: "Nayarit", country: "Mexico" },
    bedrooms: 3,
    bathrooms: 3.5,
    beds: 4,
    guests: 8,
    accommodates: 8,
  },
  {
    _id: "estate-combined-fallback",
    title: "Villas Sempre Avanti — Full Estate",
    nickname: "Full Estate",
    pictures: [],
    description: "The complete Villas Sempre Avanti estate — both villas combined into one private beachfront destination with five bedrooms, private beach, pool, fire pit, and dedicated staff.",
    publicDescription: {
      summary: "The complete Villas Sempre Avanti estate — both villas combined into one private beachfront destination with five bedrooms, private beach, pool, fire pit, and dedicated staff including private chefs, concierge, and daily housekeeping.",
    },
    amenities: ["Private Beach", "Pool", "Fire Pit", "Full Staff", "Private Chef", "Concierge", "UTV Rentals", "WiFi", "Air Conditioning", "Beachfront Dining", "Yoga Space", "BBQ"],
    address: { city: "Patzcuarito", state: "Nayarit", country: "Mexico" },
    bedrooms: 5,
    bathrooms: 5,
    beds: 5,
    guests: 14,
    accommodates: 14,
  },
];

export function useGuestyListings() {
  return useQuery({
    queryKey: ["guesty-listings"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke("guesty-listings");
        if (error) throw error;
        const results = data?.results as GuestyListing[];
        if (results && results.length > 0) {
          const totalPhotos = results.reduce((sum, l) => sum + (l.pictures?.length || 0), 0);
          console.log(`✅ Guesty API: ${results.length} listings, ${totalPhotos} photos loaded`);
          return results;
        }
        console.log("Guesty API returned empty results, using fallback data");
        return fallbackListings;
      } catch (err) {
        console.warn("Guesty API unavailable, using fallback data:", err);
        return fallbackListings;
      }
    },
    staleTime: 1000 * 60 * 2,
    refetchOnMount: "always",
    retry: 1,
  });
}
