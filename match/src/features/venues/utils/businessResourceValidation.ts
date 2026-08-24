import type {
  SportsFieldInput,
  UpdateSportsFieldInput,
  UpdateVenueLocationInput,
  VenueCoordinates,
  VenueLocationInput,
  WeeklySchedule,
} from "@/src/features/venues/types/businessOnboarding";
import { parseTimeToMinutes } from "@/src/features/reservations/utils/reservationTime";

const hasText = (value: string) => value.trim().length >= 2;

const hasValidCoordinates = (coordinates: VenueCoordinates | null) =>
  coordinates === null || (
    Number.isFinite(coordinates.latitude) &&
    Number.isFinite(coordinates.longitude) &&
    coordinates.latitude >= -90 &&
    coordinates.latitude <= 90 &&
    coordinates.longitude >= -180 &&
    coordinates.longitude <= 180
  );

export const isValidWeeklySchedule = (schedule: WeeklySchedule | null) => {
  if (!schedule) return true;
  const openingMinutes = parseTimeToMinutes(schedule.openingTime);
  const closingMinutes = parseTimeToMinutes(schedule.closingTime);
  return schedule.weekdays.length > 0 &&
    openingMinutes !== null &&
    closingMinutes !== null &&
    openingMinutes < closingMinutes;
};

export const isValidVenueInput = (
  input: VenueLocationInput | UpdateVenueLocationInput,
) => hasText(input.venueName) &&
  hasText(input.address) &&
  hasText(input.district) &&
  hasText(input.city) &&
  hasValidCoordinates(input.coordinates) &&
  isValidWeeklySchedule(input.defaultSchedule);

export const isValidFieldInput = (
  input: SportsFieldInput | UpdateSportsFieldInput,
) => {
  const nightPrice = input.nightHourlyPrice ?? input.hourlyPrice;
  const nightStart = parseTimeToMinutes(input.nightStartsAt ?? "18:00");
  const scheduleIsValid = input.scheduleMode === "custom"
    ? input.scheduleOverride !== null && isValidWeeklySchedule(input.scheduleOverride)
    : input.scheduleOverride === null;

  return hasText(input.fieldName) &&
    Number.isFinite(input.hourlyPrice) &&
    input.hourlyPrice > 0 &&
    Number.isFinite(nightPrice) &&
    nightPrice > 0 &&
    nightStart !== null &&
    scheduleIsValid;
};
