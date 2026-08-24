import type { NearbyAvailableVenue, PlayerCoordinates } from "@/src/features/home/types/nearbyVenue";
import type { PublicVenue } from "@/src/features/venues/types/publicVenue";
import { calculateDistanceKm } from "@/src/utils/location";

interface FindNearbyVenuesInput {
  venues: PublicVenue[];
  playerCoordinates: PlayerCoordinates;
  isSlotUnavailable: (fieldId: string, slot: string) => boolean;
}

export const findNearbyAvailableVenues = ({ venues, playerCoordinates, isSlotUnavailable }: FindNearbyVenuesInput) =>
  venues
    .map<NearbyAvailableVenue | null>((venue) => {
      const availableFields = venue.fields
        .map((field) => ({
          ...field,
          availableSlots: field.availableSlots.filter((slot) => !isSlotUnavailable(field.id, slot)),
        }))
        .filter((field) => field.availableSlots.length > 0);

      if (availableFields.length === 0) return null;

      const availableSlots = Array.from(new Set(availableFields.flatMap((field) => field.availableSlots))).sort();
      const distanceKm = calculateDistanceKm(playerCoordinates, venue.coordinates);

      return {
        venue,
        distanceKm,
        distanceLabel: `${distanceKm.toFixed(1)} km`,
        availableSlots,
        nextAvailableSlot: availableSlots[0],
        startingPrice: Math.min(...availableFields.map((field) => field.hourlyPrice)),
      };
    })
    .filter((venue): venue is NearbyAvailableVenue => venue !== null)
    .sort((left, right) => left.distanceKm - right.distanceKm);
