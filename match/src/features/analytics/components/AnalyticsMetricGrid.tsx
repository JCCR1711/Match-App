import CustomText from "@/src/components/ui/CustomText";
import type { BusinessMetric } from "@/src/features/analytics/types/businessAnalytics";
import { formatAnalyticsMetric } from "@/src/features/analytics/utils/formatAnalyticsMetric";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

const AnalyticsMetricGrid = ({ metrics }: { metrics: BusinessMetric[] }) => {
  if (!metrics.length) return <CustomText text="Aún no hay métricas para este periodo" variant="body" style={styles.emptyText} />;
  return (
    <View style={styles.grid}>
      {metrics.map((metric) => <Metric key={metric.id} metric={metric} />)}
    </View>
  );
};

const MetricValue = ({ metric }: { metric: BusinessMetric }) => {
  const formatted = formatAnalyticsMetric(metric.value, metric.format);
  return (
    <View style={styles.valueRow}>
      {formatted.prefix ? <CustomText text={formatted.prefix} variant="caption" style={styles.affix} /> : null}
      <CustomText text={formatted.amount} variant="heading" style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7} />
      {formatted.suffix ? <CustomText text={formatted.suffix} variant="caption" style={styles.affix} /> : null}
    </View>
  );
};

const Metric = ({ metric }: { metric: BusinessMetric }) => {
  const formatted = formatAnalyticsMetric(metric.value, metric.format);
  const accessibilityValue = `${formatted.prefix ?? ""}${formatted.amount}${formatted.suffix ?? ""}`;
  return (
    <View style={styles.metric} accessible accessibilityLabel={`${metric.label}: ${accessibilityValue}`}>
      <MetricValue metric={metric} />
      <CustomText text={metric.label} variant="bodyStrong" style={styles.label} numberOfLines={2} />
    </View>
  );
};

export default AnalyticsMetricGrid;

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  metric: { width: "47%", flexGrow: 1, minWidth: 0, minHeight: 124, alignItems: "center", justifyContent: "center", gap: theme.spacing.xs, padding: theme.spacing.md, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.authSurface },
  label: { color: theme.colors.textOnDarkSecondary, textAlign: "center" },
  valueRow: { minWidth: 0, flexDirection: "row", alignItems: "baseline", justifyContent: "center", gap: theme.spacing.xxs },
  value: { flexShrink: 1, color: theme.colors.white, textAlign: "center" },
  affix: { color: theme.colors.authTextSecondary },
  emptyText: { color: theme.colors.authTextSecondary, paddingVertical: theme.spacing.xl },
});
