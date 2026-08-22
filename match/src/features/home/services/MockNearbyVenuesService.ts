import type { NearbyAvailableVenue, PlayerCoordinates } from "@/src/features/home/types/nearbyVenue";
import type { PublicVenue } from "@/src/features/venues/types/publicVenue";

interface FindNearbyVenuesInput {
  venues: PublicVenue[];
  playerCoordinates: PlayerCoordinates;
  isSlotUnavailable: (fieldId: string, slot: string) => boolean;
}

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number) => degrees * (Math.PI / 180);

const calculateDistanceKm = (origin: PlayerCoordinates, destination: PlayerCoordinates) => {
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const originLatitude = toRadians(origin.latitude);
  const destinationLatitude = toRadians(destination.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLatitude) * Math.cos(destinationLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

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
