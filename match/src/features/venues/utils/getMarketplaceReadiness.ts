import type { BusinessOnboardingDraft } from "@/src/features/venues/types/businessOnboarding";
import { getEffectiveFieldSchedule } from "@/src/features/venues/utils/getEffectiveFieldSchedule";

export type MarketplaceRequirement = "venue" | "field" | "schedule";

export const getMarketplaceReadiness = (draft: BusinessOnboardingDraft) => {
  const activeVenues = draft.venues.filter(
    (venue) => venue.status === "active" && venue.coordinates,
  );
  if (activeVenues.length === 0) {
    return { ready: false, requirement: "venue" as const, message: "Activa una sede con ubicación para aparecer ante jugadores." };
  }

  const activeVenueIds = new Set(activeVenues.map((venue) => venue.venueId));
  const activeFields = draft.fields.filter(
    (field) => field.status === "active" && field.hourlyPrice > 0 && activeVenueIds.has(field.venueId),
  );
  if (activeFields.length === 0) {
    return { ready: false, requirement: "field" as const, message: "Activa una cancha con una tarifa válida." };
  }

  const publishableField = activeFields.find((field) => {
    const venue = activeVenues.find((item) => item.venueId === field.venueId);
    return getEffectiveFieldSchedule(field, venue) !== null;
  });
  if (!publishableField) {
    return { ready: false, requirement: "schedule" as const, message: "Configura el horario de una cancha activa." };
  }

  return { ready: true, requirement: null, message: "Tus horarios disponibles pueden reservarse desde MATCH." };
};
