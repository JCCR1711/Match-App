import CustomText from "@/src/components/ui/CustomText";
import type { BusinessMetric, BusinessMetricFormat } from "@/src/features/analytics/types/businessAnalytics";
import { formatAnalyticsChange, formatAnalyticsMetric } from "@/src/features/analytics/utils/formatAnalyticsMetric";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

const AnalyticsMetricGrid = ({ metrics }: { metrics: BusinessMetric[] }) => {
  const groups = [metrics.slice(0, 2), metrics.slice(2, 4)].filter((group) => group.length === 2);

  if (groups.length === 0) {
    return <CustomText text="Aún no hay métricas para este periodo" variant="body" style={styles.emptyText} />;
  }

  return (
    <View style={styles.stack}>
      {groups.map((group, groupIndex) => {
        const light = groupIndex === 1;
        const primary = group[0];
        const secondary = group[1];
        return (
          <View key={group[0]?.id ?? groupIndex} style={[styles.group, light ? styles.lightGroup : styles.blueGroup]}>
            <View style={styles.primaryMetric}>
              <View style={styles.metricHeading}>
                <CustomText text={primary.label} variant="caption" style={[styles.label, light && styles.textOnLight]} />
                <CustomText text={`${formatAnalyticsChange(primary.change)} vs. anterior`} variant="caption" style={[styles.change, light && styles.changeOnLight]} />
              </View>
              <MetricValue value={primary.value} format={primary.format} prominent light={light} />
            </View>
            <View style={styles.secondaryMetric}>
              <CustomText text={secondary.label} variant="caption" style={[styles.secondaryLabel, light && styles.secondaryLabelOnLight]} numberOfLines={1} />
              <MetricValue value={secondary.value} format={secondary.format} light={false} secondaryAccent={light ? "blue" : "green"} />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const MetricValue = ({ value, format, prominent = false, light, secondaryAccent }: { value: number; format: BusinessMetricFormat; prominent?: boolean; light: boolean; secondaryAccent?: "blue" | "green" }) => {
  const formattedMetric = formatAnalyticsMetric(value, format);

  return (
    <View
      style={[
        styles.valueRow,
        secondaryAccent && styles.secondaryValueSurface,
        secondaryAccent === "green" && styles.secondaryValueSurfaceLight,
      ]}
    >
      {formattedMetric.prefix ? <CustomText text={formattedMetric.prefix} variant="caption" style={[styles.currency, light && styles.currencyOnLight]} /> : null}
      <CustomText
        text={formattedMetric.amount}
        variant={prominent ? "heading" : "action"}
        style={[
          prominent ? styles.primaryValue : styles.secondaryValue,
          light && styles.textOnLight,
          secondaryAccent === "green" && styles.secondaryValueOnLight,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      />
      {formattedMetric.suffix ? <CustomText text={formattedMetric.suffix} variant="caption" style={[styles.suffix, light && styles.currencyOnLight, secondaryAccent === "green" && styles.secondaryValueOnLight]} /> : null}
    </View>
  );
};

export default AnalyticsMetricGrid;

const styles = StyleSheet.create({
  stack: { gap: theme.spacing.sm },
  group: { minHeight: 136, padding: theme.spacing.lg, borderRadius: theme.radius.extraLarge, borderCurve: "continuous", gap: theme.spacing.md },
  lightGroup: { backgroundColor: theme.colors.authPrimary },
  blueGroup: { backgroundColor: theme.colors.businessBlueSurface },
  primaryMetric: { gap: theme.spacing.xs },
  metricHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  primaryValue: { color: theme.colors.white, fontSize: 32, lineHeight: 38 },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xs },
  secondaryValueSurface: { minHeight: 38, alignItems: "center", justifyContent: "center", paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs, borderRadius: theme.radius.pill, backgroundColor: theme.colors.black },
  secondaryValueSurfaceLight: { backgroundColor: theme.colors.white },
  currency: { color: theme.colors.textOnDarkSecondary, fontSize: 11, lineHeight: 16 },
  currencyOnLight: { color: theme.colors.black, opacity: 0.56 },
  suffix: { color: theme.colors.textOnDarkSecondary, fontSize: 12, lineHeight: 16 },
  secondaryMetric: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  secondaryLabel: { flex: 1, color: theme.colors.authTextSecondary },
  secondaryLabelOnLight: { color: theme.colors.surfaceMuted },
  label: { color: theme.colors.authTextSecondary },
  secondaryValue: { color: theme.colors.white },
  secondaryValueOnLight: { color: theme.colors.black },
  change: { color: theme.colors.accent },
  textOnLight: { color: theme.colors.black },
  changeOnLight: { color: theme.colors.black, opacity: 0.62 },
  emptyText: { color: theme.colors.authTextSecondary, paddingVertical: theme.spacing.xl },
});
