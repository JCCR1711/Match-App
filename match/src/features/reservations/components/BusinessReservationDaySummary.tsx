import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

interface BusinessReservationDaySummaryProps {
  dateLabel: string;
  reservationCount: number;
  availableHours: number;
}

const BusinessReservationDaySummary = ({ dateLabel, reservationCount, availableHours }: BusinessReservationDaySummaryProps) => (
  <View style={styles.container}>
    <CustomText text={dateLabel} variant="sectionHeading" style={styles.date} numberOfLines={1} />
    <View style={styles.metrics}>
      <View style={styles.metric}>
        <CustomText text={String(reservationCount)} variant="subtitle" style={styles.value} />
        <CustomText text={reservationCount === 1 ? "reserva" : "reservas"} variant="label" style={styles.label} />
      </View>
      <View style={styles.divider} />
      <View style={styles.metric}>
        <CustomText text={String(availableHours)} variant="subtitle" style={styles.availableValue} />
        <CustomText text="horas libres" variant="label" style={styles.label} />
      </View>
    </View>
  </View>
);

export default memo(BusinessReservationDaySummary);

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.lg, paddingVertical: theme.spacing.xs },
  date: { flex: 1, minWidth: 0, color: theme.colors.white, textTransform: "capitalize" },
  metrics: { flexDirection: "row", alignItems: "center", gap: theme.spacing.md },
  metric: { alignItems: "flex-end" },
  value: { color: theme.colors.white },
  availableValue: { color: theme.colors.accent },
  label: { color: theme.colors.authTextSecondary },
  divider: { width: StyleSheet.hairlineWidth, height: 34, backgroundColor: theme.colors.dividerOnDark },
});
