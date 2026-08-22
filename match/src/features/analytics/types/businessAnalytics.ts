export type AnalyticsRange = "week" | "month" | "year";
export type AnalyticsScope = "all" | "miraflores" | "los-olivos";
export type BusinessMetricFormat = "currency" | "number" | "percent" | "hours";

export interface BusinessMetric {
  id: "income" | "reservations" | "occupancy" | "average_ticket" | "booked_hours";
  label: string;
  value: number;
  format: BusinessMetricFormat;
  change: number;
}

export interface OccupancyComparison {
  id: string;
  label: string;
  venue: string;
  percentage: number;
}

export interface RevenuePoint extends Record<string, unknown> {
  label: string;
  amount: number;
}

export interface BusinessAnalyticsSnapshot {
  periodLabel: string;
  metrics: BusinessMetric[];
  revenueTrend: RevenuePoint[];
  occupancy: OccupancyComparison[];
}
