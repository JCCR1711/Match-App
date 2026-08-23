import CustomText from "@/src/components/ui/CustomText";
import { addMinutesToTime } from "@/src/features/reservations/utils/reservationTime";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

interface ReservationTimeRangeProps {
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  tone?: "neutral" | "available" | "reserved" | "pending" | "blocked" | "maintenance";
}

const toneColors: Record<NonNullable<ReservationTimeRangeProps["tone"]>, string> = {
  neutral: theme.colors.white,
  available: theme.colors.textMuted,
  reserved: theme.colors.accent,
  pending: theme.colors.pendingLimeText,
  blocked: theme.colors.errorSoft,
  maintenance: theme.colors.warmAmber,
};

const ReservationTimeRange = ({ startTime, endTime, durationMinutes = 60, tone = "neutral" }: ReservationTimeRangeProps) => {
  const resolvedEndTime = endTime ?? addMinutesToTime(startTime, durationMinutes);

  return (
    <View style={styles.range} accessible accessibilityLabel={`Horario de ${startTime} a ${resolvedEndTime}`}>
      <View style={styles.timeNode}>
        <CustomText text="Inicio" variant="caption" style={styles.label} />
        <CustomText text={startTime} variant="sectionHeading" style={styles.time} numberOfLines={1} />
      </View>
      <View style={styles.connector}>
        <View style={styles.connectorLine} />
        <View style={[styles.connectorMarker, { backgroundColor: toneColors[tone] }]} />
      </View>
      <View style={styles.timeNode}>
        <CustomText text="Fin" variant="caption" style={styles.label} />
        <CustomText text={resolvedEndTime} variant="sectionHeading" style={[styles.time, { color: toneColors[tone] }]} numberOfLines={1} />
      </View>
    </View>
  );
};

export default memo(ReservationTimeRange);

const styles = StyleSheet.create({
  range: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: theme.spacing.xs },
  timeNode: {
    flex: 1,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 100,
    backgroundColor: theme.colors.surface,
  },
  connector: { flex: 0.3, height: 12, alignItems: "center", justifyContent: "center" },
  connectorLine: { position: "absolute", width: "100%", height: 2, backgroundColor: theme.colors.dividerOnDark },
  connectorMarker: { width: 8, height: 8, borderRadius: 100 },
  label: { color: theme.colors.textOnDarkSecondary },
  time: { color: theme.colors.white, textAlign: "center" },
});
