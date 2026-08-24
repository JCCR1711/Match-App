import CustomText from "@/src/components/ui/CustomText";
import ReservationTimeRange from "@/src/features/reservations/components/ReservationTimeRange";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import { formatBookingDuration } from "@/src/features/reservations/utils/formatBookingDuration";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

const ReservationBookingDetails = ({ reservation }: { reservation: ReservationRecord }) => (
  <View style={styles.details}>
    <View style={styles.primaryRow}>
      <View style={styles.field}>
        <CustomText text="Cancha" variant="caption" style={styles.label} />
        <CustomText
          text={reservation.fieldName}
          variant="bodyStrong"
          style={styles.fieldName}
        />
      </View>
      <View style={styles.durationBlock}>
        <CustomText text={formatBookingDuration(reservation.durationMinutes)} variant="body" style={styles.duration} />
      </View>
    </View>
    <ReservationTimeRange startTime={reservation.startTime} durationMinutes={reservation.durationMinutes} tone={reservation.status === "pending" ? "pending" : "reserved"} />
    <View style={styles.meta}>
      <View style={styles.dateBlock}>
        <CustomText text="Fecha" variant="caption" style={styles.label} />
        <CustomText text={reservation.dateLabel} variant="bodyStrong" style={styles.date} />
      </View>
      <View style={styles.venueBlock}>
        <CustomText text="Sede" variant="caption" style={styles.label} />
        <CustomText text={reservation.venueName} variant="bodyStrong" style={styles.venue} />
      </View>
    </View>
  </View>
);

export default memo(ReservationBookingDetails);

const styles = StyleSheet.create({
  details: { width: "100%", gap: theme.spacing.lg, paddingTop: theme.spacing.sm },
  primaryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.xl },
  field: { flex: 1, minWidth: 0, gap: theme.spacing.xs },
  label: { color: theme.colors.textOnDarkSecondary },
  fieldName: { color: theme.colors.white },
  durationBlock: { flexShrink: 0, alignItems: "flex-end", paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs, borderRadius: theme.radius.pill, backgroundColor: theme.colors.surface },
  duration: { color: theme.colors.white },
  meta: { width: "100%", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: theme.spacing.xl, paddingTop: theme.spacing.sm },
  dateBlock: { flex: 1, minWidth: 0, gap: theme.spacing.xs },
  venueBlock: { maxWidth: "42%", alignItems: "flex-end", gap: theme.spacing.xs },
  date: { color: theme.colors.white },
  venue: { color: theme.colors.textOnDarkSecondary, textAlign: "right" },
});
