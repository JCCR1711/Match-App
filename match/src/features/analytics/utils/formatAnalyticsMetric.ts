import type { BusinessMetricFormat } from "@/src/features/analytics/types/businessAnalytics";

const numberFormatter = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 });

export interface FormattedAnalyticsMetric {
  prefix?: string;
  amount: string;
  suffix?: string;
}

export const formatAnalyticsMetric = (value: number, format: BusinessMetricFormat): FormattedAnalyticsMetric => {
  if (format === "currency") return { prefix: "S/", amount: numberFormatter.format(value) };
  if (format === "percent") return { amount: numberFormatter.format(value), suffix: "%" };
  if (format === "hours") return { amount: numberFormatter.format(value), suffix: "h" };
  return { amount: numberFormatter.format(value) };
};

export const formatAnalyticsChange = (change: number) => `${change >= 0 ? "+" : ""}${change}%`;
export const formatCurrency = (value: number) => `S/ ${numberFormatter.format(value)}`;
export const formatCompactCurrency = (value: number) => {
  if (Math.abs(value) < 1000) return formatCurrency(value);
  const compactValue = value / 1000;
  return `S/ ${compactValue.toLocaleString("es-PE", { maximumFractionDigits: compactValue < 10 ? 1 : 0 })}k`;
};
