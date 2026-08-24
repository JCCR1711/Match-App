import type {
  SportsFieldDraft,
  VenueLocation,
  WeeklySchedule,
} from "@/src/features/venues/types/businessOnboarding";

export const getEffectiveFieldSchedule = (
  field: SportsFieldDraft,
  venue: VenueLocation | undefined,
): WeeklySchedule | null => {
  if (field.scheduleMode === "inherit") return venue?.defaultSchedule ?? null;
  return field.scheduleOverride ?? field.availability ?? null;
};
