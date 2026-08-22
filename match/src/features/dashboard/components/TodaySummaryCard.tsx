import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { Money03Icon } from "@hugeicons/core-free-icons";
import { StyleSheet, View } from "react-native";

interface TodaySummaryCardProps {
  revenue: number;
  reservationCount: number;
  pendingCount: number;
}

const TodaySummaryCard = ({ revenue, reservationCount, pendingCount }: TodaySummaryCardProps) => (
  <View style={styles.summary}>
    <View style={styles.heading}>
      <View style={styles.labelRow}>
        <CustomIcon icon={Money03Icon} color={theme.colors.accent} size={22} strokeWidth={2.25} />
        <CustomText text="Ingresos de hoy" variant="caption" style={styles.label} />
      </View>
    </View>
    <View style={styles.revenueRow}>
      <CustomText text="S/" variant="caption" style={styles.currency} />
      <CustomText text={String(revenue)} variant="display" style={styles.revenue} />
    </View>
    <View style={styles.metrics}>
      <Metric value={String(reservationCount)} label="Reservas" />
      <Metric value={String(pendingCount)} label="Pendientes" />
    </View>
  </View>
);

const Metric = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.metric}>
    <CustomText text={value} variant="action" style={styles.metricValue} />
    <CustomText text={label} variant="caption" style={styles.metricLabel} />
  </View>
);

export default TodaySummaryCard;

const styles = StyleSheet.create({
  summary: { gap: theme.spacing.sm },
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  labelRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  label: { color: theme.colors.authTextSecondary },
  revenueRow: { flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xs, marginTop: theme.spacing.xs },
  currency: { color: theme.colors.authTextSecondary },
  revenue: { color: theme.colors.white },
  metrics: { flexDirection: "row", alignItems: "center", marginTop: theme.spacing.md, paddingTop: theme.spacing.lg, gap: theme.spacing.xl, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.dividerOnDark },
  metric: { flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xs },
  metricValue: { color: theme.colors.white },
  metricLabel: { color: theme.colors.authTextSecondary },
});
