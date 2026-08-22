import type { AnalyticsRange, AnalyticsScope, BusinessAnalyticsSnapshot, BusinessMetric, OccupancyComparison, RevenuePoint } from "@/src/features/analytics/types/businessAnalytics";

interface RangePreview {
  periodLabel: string;
  metrics: BusinessMetric[];
  revenueTrend: RevenuePoint[];
}

const rangePreview: Record<AnalyticsRange, RangePreview> = {
  week: {
    periodLabel: "Esta semana",
    metrics: [
      { id: "income", label: "Ingresos", value: 4860, format: "currency", change: 12 },
      { id: "reservations", label: "Reservas", value: 84, format: "number", change: 9 },
      { id: "occupancy", label: "Ocupación", value: 68, format: "percent", change: 6 },
      { id: "average_ticket", label: "Ticket medio", value: 58, format: "currency", change: 4 },
      { id: "booked_hours", label: "Horas reservadas", value: 126, format: "hours", change: 11 },
    ],
    revenueTrend: [
      { label: "L", amount: 520 }, { label: "M", amount: 680 }, { label: "X", amount: 610 },
      { label: "J", amount: 760 }, { label: "V", amount: 820 }, { label: "S", amount: 710 },
      { label: "D", amount: 760 },
    ],
  },
  month: {
    periodLabel: "Este mes",
    metrics: [
      { id: "income", label: "Ingresos", value: 18420, format: "currency", change: 8 },
      { id: "reservations", label: "Reservas", value: 312, format: "number", change: 7 },
      { id: "occupancy", label: "Ocupación", value: 72, format: "percent", change: 5 },
      { id: "average_ticket", label: "Ticket medio", value: 59, format: "currency", change: 2 },
      { id: "booked_hours", label: "Horas reservadas", value: 468, format: "hours", change: 9 },
    ],
    revenueTrend: [
      { label: "1", amount: 520 }, { label: "5", amount: 670 }, { label: "10", amount: 590 },
      { label: "15", amount: 760 }, { label: "20", amount: 830 }, { label: "25", amount: 710 },
      { label: "30", amount: 890 },
    ],
  },
  year: {
    periodLabel: "Este año",
    metrics: [
      { id: "income", label: "Ingresos", value: 183600, format: "currency", change: 18 },
      { id: "reservations", label: "Reservas", value: 3048, format: "number", change: 14 },
      { id: "occupancy", label: "Ocupación", value: 75, format: "percent", change: 8 },
      { id: "average_ticket", label: "Ticket medio", value: 60, format: "currency", change: 5 },
      { id: "booked_hours", label: "Horas reservadas", value: 4572, format: "hours", change: 16 },
    ],
    revenueTrend: [
      { label: "Ene", amount: 12800 }, { label: "Mar", amount: 14100 }, { label: "May", amount: 13600 },
      { label: "Jul", amount: 15800 }, { label: "Sep", amount: 16400 }, { label: "Nov", amount: 17200 },
      { label: "Dic", amount: 18100 },
    ],
  },
};

const occupancyPreview: OccupancyComparison[] = [
  { id: "field-1", label: "Cancha principal", venue: "Sede Miraflores", percentage: 82 },
  { id: "field-2", label: "Cancha 2", venue: "Sede Miraflores", percentage: 64 },
  { id: "field-3", label: "Cancha norte", venue: "Sede Los Olivos", percentage: 51 },
  { id: "field-4", label: "Cancha 2", venue: "Sede Los Olivos", percentage: 59 },
];

const scopeConfig: Record<AnalyticsScope, { multiplier: number; venue?: string; occupancyDelta: number }> = {
  all: { multiplier: 1, occupancyDelta: 0 },
  miraflores: { multiplier: 0.62, venue: "Sede Miraflores", occupancyDelta: 4 },
  "los-olivos": { multiplier: 0.38, venue: "Sede Los Olivos", occupancyDelta: -5 },
};

const occupancyDeltaByRange: Record<AnalyticsRange, number> = { week: 0, month: 2, year: 4 };

const scaleMetric = (metric: BusinessMetric, scope: AnalyticsScope): BusinessMetric => {
  const config = scopeConfig[scope];
  if (scope === "all" || metric.id === "average_ticket") return metric;
  if (metric.id === "occupancy") return { ...metric, value: Math.max(0, Math.min(100, metric.value + config.occupancyDelta)) };
  return { ...metric, value: Math.round(metric.value * config.multiplier) };
};

export const getBusinessAnalyticsPreview = (range: AnalyticsRange, scope: AnalyticsScope): BusinessAnalyticsSnapshot => {
  const preview = rangePreview[range];
  const config = scopeConfig[scope];

  return {
    periodLabel: preview.periodLabel,
    metrics: preview.metrics.map((metric) => scaleMetric(metric, scope)),
    revenueTrend: preview.revenueTrend.map((point) => ({ ...point, amount: Math.round(point.amount * config.multiplier) })),
    occupancy: occupancyPreview
      .filter((item) => !config.venue || item.venue === config.venue)
      .map((item) => ({ ...item, percentage: Math.min(100, item.percentage + occupancyDeltaByRange[range]) })),
  };
};
