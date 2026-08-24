import AppSection from "@/src/components/ui/AppSection";
import CustomText from "@/src/components/ui/CustomText";
import SportsAvatar from "@/src/components/ui/SportsAvatar";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import { isActiveReservation } from "@/src/features/reservations/utils/isActiveReservation";
import { formatTimeRange } from "@/src/features/reservations/utils/reservationTime";
import { getCompactFieldName, getReservationCustomerLabel } from "@/src/features/reservations/utils/reservationIdentity";
import { theme } from "@/src/theme";
import { formatMoneyAmount } from "@/src/utils/formatMoney";
import { Pressable, StyleSheet, View } from "react-native";

type AgendaItem = { reservation: ReservationRecord; time: string; durationMinutes: number; title: string; detail: string; amount: number; status: "confirmed" | "pending" };

const TodayAgendaPreview = ({ reservations, onOpenAll, onOpenReservation }: { reservations: ReservationRecord[]; onOpenAll: () => void; onOpenReservation: (reservation: ReservationRecord) => void }) => {
  const items: AgendaItem[] = reservations
    .filter(isActiveReservation)
    .map((reservation): AgendaItem => ({ reservation, time: reservation.startTime, durationMinutes: reservation.durationMinutes, title: getReservationCustomerLabel(reservation), detail: getCompactFieldName(reservation.fieldName), amount: reservation.amount, status: reservation.status }))
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 3);

  if (items.length === 0) return null;

  return (
    <AppSection title="Agenda de hoy" actionLabel="Ver agenda" onAction={onOpenAll}>
      <View style={styles.list}>
        {items.map((item) => <AgendaCard key={item.reservation.id} item={item} onPress={() => onOpenReservation(item.reservation)} />)}
      </View>
    </AppSection>
  );
};

const AgendaCard = ({ item, onPress }: { item: AgendaItem; onPress: () => void }) => {
  const isConfirmed = item.status === "confirmed";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir reserva de ${item.reservation.customerName}, ${formatTimeRange(item.time, item.durationMinutes)}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, isConfirmed && styles.confirmedCard, pressed && styles.pressed]}
    >
      <View style={styles.avatar}>
        <SportsAvatar seed={item.title} size={44} />
      </View>
      <View style={styles.copy}>
        <CustomText text={item.title} variant="bodyStrong" style={styles.title} numberOfLines={1} ellipsizeMode="tail" />
        <CustomText text={item.detail} variant="caption" style={styles.detail} numberOfLines={1} ellipsizeMode="tail" />
        <View style={styles.bookingMeta}>
          <ScheduleStatusLabel status={item.status} />
          <View style={styles.metaDivider} />
          <CustomText text={item.time} variant="label" style={styles.time} />
        </View>
      </View>
      <View style={styles.trailing}>
        <View style={styles.amountRow}>
          <CustomText text="S/" variant="label" style={styles.currency} />
          <CustomText text={formatMoneyAmount(item.amount)} variant="actionSecondary" style={styles.amount} />
        </View>
      </View>
    </Pressable>
  );
};

export default TodayAgendaPreview;

const styles = StyleSheet.create({
  list: { gap: theme.spacing.sm },
  card: { minHeight: 96, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, padding: theme.spacing.md, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.authSurface },
  confirmedCard: { backgroundColor: theme.colors.businessBlueSurface },
  avatar: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, overflow: "hidden", backgroundColor: theme.colors.black },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  title: { flexShrink: 1, color: theme.colors.white },
  detail: { flexShrink: 1, color: theme.colors.textOnDarkSecondary },
  bookingMeta: { minHeight: 18, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  metaDivider: { width: 3, height: 3, borderRadius: theme.radius.pill, backgroundColor: theme.colors.textOnDarkSecondary },
  time: { color: theme.colors.textOnDarkSecondary },
  trailing: { flexShrink: 0, alignItems: "flex-end", justifyContent: "center" },
  amountRow: { flexShrink: 0, flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xxs },
  currency: { color: theme.colors.textOnDarkSecondary },
  amount: { color: theme.colors.white },
  pressed: { opacity: 0.78 },
});
