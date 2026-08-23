import CustomText from "@/src/components/ui/CustomText";
import BusinessCardArrow from "@/src/features/dashboard/components/BusinessCardArrow";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import { theme } from "@/src/theme";
import { formatMoneyAmount, formatSoles } from "@/src/utils/formatMoney";
import { formatTimeRange } from "@/src/features/reservations/utils/reservationTime";
import { Pressable, StyleSheet, View } from "react-native";

const BusinessAttentionCard = ({ reservation, count, onPress }: { reservation: ReservationRecord; count: number; onPress: () => void }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`${count} ${count === 1 ? "reserva pendiente" : "reservas pendientes"}. La próxima es a las ${reservation.startTime}, ${reservation.customerName}, ${reservation.fieldName}, ${formatSoles(reservation.amount)}`}
    onPress={onPress}
    style={({ pressed }) => [styles.card, pressed && styles.pressed]}
  >
    <View style={styles.headline}>
      <CustomText text={String(count)} variant="display" style={styles.count} />
      <CustomText text={count === 1 ? "Pendiente" : "Pendientes"} variant="subtitle" style={styles.title} />
      <BusinessCardArrow backgroundColor={theme.colors.black} color={theme.colors.pendingLimeText} style={styles.action} />
    </View>
    <View style={styles.nextReservation}>
      <View style={styles.copy}>
        <CustomText text={reservation.customerName} variant="bodyStrong" style={styles.customer} numberOfLines={1} />
        <CustomText text={reservation.fieldName} variant="caption" style={styles.detail} numberOfLines={1} />
      </View>
      <View style={styles.trailing}>
        <CustomText text={formatTimeRange(reservation.startTime, reservation.durationMinutes)} variant="label" style={styles.time} />
        <View style={styles.amountRow}>
          <CustomText text="S/" variant="caption" style={styles.currency} />
          <CustomText text={formatMoneyAmount(reservation.amount)} variant="action" style={styles.amount} />
        </View>
      </View>
    </View>
  </Pressable>
);

export default BusinessAttentionCard;

const styles = StyleSheet.create({
  card: { minHeight: 164, gap: theme.spacing.lg, padding: theme.spacing.xl, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.authPrimary },
  headline: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  count: { color: theme.colors.black, fontSize: 44, lineHeight: 50 },
  title: { flex: 1, minWidth: 0, color: theme.colors.black },
  action: { marginLeft: "auto" },
  nextReservation: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  time: { color: theme.colors.black },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  customer: { color: theme.colors.black },
  detail: { color: theme.colors.black, opacity: 0.66 },
  trailing: { flexShrink: 0, alignItems: "flex-end", justifyContent: "center", gap: theme.spacing.xxs },
  amountRow: { flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xxs },
  currency: { color: theme.colors.black, opacity: 0.66, fontSize: 11, lineHeight: 16 },
  amount: { color: theme.colors.black },
  pressed: { opacity: 0.78 },
});
