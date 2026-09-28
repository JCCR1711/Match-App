import type { AvailabilityBlock, ReservationRecord } from "@/src/features/reservations/types/reservation";
import { isActiveReservation } from "@/src/features/reservations/utils/isActiveReservation";
import { getWeekdayFromDateKey, parseDateKey, toDateKey } from "@/src/features/reservations/utils/reservationDate";
import type { ResourceStatus, SportsFieldDraft, VenueLocation, WeeklySchedule } from "@/src/features/venues/types/businessOnboarding";
import { getEffectiveFieldSchedule } from "@/src/features/venues/utils/getEffectiveFieldSchedule";

export interface BusinessAgendaField {
  id: string;
  name: string;
  venueId: string;
  venueName?: string;
  hourlyPrice: number;
  status: ResourceStatus;
  venueStatus: ResourceStatus;
  schedule: WeeklySchedule | null;
}

export const buildBusinessAgendaFields = (
  fields: readonly SportsFieldDraft[],
  venues: readonly VenueLocation[],
): BusinessAgendaField[] => fields.map((field) => {
  const venue = venues.find((item) => item.venueId === field.venueId);
  return {
    id: field.fieldId,
    name: field.fieldName,
    venueId: field.venueId,
    venueName: venue?.venueName,
    hourlyPrice: field.hourlyPrice,
    status: field.status,
    venueStatus: venue?.status ?? "inactive",
    schedule: getEffectiveFieldSchedule(field, venue),
  };
});

export const findPreferredAgendaField = ({
  fields,
  reservations,
  dateKey,
}: {
  fields: readonly BusinessAgendaField[];
  reservations: readonly ReservationRecord[];
  dateKey: string;
}) => fields.find((field) =>
  reservations.some((reservation) =>
    reservation.fieldId === field.id &&
    reservation.dateKey === dateKey &&
    reservation.status !== "canceled",
  ),
) ?? fields[0] ?? null;

export const getBusinessAgendaDay = ({
  field,
  reservations,
  blocks,
  dateKey,
  now = new Date(),
}: {
  field: BusinessAgendaField | undefined;
  reservations: readonly ReservationRecord[];
  blocks: readonly AvailabilityBlock[];
  dateKey: string;
  now?: Date;
}) => {
  const isOpen = isAgendaFieldOpenOnDate(field, dateKey);
  const dayReservations = reservations
    .filter(isActiveReservation)
    .filter((reservation) => reservation.dateKey === dateKey && reservation.fieldId === field?.id);
  const dayBlocks = blocks.filter((block) => block.dateKey === dateKey && block.fieldId === field?.id);
  const operational = isAgendaFieldOperational(field);
  const availableStartMinutes = getAvailableStartMinutes(field, dateKey, now);
  const occupiedMinutes = field?.schedule
    ? getOccupiedMinutes(
        [...dayReservations, ...dayBlocks],
        availableStartMinutes,
        toMinutes(field.schedule.closingTime),
      )
    : 0;
  const remainingScheduledMinutes = field?.schedule
    ? Math.max(0, toMinutes(field.schedule.closingTime) - availableStartMinutes)
    : 0;

  return {
    reservations: dayReservations,
    blocks: dayBlocks,
    isOpen,
    availableHours: operational && isOpen
      ? Math.max(0, Math.floor((remainingScheduledMinutes - occupiedMinutes) / 60))
      : 0,
  };
};

export const isAgendaFieldOpenOnDate = (
  field: BusinessAgendaField | undefined,
  dateKey: string,
) => {
  if (!field?.schedule) return false;
  const weekday = getWeekdayFromDateKey(dateKey);
  return weekday ? field.schedule.weekdays.includes(weekday) : false;
};

export const isAgendaFieldOperational = (field: BusinessAgendaField | undefined) =>
  field?.status === "active" && field.venueStatus === "active" && field.schedule !== null;

const toMinutes = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

const getAvailableStartMinutes = (
  field: BusinessAgendaField | undefined,
  dateKey: string,
  now: Date,
) => {
  const openingMinutes = field?.schedule ? toMinutes(field.schedule.openingTime) : 0;
  const date = parseDateKey(dateKey);
  if (!date) return openingMinutes;
  const todayKey = toDateKey(now);
  if (dateKey < todayKey) return field?.schedule ? toMinutes(field.schedule.closingTime) : 0;
  if (dateKey > todayKey) return openingMinutes;
  return Math.max(openingMinutes, now.getHours() * 60 + now.getMinutes());
};

const getOccupiedMinutes = (
  items: readonly { startTime: string; durationMinutes: number }[],
  rangeStart: number,
  rangeEnd: number,
) => {
  const ranges = items
    .map((item) => ({
      start: Math.max(rangeStart, toMinutes(item.startTime)),
      end: Math.min(rangeEnd, toMinutes(item.startTime) + item.durationMinutes),
    }))
    .filter((range) => range.end > range.start)
    .sort((first, second) => first.start - second.start);

  let occupied = 0;
  let currentEnd = rangeStart;
  ranges.forEach((range) => {
    if (range.start >= currentEnd) occupied += range.end - range.start;
    else if (range.end > currentEnd) occupied += range.end - currentEnd;
    currentEnd = Math.max(currentEnd, range.end);
  });
  return occupied;
};
