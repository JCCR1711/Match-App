import CustomText from "@/src/components/ui/CustomText";
import type { AnalyticsRange, BusinessMetric, RevenuePoint } from "@/src/features/analytics/types/businessAnalytics";
import { formatAnalyticsChange, formatAnalyticsMetric, formatCompactCurrency, formatCurrency } from "@/src/features/analytics/utils/formatAnalyticsMetric";
import { theme } from "@/src/theme";
import { LineChart, type LineChartTooltipRenderProps } from "react-native-chart-kit/v2";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { G, Rect, Text as SvgText } from "react-native-svg";

const ranges: { id: AnalyticsRange; label: string }[] = [
  { id: "week", label: "Sem" },
  { id: "month", label: "Mes" },
  { id: "year", label: "Año" },
];

interface AnalyticsHeroCardProps {
  metric: BusinessMetric;
  periodLabel: string;
  revenueTrend: RevenuePoint[];
  selectedRange: AnalyticsRange;
  onRangeChange: (range: AnalyticsRange) => void;
  showYear?: boolean;
}

const AnalyticsHeroCard = ({ metric, periodLabel, revenueTrend, selectedRange, onRangeChange, showYear = true }: AnalyticsHeroCardProps) => {
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(272, Math.min(width - theme.layout.screenGutter * 2 - theme.spacing.xs, 600));
  const formattedMetric = formatAnalyticsMetric(metric.value, metric.format);
  const accessibilitySummary = `${periodLabel}. ${formatCurrency(metric.value)} en ingresos. ${revenueTrend.map((point) => `${point.label}: ${formatCurrency(point.amount)}`).join(", ")}.`;

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <View style={styles.heading}>
          <View style={styles.headingCopy}>
            <CustomText text={metric.label} variant="caption" style={styles.label} />
            <CustomText text={periodLabel} variant="caption" style={styles.period} />
          </View>
          <CustomText text={metric.change === null ? "Sin historial comparable" : `${formatAnalyticsChange(metric.change)} vs. periodo anterior`} variant="caption" style={[styles.change, metric.change === null && styles.changeMuted]} />
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
            {ranges.filter((range) => showYear || range.id !== "year").map((range) => {
              const selected = range.id === selectedRange;
              return (
                <Pressable key={range.id} accessibilityRole="tab" accessibilityState={{ selected }} onPress={() => onRangeChange(range.id)} style={({ pressed }) => [styles.rangeOption, selected && styles.rangeOptionSelected, pressed && styles.pressed]}>
                  <CustomText text={range.label} variant="label" style={[styles.rangeLabel, selected && styles.rangeLabelSelected]} />
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
            height={224}
            curve="linear"
            showDots={false}
            activeDot={{ visible: true, shape: "circle", radius: 5, fill: theme.colors.white, stroke: theme.colors.white, strokeWidth: 0 }}
            defaultSelectedIndex={revenueTrend.length - 1}
            crosshair={{ visible: true, color: theme.colors.white, strokeWidth: 1, opacity: 0.2, strokeDasharray: [4, 5] }}
            showHorizontalGridLines
            showVerticalGridLines={false}
            yAxisLabelWidth="auto"
            formatYLabel={formatCompactCurrency}
            labelStrategy="show"
            edgeLabelPolicy="shift"
            series={[{ yKey: "amount", label: "Ventas", color: theme.colors.white, strokeWidth: 2.6, area: false }]}
            interaction="tap"
            tooltip={{ visible: true, backgroundColor: theme.colors.authSurface, borderColor: theme.colors.controlBorderOnDark, textColor: theme.colors.white, labelColor: theme.colors.authTextSecondary, borderRadius: theme.radius.standard, padding: theme.spacing.sm }}
            renderTooltip={renderRevenueTooltip}
            theme={theme.createLineChartTheme(theme.colors.white)}
            accessibilityLabel={accessibilitySummary}
          />
        </View>
      </View>
    </View>
  );
};

const tooltipAmountFormatter = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 });

const renderRevenueTooltip = ({ x, y, width, series }: LineChartTooltipRenderProps<RevenuePoint>) => {
  const point = series[0]?.point.raw;
  if (!point) return null;

  const tooltipWidth = 112;
  const tooltipHeight = 56;
  const centerX = x + width / 2;
  const left = centerX - tooltipWidth / 2;

  return (
    <G>
      <Rect
        x={left}
        y={y}
        width={tooltipWidth}
        height={tooltipHeight}
        rx={theme.radius.standard}
        fill={theme.colors.authSurface}
        stroke={theme.colors.controlBorderOnDark}
        strokeWidth={1}
      />
      <SvgText x={centerX} y={y + 23} fill={theme.colors.white} fontSize={14} fontWeight="700" textAnchor="middle">
        {`S/ ${tooltipAmountFormatter.format(point.amount)}`}
      </SvgText>
      <SvgText x={centerX} y={y + 43} fill={theme.colors.authTextSecondary} fontSize={12} fontWeight="600" textAnchor="middle">
        {point.dayLabel}
      </SvgText>
    </G>
  );
};

export default AnalyticsHeroCard;

const styles = StyleSheet.create({
  container: { gap: theme.layout.elementGap },
  summary: { gap: theme.spacing.xs, paddingVertical: theme.spacing.xs },
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  headingCopy: { minWidth: 0, flex: 1, gap: 1 },
  label: { color: theme.colors.authTextSecondary },
  period: { color: theme.colors.authTextSecondary },
  change: { color: theme.colors.white },
  changeMuted: { color: theme.colors.authTextSecondary },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xs },
  currency: { color: theme.colors.authTextSecondary, fontSize: 13, lineHeight: 18 },
  value: { color: theme.colors.white },
  chartContent: { gap: theme.spacing.lg, overflow: "hidden" },
  chartHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.sm },
  chartTitle: { color: theme.colors.white },
  rangeControl: { flexDirection: "row", alignItems: "center", padding: 3, borderRadius: theme.radius.pill, backgroundColor: theme.colors.authSurface },
  rangeOption: { minWidth: 46, minHeight: 42, alignItems: "center", justifyContent: "center", paddingHorizontal: theme.spacing.xs, borderRadius: theme.radius.pill },
  rangeOptionSelected: { backgroundColor: theme.colors.authPrimary },
  rangeLabel: { color: theme.colors.authTextSecondary },
  rangeLabelSelected: { color: theme.colors.black },
  chartFrame: { alignItems: "center", overflow: "hidden", paddingTop: theme.spacing.xs },
  pressed: { opacity: 0.72 },
});
