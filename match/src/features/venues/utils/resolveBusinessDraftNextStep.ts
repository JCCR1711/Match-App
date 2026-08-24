import type {
  BusinessOnboardingDraft,
  SportsFieldDraft,
  VenueLocation,
} from "@/src/features/venues/types/businessOnboarding";
import { getEffectiveFieldSchedule } from "@/src/features/venues/utils/getEffectiveFieldSchedule";

export const resolveBusinessDraftNextStep = (
  venues: readonly VenueLocation[],
  fields: readonly SportsFieldDraft[],
): BusinessOnboardingDraft["nextStep"] => {
  if (venues.length === 0) return "location";
  if (fields.length === 0) return "field";
  if (fields.some((field) => !getEffectiveFieldSchedule(
    field,
    venues.find((venue) => venue.venueId === field.venueId),
  ))) return "availability";
  return "complete";
};
