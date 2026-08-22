import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import { formatBookingDuration } from "@/src/features/reservations/utils/formatBookingDuration";
import type { PlayerBookingSummary } from "@/src/features/reservations/types/playerReservation";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

const PlayerBookingSummaryCard = ({ venueName, fieldName, dateLabel, startTime, durationMinutes, total }: PlayerBookingSummary) => (
  <AppSurface style={styles.card}>
    <View style={styles.heading}>
      <View style={styles.copy}>
        <CustomText text={venueName} variant="sectionHeading" style={styles.venueName} numberOfLines={1} />
        <CustomText text={fieldName} variant="caption" style={styles.fieldName} numberOfLines={1} />
      </View>
      <CustomText text={`S/ ${total}`} variant="action" style={styles.total} />
    </View>
    <View style={styles.schedule}>
      <CustomText text={`${dateLabel} · ${startTime} · ${formatBookingDuration(durationMinutes)}`} variant="caption" style={styles.scheduleText} numberOfLines={1} />
    </View>
  </AppSurface>
);

export default PlayerBookingSummaryCard;

const styles = StyleSheet.create({
  card: { padding: theme.spacing.lg, gap: theme.spacing.md },
  heading: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: theme.spacing.md },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  venueName: { color: theme.colors.white },
  fieldName: { color: theme.colors.authTextSecondary },
  total: { color: theme.colors.accent, textAlign: "right" },
  schedule: { paddingTop: theme.spacing.xs },
  scheduleText: { color: theme.colors.authTextSecondary },
});
