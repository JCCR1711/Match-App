import CustomText from "@/src/components/ui/CustomText";
import type { AnalyticsRange, BusinessMetric, RevenuePoint } from "@/src/features/analytics/types/businessAnalytics";
import { formatAnalyticsChange, formatAnalyticsMetric, formatCompactCurrency, formatCurrency } from "@/src/features/analytics/utils/formatAnalyticsMetric";
import { theme } from "@/src/theme";
import { LineChart } from "react-native-chart-kit/v2";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";

const ranges: { id: AnalyticsRange; label: string }[] = [
  { id: "week", label: "Semana" },
  { id: "month", label: "Mes" },
  { id: "year", label: "Año" },
];

interface AnalyticsHeroCardProps {
  metric: BusinessMetric;
  periodLabel: string;
  revenueTrend: RevenuePoint[];
  selectedRange: AnalyticsRange;
  onRangeChange: (range: AnalyticsRange) => void;
}

const AnalyticsHeroCard = ({ metric, periodLabel, revenueTrend, selectedRange, onRangeChange }: AnalyticsHeroCardProps) => {
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(280, Math.min(width - theme.layout.screenGutter * 2, 608));
  const formattedMetric = formatAnalyticsMetric(metric.value, metric.format);
  const accessibilitySummary = `${periodLabel}. ${formatCurrency(metric.value)} en ingresos. ${revenueTrend.map((point) => `${point.label}: ${formatCurrency(point.amount)}`).join(", ")}.`;

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <View style={styles.heading}>
          <CustomText text={`${metric.label} · ${periodLabel}`} variant="caption" style={styles.label} />
          <CustomText text={`${formatAnalyticsChange(metric.change)} vs. periodo anterior`} variant="caption" style={styles.change} />
        </View>
        <View style={styles.valueRow}>
          <CustomText text="S/" variant="caption" style={styles.currency} />
          <CustomText text={formattedMetric.amount} variant="display" style={styles.value} />
        </View>
      </View>
      <View style={styles.chartContent}>
      <View style={styles.chartHeader}>
        <CustomText text="Evolución" variant="sectionHeading" style={styles.chartTitle} />
        <View style={styles.rangeControl} accessibilityRole="tablist">
          {ranges.map((range) => {
            const selected = range.id === selectedRange;
            return (
              <Pressable
                key={range.id}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={`Ver ingresos por ${range.label.toLowerCase()}`}
                onPress={() => onRangeChange(range.id)}
                style={[styles.rangeOption, selected && styles.rangeOptionSelected]}
              >
                <CustomText text={range.label} variant="caption" style={[styles.rangeLabel, selected && styles.rangeLabelSelected]} />
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={styles.chartFrame}>
        <LineChart
          key={`${selectedRange}-${revenueTrend.map((point) => point.amount).join("-")}`}
          data={revenueTrend}
          xKey="label"
          yKeys={["amount"]}
          width={chartWidth}
          height={204}
          curve="linear"
          showDots={false}
          activeDot={{
            visible: true,
            shape: "circle",
            radius: 6,
            fill: theme.colors.accent,
            stroke: theme.colors.accent,
            strokeWidth: 0,
          }}
          defaultSelectedIndex={revenueTrend.length - 1}
          crosshair={{
            visible: true,
            color: theme.colors.white,
            strokeWidth: 1,
            opacity: 0.24,
            strokeDasharray: [4, 5],
          }}
          showHorizontalGridLines={false}
          showVerticalGridLines={false}
          yAxisLabelWidth="stable"
          formatYLabel={formatCompactCurrency}
            labelStrategy="show"
          edgeLabelPolicy="shift"
          series={[{ yKey: "amount", label: "Ingresos", color: theme.colors.accent, strokeWidth: 3.5, area: false }]}
          interaction="tap"
          tooltip={{
            visible: true,
            backgroundColor: theme.colors.electricBlue,
            borderColor: theme.colors.electricBlue,
            textColor: theme.colors.white,
            labelColor: theme.colors.white,
            borderRadius: theme.radius.standard,
            padding: theme.spacing.sm,
            shadowColor: theme.colors.black,
            shadowOpacity: 0.22,
            shadowOffsetY: 4,
          }}
          theme={theme.createLineChartTheme(theme.colors.accent)}
          accessibilityLabel={accessibilitySummary}
        />
        </View>
      </View>
    </View>
  );
};

export default AnalyticsHeroCard;

const styles = StyleSheet.create({
  container: {
    gap: theme.layout.elementGap,
  },
  summary: { gap: theme.spacing.xs, paddingVertical: theme.spacing.xs },
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  label: { color: theme.colors.authTextSecondary },
  change: { color: theme.colors.accent },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xs },
  currency: { color: theme.colors.authTextSecondary, fontSize: 13, lineHeight: 18 },
  value: { color: theme.colors.white },
  chartContent: { gap: theme.spacing.lg, paddingTop: theme.spacing.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.dividerOnDark, overflow: "hidden" },
  chartHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.sm },
  chartTitle: { color: theme.colors.white },
  rangeControl: { flexDirection: "row", alignItems: "center", padding: 3, borderRadius: theme.radius.pill, backgroundColor: theme.colors.authSurface },
  rangeOption: { minHeight: 48, alignItems: "center", justifyContent: "center", paddingHorizontal: theme.spacing.sm, borderRadius: theme.radius.pill },
  rangeOptionSelected: { backgroundColor: theme.colors.white },
  rangeLabel: { color: theme.colors.authTextSecondary, fontSize: 12, lineHeight: 16 },
  rangeLabelSelected: { color: theme.colors.black },
  chartFrame: { alignItems: "center", overflow: "hidden", paddingTop: theme.spacing.xs },
});
