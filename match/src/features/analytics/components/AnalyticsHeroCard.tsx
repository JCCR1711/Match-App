import CustomText from "@/src/components/ui/CustomText";
import type { BusinessMetric } from "@/src/features/analytics/types/businessAnalytics";
import { theme } from "@/src/theme";
import { LineChart } from "react-native-chart-kit/v2";
import { StyleSheet, useWindowDimensions, View } from "react-native";

const revenueTrend = [
  { month: "Ene", current: 18 },
  { month: "Feb", current: 29 },
  { month: "Mar", current: 41 },
  { month: "Abr", current: 53 },
  { month: "May", current: 66 },
  { month: "Jun", current: 79 },
  { month: "Jul", current: 92 },
];

const AnalyticsHeroCard = ({ metric }: { metric: BusinessMetric }) => {
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(Math.max(width - theme.spacing.lg * 2, 280), 430);

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View>
          <CustomText text={metric.label} variant="caption" style={styles.label} />
          <CustomText text={metric.value} variant="body" style={styles.value} />
        </View>
        <CustomText text={metric.change} variant="caption" style={styles.change} />
      </View>
      <View style={styles.chartFrame}>
        <LineChart
          data={revenueTrend}
          xKey="month"
          yKeys={["current"]}
          width={chartWidth}
          height={196}
          yDomain={[0, 100]}
          curve="monotone"
          showDots={false}
          showHorizontalGridLines={false}
          showVerticalGridLines={false}
          yAxisLabelWidth={0}
          formatYLabel={() => ""}
          labelStrategy="show"
          series={[
            {
              yKey: "current",
              label: "Actual",
              color: theme.colors.accent,
              strokeWidth: 3.5,
              area: true,
              areaFill: {
                fromColor: theme.colors.accent,
                toColor: theme.colors.accent,
                fromOpacity: 0.14,
                toOpacity: 0.02,
              },
            },
          ]}
          interaction="tap"
          tooltip={{
            visible: true,
            backgroundColor: "rgba(18,18,20,0.96)",
            borderColor: "transparent",
            textColor: theme.colors.white,
            shadowOpacity: 0,
          }}
          theme={theme.createLineChartTheme(theme.colors.accent)}
          accessibilityLabel="Gráfico de línea de ingresos"
        />
      </View>
    </View>
  );
};

export default AnalyticsHeroCard;

const styles = StyleSheet.create({
  container: { gap: theme.spacing.xxl },
  heading: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: theme.spacing.lg },
  label: { color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 20 },
  value: { marginTop: theme.spacing.xs, color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold, fontSize: 42, lineHeight: 50, letterSpacing: -1.1 },
  change: { color: theme.colors.accent, fontSize: 15, lineHeight: 20 },
  chartFrame: { alignItems: "center", overflow: "hidden" },
});
