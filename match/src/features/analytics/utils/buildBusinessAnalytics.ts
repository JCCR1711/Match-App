import type { AnalyticsRange, AnalyticsScope, BusinessAnalyticsSnapshot, BusinessMetric, RevenuePoint } from "@/src/features/analytics/types/businessAnalytics";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import { parseDateKey } from "@/src/features/reservations/utils/reservationDate";
import { buildBusinessAgendaFields } from "@/src/features/reservations/utils/businessAgendaResources";
import type { BusinessOnboardingDraft, Weekday } from "@/src/features/venues/types/businessOnboarding";

const DAY_MS = 86_400_000;
const weekdayByIndex: Weekday[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const differenceInDays = (later: Date, earlier: Date) => Math.round((startOfDay(later).getTime() - startOfDay(earlier).getTime()) / DAY_MS);

const getRangeBounds = (range: AnalyticsRange, reference: Date) => {
  if (range === "week") {
    const start = addDays(reference, -((reference.getDay() + 6) % 7));
    return { start, end: addDays(start, 6) };
  }
  if (range === "month") return { start: new Date(reference.getFullYear(), reference.getMonth(), 1), end: new Date(reference.getFullYear(), reference.getMonth() + 1, 0) };
  return { start: new Date(reference.getFullYear(), 0, 1), end: new Date(reference.getFullYear(), 11, 31) };
};

export const getAnalyticsPeriod = (range: AnalyticsRange, now = new Date()) => {
  const reference = startOfDay(now);
  return getRangeBounds(range, reference);
};

export const getAnalyticsReservations = (reservations: readonly ReservationRecord[], range: AnalyticsRange, scope: AnalyticsScope, now = new Date()) => {
  const { start, end } = getAnalyticsPeriod(range, now);
  return reservations.filter((item) => (scope === "all" || item.venueId === scope) && inPeriod(item.dateKey, start, end));
};

const inPeriod = (dateKey: string, start: Date, end: Date) => {
  const date = parseDateKey(dateKey);
  return Boolean(date && date >= startOfDay(start) && date <= startOfDay(end));
};

const percentChange = (current: number, previous: number) => previous === 0 ? null : Math.round(((current - previous) / previous) * 100);

const summarize = (reservations: readonly ReservationRecord[]) => {
  const confirmed = reservations.filter((item) => item.status === "confirmed");
  return {
    confirmed,
    income: confirmed.reduce((total, item) => total + item.amount, 0),
    bookedMinutes: confirmed.reduce((total, item) => total + item.durationMinutes, 0),
  };
};

const getScheduledMinutes = (draft: BusinessOnboardingDraft, scope: AnalyticsScope, start: Date, end: Date) => {
  const fields = buildBusinessAgendaFields(draft.fields, draft.venues).filter((field) =>
    (scope === "all" || field.venueId === scope) && field.status === "active" && field.venueStatus === "active" && field.schedule,
  );
  let total = 0;
  for (let date = startOfDay(start); date <= startOfDay(end); date = addDays(date, 1)) {
    fields.forEach((field) => {
      if (!field.schedule || !field.schedule.weekdays.includes(weekdayByIndex[date.getDay()])) return;
      const [openHour, openMinute] = field.schedule.openingTime.split(":").map(Number);
      const [closeHour, closeMinute] = field.schedule.closingTime.split(":").map(Number);
      total += Math.max(0, closeHour * 60 + closeMinute - openHour * 60 - openMinute);
    });
  }
  return total;
};

const buildRevenueTrend = (reservations: readonly ReservationRecord[], range: AnalyticsRange, start: Date, end: Date): RevenuePoint[] => {
  const count = range === "week" ? 7 : range === "month" ? 6 : 12;
  const buckets = Array.from({ length: count }, (_, index) => ({
    date: range === "week" ? addDays(start, index) : range === "month" ? new Date(end.getFullYear(), end.getMonth(), index * 5 + 1) : new Date(end.getFullYear(), index, 1),
    amount: 0,
  }));
  reservations.filter((item) => item.status === "confirmed").forEach((item) => {
    const date = parseDateKey(item.dateKey);
    if (!date) return;
    const index = range === "week" ? differenceInDays(date, start) : range === "month" ? Math.min(5, Math.floor((date.getDate() - 1) / 5)) : date.getMonth();
    if (buckets[index]) buckets[index].amount += item.amount;
  });
  return buckets.map(({ date, amount }) => ({
    label: range === "week" ? new Intl.DateTimeFormat("es-PE", { weekday: "narrow" }).format(date).toUpperCase() : new Intl.DateTimeFormat("es-PE", range === "year" ? { month: "short" } : { day: "numeric" }).format(date).replace(".", ""),
    dayLabel: new Intl.DateTimeFormat("es-PE", range === "year" ? { month: "long" } : { weekday: "long", day: "numeric" }).format(date),
    amount,
  }));
};

export const buildBusinessAnalytics = ({ reservations, draft, range, scope, now = new Date() }: { reservations: readonly ReservationRecord[]; draft: BusinessOnboardingDraft; range: AnalyticsRange; scope: AnalyticsScope; now?: Date }): BusinessAnalyticsSnapshot => {
  const { start, end } = getAnalyticsPeriod(range, now);
  const periodDays = differenceInDays(end, start) + 1;
  const previousEnd = addDays(start, -1);
  const previousStart = addDays(previousEnd, -(periodDays - 1));
  const scoped = reservations.filter((item) => scope === "all" || item.venueId === scope);
  const currentReservations = scoped.filter((item) => inPeriod(item.dateKey, start, end));
  const previousReservations = scoped.filter((item) => inPeriod(item.dateKey, previousStart, previousEnd));
  const current = summarize(currentReservations);
  const previous = summarize(previousReservations);
  const scheduledMinutes = getScheduledMinutes(draft, scope, start, end);
  const previousScheduledMinutes = getScheduledMinutes(draft, scope, previousStart, previousEnd);
  const occupancy = scheduledMinutes ? Math.round((current.bookedMinutes / scheduledMinutes) * 100) : 0;
  const previousOccupancy = previousScheduledMinutes ? Math.round((previous.bookedMinutes / previousScheduledMinutes) * 100) : 0;
  const metrics: BusinessMetric[] = [
    { id: "income", label: "Ventas confirmadas", value: current.income, format: "currency", change: percentChange(current.income, previous.income) },
    { id: "reservations", label: "Confirmadas", value: current.confirmed.length, format: "number", change: percentChange(current.confirmed.length, previous.confirmed.length) },
    { id: "pending", label: "Pendientes", value: currentReservations.filter((item) => item.status === "pending").length, format: "number", change: null },
    { id: "occupancy", label: "Ocupación", value: occupancy, format: "percent", change: previous.confirmed.length ? occupancy - previousOccupancy : null },
    { id: "average_ticket", label: "Venta promedio", value: current.confirmed.length ? Math.round(current.income / current.confirmed.length) : 0, format: "currency", change: null },
    { id: "booked_hours", label: "Horas reservadas", value: Math.round((current.bookedMinutes / 60) * 10) / 10, format: "hours", change: percentChange(current.bookedMinutes, previous.bookedMinutes) },
  ];
  const occupancyRows = buildBusinessAgendaFields(draft.fields, draft.venues)
    .filter((field) => scope === "all" || field.venueId === scope)
    .map((field) => {
      const fieldReservations = current.confirmed.filter((item) => item.fieldId === field.id);
      const bookedMinutes = fieldReservations.reduce((total, item) => total + item.durationMinutes, 0);
      const fieldDraft = { ...draft, fields: draft.fields.filter((item) => item.fieldId === field.id) };
      const capacity = getScheduledMinutes(fieldDraft, field.venueId, start, end);
      return { id: field.id, label: field.name, venue: field.venueName ?? "Sede", percentage: capacity ? Math.min(100, Math.round((bookedMinutes / capacity) * 100)) : 0, reservations: fieldReservations.length, income: fieldReservations.reduce((total, item) => total + item.amount, 0) };
    })
    .filter((item) => item.reservations > 0)
    .sort((first, second) => second.percentage - first.percentage);
  return {
    periodLabel: range === "week" ? "Esta semana" : range === "month" ? "Este mes" : "Este año",
    metrics,
    revenueTrend: buildRevenueTrend(currentReservations, range, start, end),
    occupancy: occupancyRows,
    sources: (["match", "manual"] as const).map((source) => {
      const sourceReservations = currentReservations.filter((item) => item.source === source && item.status !== "canceled");
      return { source, label: source === "match" ? "MATCH" : "Local", reservations: sourceReservations.length, income: sourceReservations.filter((item) => item.status === "confirmed").reduce((total, item) => total + item.amount, 0) };
    }),
    incidents: {
      canceled: currentReservations.filter((item) => item.status === "canceled").length,
      refundPending: currentReservations.filter((item) => item.paymentStatus === "refund_pending").reduce((total, item) => total + item.amount, 0),
      refunded: currentReservations.filter((item) => item.paymentStatus === "refunded").reduce((total, item) => total + item.amount, 0),
    },
  };
};

export const getAnalyticsScopeOptions = (draft: BusinessOnboardingDraft) => [
  { id: "all", label: "Todas" },
  ...draft.venues.map((venue) => ({ id: venue.venueId, label: venue.venueName })),
];
