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
    pictures: [
      { original: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1615571022219-eb45cf7faa36?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80", thumbnail: "" },
    ],
    description: "Casa Pietro is the larger of the two Sempre Avanti villas, featuring three luxury king bedrooms with en-suite bathrooms, expansive living areas, and direct beach access. The open-concept design blends indoor and outdoor living seamlessly.",
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
    pictures: [
      { original: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80", thumbnail: "" },
    ],
    description: "Casa Luisa is the intimate sister villa, with two beautifully appointed bedrooms and a cozy, romantic atmosphere. Perfect for couples or as the second half of a larger group booking.",
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
    pictures: [
      { original: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80", thumbnail: "" },
      { original: "https://images.unsplash.com/photo-1504681869696-d977211a5f4c?w=1200&q=80", thumbnail: "" },
    ],
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
