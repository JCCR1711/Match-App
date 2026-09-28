import type {
  AvailabilityBlock,
  ReservationRecord,
} from "@/src/features/reservations/types/reservation";
import { parseTimeToMinutes } from "@/src/features/reservations/utils/reservationTime";
import { getWeekdayFromDateKey, toDateKey } from "@/src/features/reservations/utils/reservationDate";
import type {
  SportsFieldDraft,
  VenueLocation,
} from "@/src/features/venues/types/businessOnboarding";
import { getEffectiveFieldSchedule } from "@/src/features/venues/utils/getEffectiveFieldSchedule";

interface BusinessAvailabilityOpportunityInput {
  dateKey: string;
  fields: SportsFieldDraft[];
  venues: VenueLocation[];
  reservations: ReservationRecord[];
  blocks: AvailabilityBlock[];
  now?: Date;
}

export interface BusinessAvailabilityOpportunity {
  bestSlot: {
    fieldId: string;
    fieldName: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
  } | null;
}

interface MinuteRange {
  start: number;
  end: number;
}

const toTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

const mergeRanges = (ranges: MinuteRange[]) => {
  const merged: MinuteRange[] = [];

  [...ranges]
    .sort((first, second) => first.start - second.start)
    .forEach((range) => {
      const previous = merged[merged.length - 1];
      if (!previous || range.start > previous.end) {
        merged.push({ ...range });
        return;
      }
      previous.end = Math.max(previous.end, range.end);
    });

  return merged;
};

export const getBusinessAvailabilityOpportunity = ({
  dateKey,
  fields,
  venues,
  reservations,
  blocks,
  now = new Date(),
}: BusinessAvailabilityOpportunityInput): BusinessAvailabilityOpportunity => {
  const weekday = getWeekdayFromDateKey(dateKey);
  if (!weekday) return { bestSlot: null };

  let bestSlot: BusinessAvailabilityOpportunity["bestSlot"] = null;

  const registerFreeRange = (field: SportsFieldDraft, start: number, end: number) => {
    if (end <= start) return;
    const durationMinutes = end - start;
    const bestStart = bestSlot ? parseTimeToMinutes(bestSlot.startTime) : null;
    if (
      bestSlot &&
      (bestSlot.durationMinutes > durationMinutes ||
        (bestSlot.durationMinutes === durationMinutes && bestStart !== null && bestStart <= start))
    ) return;

    bestSlot = {
      fieldId: field.fieldId,
      fieldName: field.fieldName,
      startTime: toTime(start),
      endTime: toTime(end),
      durationMinutes,
    };
  };

  fields
    .filter((field) => field.status === "active")
    .forEach((field) => {
      const venue = venues.find((item) => item.venueId === field.venueId);
      if (!venue || venue.status !== "active") return;

      const schedule = getEffectiveFieldSchedule(field, venue);
      if (!schedule?.weekdays.includes(weekday)) return;

      const opening = parseTimeToMinutes(schedule.openingTime);
      const closing = parseTimeToMinutes(schedule.closingTime);
      if (opening === null || closing === null || closing <= opening) return;

      const occupied = mergeRanges(
        [
          ...reservations
            .filter(
              (reservation) =>
                reservation.fieldId === field.fieldId &&
                reservation.dateKey === dateKey &&
                reservation.status !== "canceled",
            )
            .map((reservation) => ({
              start: parseTimeToMinutes(reservation.startTime),
              duration: reservation.durationMinutes,
            })),
          ...blocks
            .filter(
              (block) =>
                block.fieldId === field.fieldId && block.dateKey === dateKey,
            )
            .map((block) => ({
              start: parseTimeToMinutes(block.startTime),
              duration: block.durationMinutes,
            })),
        ]
          .filter(
            (item): item is { start: number; duration: number } =>
              item.start !== null && item.duration > 0,
          )
          .map((item) => ({
            start: Math.max(opening, item.start),
            end: Math.min(closing, item.start + item.duration),
          }))
          .filter((range) => range.end > range.start),
      );

      const nextBookableMinute = dateKey === toDateKey(now)
        ? Math.ceil((now.getHours() * 60 + now.getMinutes() + 1) / 60) * 60
        : opening;
      let cursor = dateKey < toDateKey(now)
        ? closing
        : Math.max(opening, nextBookableMinute);
      occupied.forEach((range) => {
        registerFreeRange(field, cursor, range.start);
        cursor = Math.max(cursor, range.end);
      });

      registerFreeRange(field, cursor, closing);
    });

  return { bestSlot };
};
