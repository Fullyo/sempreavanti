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

// High-quality fallback photos (Unsplash, royalty-free)
const pietroPhotos = [
  "https://images.unsplash.com/photo-1499793983394-e58fc3a32915?w=1200&q=80", // tropical beachfront villa
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80", // luxury pool ocean
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80", // luxury bedroom
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80", // hotel room
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80", // resort pool
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80", // beach sunset
  "https://images.unsplash.com/photo-1505881402582-c5bc11054f91?w=1200&q=80", // ocean wave
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80", // luxury house exterior
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80", // modern villa interior
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80", // villa exterior
  "https://images.unsplash.com/photo-1615571022219-eb45cf7faa36?w=1200&q=80", // tropical kitchen
  "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80", // resort lounge
].map((url) => ({ original: url, thumbnail: url }));

const luisaPhotos = [
  "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1200&q=80", // tropical villa sunset
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80", // resort by pool
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80", // luxury bedroom
  "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80", // resort room
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80", // modern villa
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80", // hotel pool
  "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&q=80", // palm beach sunset
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80", // villa patio
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80", // luxury bathroom
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80", // beach cabana
].map((url) => ({ original: url, thumbnail: url }));

const estatePhotos = [
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80", // aerial beach
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80", // beach
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80", // food platter
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80", // fine dining
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80", // beach fire pit
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80", // nature
  "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&q=80", // yoga
  "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1200&q=80", // outdoor dining
  "https://images.unsplash.com/photo-1545579133-99bb5ab189bd?w=1200&q=80", // beach sunset couple
  "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=1200&q=80", // wedding beach
  "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=1200&q=80", // hammock beach
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80", // spa massage
].map((url) => ({ original: url, thumbnail: url }));

// Fallback data used when Guesty API is rate-limited or unavailable
const fallbackListings: GuestyListing[] = [
  {
    _id: "casa-pietro-fallback",
    title: "Casa Pietro",
    nickname: "Casa Pietro",
    pictures: pietroPhotos,
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
    pictures: luisaPhotos,
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
    pictures: estatePhotos,
    description: "The complete Casa Sempre Avanti estate — both villas combined into one private beachfront destination with five bedrooms, private beach, pool, fire pit, and dedicated staff.",
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
          // Ensure all listings have photos, merge with fallback if needed
          return results.map((listing, i) => {
            if (!listing.pictures || listing.pictures.length === 0) {
              return { ...listing, pictures: fallbackListings[i]?.pictures || pietroPhotos };
            }
            return listing;
          });
        }
        console.log("Guesty API returned empty results, using fallback data");
        return fallbackListings;
      } catch (err) {
        console.warn("Guesty API unavailable, using fallback data:", err);
        return fallbackListings;
      }
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}
