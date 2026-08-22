import CustomText from "@/src/components/ui/CustomText";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import { formatBookingDuration } from "@/src/features/reservations/utils/formatBookingDuration";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown, ReduceMotion } from "react-native-reanimated";

const META_ENTERING = FadeInDown.duration(220).delay(35).reduceMotion(ReduceMotion.System);
const META_EXITING = FadeOutDown.duration(140).delay(25).reduceMotion(ReduceMotion.System);

const ReservationBookingDetails = ({ reservation, expanded }: { reservation: ReservationRecord; expanded: boolean }) => (
  <View style={styles.details}>
    <View style={styles.primaryRow}>
      <View style={styles.field}>
        <CustomText text="Cancha" variant="caption" style={styles.label} />
        <CustomText text={reservation.fieldName} variant="subtitle" style={styles.fieldName} numberOfLines={2} />
      </View>
      <View style={styles.schedule}>
        <CustomText text={reservation.startTime} variant="heading" style={styles.time} numberOfLines={1} />
        <CustomText text={formatBookingDuration(reservation.durationMinutes)} variant="caption" style={styles.duration} />
      </View>
    </View>
    {expanded ? (
      <Animated.View entering={META_ENTERING} exiting={META_EXITING} style={styles.meta}>
        <View style={styles.dateBlock}>
          <CustomText text="Fecha" variant="caption" style={styles.label} />
          <CustomText text={reservation.dateLabel} variant="sectionHeading" style={styles.date} numberOfLines={2} />
        </View>
        <View style={styles.venueBlock}>
          <CustomText text="Sede" variant="caption" style={styles.label} />
          <CustomText text={reservation.venueName} variant="actionSecondary" style={styles.venue} numberOfLines={2} />
        </View>
      </Animated.View>
    ) : null}
  </View>
);

export default memo(ReservationBookingDetails);

const styles = StyleSheet.create({
  details: { width: "100%", gap: theme.spacing.lg, paddingTop: theme.spacing.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.dividerOnDark },
  primaryRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: theme.spacing.xl },
  field: { flex: 1, minWidth: 0, gap: theme.spacing.xs },
  label: { color: theme.colors.textOnDarkSecondary },
  fieldName: { color: theme.colors.white },
  schedule: { flexShrink: 0, alignItems: "flex-end", gap: theme.spacing.xxs },
  time: { color: theme.colors.accent },
  duration: { color: theme.colors.textOnDarkSecondary },
  meta: { width: "100%", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: theme.spacing.xl, paddingTop: theme.spacing.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.dividerOnDark },
  dateBlock: { flex: 1, minWidth: 0, gap: theme.spacing.xs },
  venueBlock: { maxWidth: "42%", alignItems: "flex-end", gap: theme.spacing.xs },
  date: { color: theme.colors.white },
  venue: { color: theme.colors.textOnDarkSecondary, textAlign: "right" },
});
