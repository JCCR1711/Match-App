import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import SportsAvatar from "@/src/components/ui/SportsAvatar";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import ReservationSourceBadge from "@/src/features/reservations/components/ReservationSourceBadge";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import { getCompactFieldName, getReservationCustomerLabel } from "@/src/features/reservations/utils/reservationIdentity";
import { formatTimeRange } from "@/src/features/reservations/utils/reservationTime";
import { theme } from "@/src/theme";
import { formatMoneyAmount } from "@/src/utils/formatMoney";
import { StyleSheet, View } from "react-native";

interface BusinessReservationPreviewCardProps {
  reservation: ReservationRecord;
  onPress: () => void;
}

const BusinessReservationPreviewCard = ({ reservation, onPress }: BusinessReservationPreviewCardProps) => {
  const customerLabel = getReservationCustomerLabel(reservation);
  const isConfirmed = reservation.status === "confirmed";

  return (
    <AppSurface
      variant="transparent"
      accessibilityLabel={`Abrir reserva de ${reservation.customerName}, ${formatTimeRange(reservation.startTime, reservation.durationMinutes)}`}
      onPress={onPress}
      style={[styles.card, isConfirmed && styles.confirmedCard]}
    >
      <View style={styles.avatar}>
        <SportsAvatar seed={customerLabel} size={40} />
      </View>
      <View style={styles.copy}>
        <CustomText text={customerLabel} variant="bodyStrong" style={styles.title} numberOfLines={1} ellipsizeMode="tail" />
        <CustomText text={getCompactFieldName(reservation.fieldName)} variant="caption" style={styles.detail} numberOfLines={1} ellipsizeMode="tail" />
        <View style={styles.bookingMeta}>
          <ScheduleStatusLabel status={reservation.status} emphasis="micro" />
          <View style={styles.metaDivider} />
          <CustomText text={reservation.startTime} variant="label" style={styles.time} />
          <ReservationSourceBadge source={reservation.source} />
        </View>
      </View>
      <View style={styles.trailing}>
        <View style={styles.amountRow}>
          <CustomText text="S/" variant="label" style={styles.currency} />
          <CustomText text={formatMoneyAmount(reservation.amount)} variant="actionSecondary" style={styles.amount} />
        </View>
      </View>
    </AppSurface>
  );
};

export default BusinessReservationPreviewCard;

const styles = StyleSheet.create({
  card: { minHeight: 92, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.authSurface },
  confirmedCard: { backgroundColor: theme.colors.reservedSurface },
  avatar: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, overflow: "hidden", backgroundColor: theme.colors.black },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  title: { flexShrink: 1, color: theme.colors.white },
  detail: { flexShrink: 1, color: theme.colors.textOnDarkSecondary },
  bookingMeta: { minHeight: 18, flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: theme.spacing.xs },
  metaDivider: { width: 3, height: 3, borderRadius: theme.radius.pill, backgroundColor: theme.colors.textOnDarkSecondary },
  time: { color: theme.colors.textOnDarkSecondary },
  trailing: { flexShrink: 0, alignItems: "flex-end", justifyContent: "center" },
  amountRow: { flexShrink: 0, flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xxs },
  currency: { color: theme.colors.textOnDarkSecondary },
  amount: { color: theme.colors.white },
});
