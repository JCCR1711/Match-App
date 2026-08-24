import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import { formatBookingDuration } from "@/src/features/reservations/utils/formatBookingDuration";
import { getCompactFieldName } from "@/src/features/reservations/utils/reservationIdentity";
import { formatTimeRange } from "@/src/features/reservations/utils/reservationTime";
import { theme } from "@/src/theme";
import { formatSoles } from "@/src/utils/formatMoney";
import { StyleSheet, View } from "react-native";

interface PlayerBookingSummaryCardProps {
  venueName: string;
  fieldName: string;
  dateLabel: string;
  startTime: string;
  durationMinutes: number;
  total: number;
  referenceCode?: string;
}

const PlayerBookingSummaryCard = ({ venueName, fieldName, dateLabel, startTime, durationMinutes, total, referenceCode }: PlayerBookingSummaryCardProps) => (
  <AppSurface style={styles.card}>
    <View style={styles.heading}>
      <View style={styles.copy}>
        <CustomText text={venueName} variant="sectionHeading" style={styles.venueName} numberOfLines={1} ellipsizeMode="tail" />
        <CustomText text={`${getCompactFieldName(fieldName)}${referenceCode ? ` · #${referenceCode}` : ""}`} variant="caption" style={styles.fieldName} numberOfLines={1} ellipsizeMode="tail" />
      </View>
      <CustomText text={formatSoles(total)} variant="action" style={styles.total} />
    </View>
    <View style={styles.schedule}>
      <CustomText text={`${dateLabel} · ${formatTimeRange(startTime, durationMinutes)} · ${formatBookingDuration(durationMinutes)}`} variant="caption" style={styles.scheduleText} numberOfLines={1} />
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
  total: { flexShrink: 0, color: theme.colors.accent, textAlign: "right" },
  schedule: { paddingTop: theme.spacing.xs },
  scheduleText: { color: theme.colors.authTextSecondary },
});
