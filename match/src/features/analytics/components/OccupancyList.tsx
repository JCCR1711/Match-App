import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import type { OccupancyComparison } from "@/src/features/analytics/types/businessAnalytics";
import { theme } from "@/src/theme";
import { LineChart } from "react-native-chart-kit/v2";
import { StyleSheet, useWindowDimensions, View } from "react-native";

const chartColors = [theme.colors.electricBlue, theme.colors.luminousLavender, theme.colors.softCoral, theme.colors.iceBlue];
const trendShapes = [
  [44, 52, 48, 66, 61, 74, 82],
  [38, 46, 42, 55, 51, 58, 64],
  [26, 31, 29, 40, 37, 45, 51],
  [34, 36, 43, 41, 49, 55, 59],
];

const OccupancyList = ({ items }: { items: OccupancyComparison[] }) => {
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(138, Math.min(width * 0.42, 176));

  return (
    <View style={styles.grid}>
      {items.map((item, index) => {
        const color = chartColors[index % chartColors.length];
        const trend = trendShapes[index % trendShapes.length].map((value, slot) => ({ slot, value }));
        return (
          <AppSurface key={item.id} style={styles.card}>
            <View style={styles.copy}>
              <CustomText text={item.label} variant="body" style={styles.title} numberOfLines={1} />
              <CustomText text={`${item.percentage}%`} variant="body" style={styles.value} />
              <CustomText text={item.venue} variant="caption" style={styles.subtitle} numberOfLines={1} />
            </View>
            <View style={styles.chartFrame}>
              <LineChart
                data={trend}
                xKey="slot"
                yKey="value"
                width={chartWidth}
                height={90}
                yDomain={[0, 100]}
                curve="monotone"
                showDots={false}
                showHorizontalGridLines={false}
                showVerticalGridLines={false}
                yAxisLabelWidth={0}
                formatYLabel={() => ""}
                labelStrategy="hide"
                edgeLabelPolicy="hide"
                series={[{
                  yKey: "value",
                  color,
                  strokeWidth: 2.2,
                }]}
                theme={theme.createLineChartTheme(color)}
                accessibilityLabel={`Tendencia de ocupación de ${item.label}`}
              />
            </View>
          </AppSurface>
        );
      })}
    </View>
  );
};

export default OccupancyList;

const styles = StyleSheet.create({
  grid: { gap: theme.spacing.lg },
  card: { minHeight: 144, flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: theme.spacing.xl, gap: theme.spacing.lg, overflow: "hidden" },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  title: { color: theme.colors.white },
  value: { marginTop: theme.spacing.xs, color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold, fontSize: 29, lineHeight: 36 },
  subtitle: { color: "rgba(255,255,255,0.4)" },
  chartFrame: { width: "46%", height: 92, overflow: "hidden" },
});
