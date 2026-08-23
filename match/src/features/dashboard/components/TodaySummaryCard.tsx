import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { Pressable, StyleSheet, View } from "react-native";

interface TodaySummaryCardProps {
  revenue: number;
  reservationCount: number;
  pendingCount: number;
  onPress: () => void;
}

const formatRevenue = (revenue: number) => {
  const safeRevenue = Number.isFinite(revenue) ? revenue : 0;
  const [integerPart, fractionPart] = Math.abs(safeRevenue).toFixed(2).split(".");
  const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return {
    whole: `${safeRevenue < 0 ? "-" : ""}${groupedInteger}`,
    decimals: `.${fractionPart}`,
  };
};

const TodaySummaryCard = ({ revenue, reservationCount, pendingCount, onPress }: TodaySummaryCardProps) => {
  const formattedRevenue = formatRevenue(revenue);

  return (
    <View style={styles.summary}>
      <View style={styles.heading}>
        <CustomText text="Ingresos de hoy" variant="sectionHeading" style={styles.label} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver rendimiento de hoy"
          onPress={onPress}
          style={({ pressed }) => [styles.analyticsAction, pressed && styles.pressed]}
        >
          <CustomText text="Ver rendimiento" variant="caption" style={styles.analyticsActionLabel} />
        </Pressable>
      </View>
      <View style={styles.revenueRow}>
        <CustomText text="S/" variant="display" style={styles.currency} />
        <CustomText text={formattedRevenue.whole} variant="display" style={styles.revenue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72} />
        <CustomText text={formattedRevenue.decimals} variant="subtitle" style={styles.decimals} />
      </View>
      <View style={styles.metrics}>
        <Metric value={String(reservationCount)} label="Reservas" />
        <Metric value={String(pendingCount)} label="Pendientes" />
      </View>
    </View>
  );
};

const Metric = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.metric}>
    <CustomText text={value} variant="action" style={styles.metricValue} />
    <CustomText text={label} variant="caption" style={styles.metricLabel} />
  </View>
);

export default TodaySummaryCard;

const styles = StyleSheet.create({
  summary: { gap: theme.spacing.xl, paddingVertical: theme.spacing.xl },
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  label: { color: theme.colors.white },
  revenueRow: { minWidth: 0, flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xs },
  currency: { color: theme.colors.white, fontSize: 54, lineHeight: 62 },
  revenue: { flexShrink: 1, color: theme.colors.white, fontSize: 54, lineHeight: 62 },
  decimals: { color: theme.colors.textOnDarkSecondary },
  analyticsAction: { minHeight: 48, justifyContent: "center" },
  analyticsActionLabel: { color: theme.colors.authTextSecondary, fontFamily: theme.fontFamilies.poppinsBold },
  metrics: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xxl, marginTop: theme.spacing.sm },
  metric: { flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xs },
  metricValue: { color: theme.colors.white },
  metricLabel: { color: theme.colors.textOnDarkSecondary },
  pressed: { opacity: 0.72 },
});
