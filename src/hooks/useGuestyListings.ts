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

export function useGuestyListings() {
  return useQuery({
    queryKey: ["guesty-listings"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("guesty-listings");
      if (error) throw error;
      return data.results as GuestyListing[];
    },
    staleTime: 1000 * 60 * 10, // 10 min cache
  });
}
