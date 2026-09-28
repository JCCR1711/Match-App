import type { AnalyticsOpportunity, AnalyticsScope } from "@/src/features/analytics/types/businessAnalytics";
import type { AvailabilityBlock, ReservationRecord } from "@/src/features/reservations/types/reservation";
import { addDays, formatDateDetail, formatWeekday, toDateKey } from "@/src/features/reservations/utils/reservationDate";
import { getBusinessAvailabilityOpportunity } from "@/src/features/reservations/utils/getBusinessAvailabilityOpportunity";
import type { BusinessOnboardingDraft } from "@/src/features/venues/types/businessOnboarding";

export const getAnalyticsOpportunities = ({ draft, reservations, blocks, scope, now = new Date() }: { draft: BusinessOnboardingDraft; reservations: ReservationRecord[]; blocks: AvailabilityBlock[]; scope: AnalyticsScope; now?: Date }): AnalyticsOpportunity[] => {
  const venues = scope === "all" ? draft.venues : draft.venues.filter((venue) => venue.venueId === scope);
  const venueIds = new Set(venues.map((venue) => venue.venueId));
  const fields = draft.fields.filter((field) => venueIds.has(field.venueId));

  return Array.from({ length: 7 }, (_, offset) => {
    const date = addDays(now, offset);
    const dateKey = toDateKey(date);
    const slot = getBusinessAvailabilityOpportunity({ dateKey, fields, venues, reservations, blocks, now }).bestSlot;
    if (!slot) return null;
    const field = fields.find((item) => item.fieldId === slot.fieldId);
    const venue = venues.find((item) => item.venueId === field?.venueId);
    return {
      id: `${dateKey}-${slot.fieldId}-${slot.startTime}`,
      dateKey,
      dateLabel: offset === 0 ? "Hoy" : offset === 1 ? "Mañana" : `${formatWeekday(date)} ${formatDateDetail(date)}`,
      fieldId: slot.fieldId,
      fieldName: slot.fieldName,
      venueName: venue?.venueName ?? "Sede",
      startTime: slot.startTime,
      endTime: slot.endTime,
      durationMinutes: slot.durationMinutes,
    };
  }).filter((item): item is AnalyticsOpportunity => item !== null).slice(0, 3);
};
