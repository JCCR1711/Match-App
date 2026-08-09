export interface BusinessMetric {
  id: "income" | "reservations" | "occupancy" | "average_ticket" | "booked_hours";
  label: string;
  value: string;
  change: string;
}

export interface OccupancyComparison {
  id: string;
  label: string;
  venue: string;
  percentage: number;
}
