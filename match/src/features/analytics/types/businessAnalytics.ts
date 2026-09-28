export type AnalyticsRange = "week" | "month" | "year";
export type AnalyticsScope = "all" | string;
export type BusinessMetricFormat = "currency" | "number" | "percent" | "hours";

export interface BusinessMetric {
  id: "income" | "reservations" | "pending" | "occupancy" | "average_ticket" | "booked_hours";
  label: string;
  value: number;
  format: BusinessMetricFormat;
  change: number | null;
}

export interface OccupancyComparison {
  id: string;
  label: string;
  venue: string;
  percentage: number;
  reservations: number;
  income: number;
}

export interface ReservationSourceSummary {
  source: "match" | "manual";
  label: string;
  reservations: number;
  income: number;
}

export interface AnalyticsIncidentSummary {
  canceled: number;
  refundPending: number;
  refunded: number;
}

export interface AnalyticsOpportunity {
  id: string;
  dateKey: string;
  dateLabel: string;
  fieldId: string;
  fieldName: string;
  venueName: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export interface RevenuePoint extends Record<string, unknown> {
  label: string;
  dayLabel: string;
  amount: number;
}

export interface BusinessAnalyticsSnapshot {
  periodLabel: string;
  metrics: BusinessMetric[];
  revenueTrend: RevenuePoint[];
  occupancy: OccupancyComparison[];
  sources: ReservationSourceSummary[];
  incidents: AnalyticsIncidentSummary;
}
