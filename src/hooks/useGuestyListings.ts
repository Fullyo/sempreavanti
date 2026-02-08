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

// Fallback data used when Guesty API is rate-limited or unavailable
const fallbackListings: GuestyListing[] = [
  {
    _id: "casa-pietro-fallback",
    title: "Casa Pietro",
    nickname: "Casa Pietro",
    pictures: [],
    description: "Casa Pietro is the larger of the two Sempre Avanti villas, featuring three luxury king bedrooms with en-suite bathrooms, expansive living areas, and direct beach access.",
    publicDescription: {
      summary: "Casa Pietro is the larger of the two Sempre Avanti villas, featuring three luxury king bedrooms with en-suite bathrooms, expansive living areas, and direct beach access. The open-concept design blends indoor and outdoor living seamlessly, with a gourmet kitchen where your private chefs prepare every meal.",
    },
    amenities: ["Beachfront", "Private Pool", "Air Conditioning", "WiFi", "Full Kitchen", "BBQ", "Fire Pit", "Beach Access", "Ocean View", "Parking", "Outdoor Dining", "Terrace"],
    address: { city: "Sayulita", state: "Nayarit", country: "Mexico" },
    bedrooms: 3,
    bathrooms: 3,
    beds: 3,
    guests: 6,
    accommodates: 6,
  },
  {
    _id: "casa-luisa-fallback",
    title: "Casa Luisa",
    nickname: "Casa Luisa",
    pictures: [],
    description: "Casa Luisa is the intimate sister villa, with two beautifully appointed bedrooms and a cozy, romantic atmosphere.",
    publicDescription: {
      summary: "Casa Luisa is the intimate sister villa, with two beautifully appointed bedrooms and a cozy, romantic atmosphere. Connected to Casa Pietro, it creates the complete Sempre Avanti estate experience with shared pool, beach, and staff.",
    },
    amenities: ["Beachfront", "Shared Pool", "Air Conditioning", "WiFi", "Kitchenette", "Beach Access", "Ocean View", "Terrace", "Garden", "Outdoor Shower"],
    address: { city: "Sayulita", state: "Nayarit", country: "Mexico" },
    bedrooms: 2,
    bathrooms: 2,
    beds: 2,
    guests: 4,
    accommodates: 4,
  },
  {
    _id: "estate-combined-fallback",
    title: "Casa Sempre Avanti — Full Estate",
    nickname: "Full Estate",
    pictures: [],
    description: "The complete Casa Sempre Avanti estate — both villas combined into one private beachfront destination with five bedrooms, private beach, pool, and full staff.",
    publicDescription: {
      summary: "The complete Casa Sempre Avanti estate — both villas combined into one private beachfront destination with five bedrooms, private beach, pool, fire pit, and dedicated staff including private chefs, concierge, and daily housekeeping.",
    },
    amenities: ["Private Beach", "Pool", "Fire Pit", "Full Staff", "Private Chef", "Concierge", "UTV Rentals", "WiFi", "Air Conditioning", "Beachfront Dining", "Yoga Space", "BBQ"],
    address: { city: "Sayulita", state: "Nayarit", country: "Mexico" },
    bedrooms: 5,
    bathrooms: 5,
    beds: 5,
    guests: 10,
    accommodates: 10,
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
          return results;
        }
        // API returned empty — use fallback
        console.log("Guesty API returned empty results, using fallback data");
        return fallbackListings;
      } catch (err) {
        console.warn("Guesty API unavailable, using fallback data:", err);
        return fallbackListings;
      }
    },
    staleTime: 1000 * 60 * 10, // 10 min cache
    retry: 1, // Only retry once since we have fallback
  });
}
