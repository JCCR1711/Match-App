import type { BusinessMetric, OccupancyComparison } from "@/src/features/analytics/types/businessAnalytics";

export const businessMetrics: BusinessMetric[] = [
  { id: "income", label: "Ingresos", value: "S/ 4,860", change: "+12%" },
  { id: "reservations", label: "Reservas", value: "84", change: "+9%" },
  { id: "occupancy", label: "Ocupación", value: "68%", change: "+6%" },
  { id: "average_ticket", label: "Ticket medio", value: "S/ 58", change: "+4%" },
  { id: "booked_hours", label: "Horas reservadas", value: "126 h", change: "+11%" },
];

export const occupancyComparison: OccupancyComparison[] = [
  { id: "field-1", label: "Cancha principal", venue: "Sede Miraflores", percentage: 82 },
  { id: "field-2", label: "Cancha 2", venue: "Sede Miraflores", percentage: 64 },
  { id: "field-3", label: "Cancha norte", venue: "Sede Los Olivos", percentage: 51 },
  { id: "field-4", label: "Cancha 2", venue: "Sede Los Olivos", percentage: 59 },
];
