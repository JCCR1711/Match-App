import type { PublicVenue } from "@/src/features/venues/types/publicVenue";

export interface PlayerCoordinates {
  latitude: number;
  longitude: number;
}

export interface NearbyAvailableVenue {
  venue: PublicVenue;
  distanceKm: number;
  distanceLabel: string;
  availableSlots: string[];
  nextAvailableSlot: string;
  startingPrice: number;
}

export type PlayerLocationSource = "device" | "fallback";
