import AppSection from "@/src/components/ui/AppSection";
import CustomText from "@/src/components/ui/CustomText";
import SportsAvatar from "@/src/components/ui/SportsAvatar";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import type { AvailabilityBlock, ReservationRecord } from "@/src/features/reservations/types/reservation";
import { getReservationCustomerLabel } from "@/src/features/reservations/utils/reservationIdentity";
import { theme } from "@/src/theme";
import { formatMoneyParts } from "@/src/utils/formatMoney";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface FieldTodayOverviewProps {
  reservations: ReservationRecord[];
  blocks: AvailabilityBlock[];
  onOpenAgenda: () => void;
  onOpenReservation: (reservation: ReservationRecord) => void;
}

const formatOccupiedTime = (minutes: number) => {
  if (minutes === 0) return "0 h";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes === 0 ? `${hours} h` : `${hours} h ${remainingMinutes} m`;
};

const getTimeMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const FieldTodayOverview = ({ reservations, blocks, onOpenAgenda, onOpenReservation }: FieldTodayOverviewProps) => {
  const ordered = [...reservations].sort((a, b) => a.startTime.localeCompare(b.startTime));
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const upcomingReservations = ordered
    .filter((reservation) => getTimeMinutes(reservation.startTime) + reservation.durationMinutes > currentMinutes)
    .slice(0, 3);
  const confirmedRevenue = reservations.filter((item) => item.status === "confirmed").reduce((total, item) => total + item.amount, 0);
  const formattedRevenue = formatMoneyParts(confirmedRevenue);
  const occupiedMinutes = [...reservations, ...blocks].reduce((total, item) => total + item.durationMinutes, 0);

  return (
    <AppSection title="Hoy" actionLabel="Ver agenda" onAction={onOpenAgenda}>
      <View style={styles.content}>
        <View style={styles.revenue}>
          <View style={styles.revenueValue}>
            <CustomText text="S/" variant="display" style={styles.currency} />
            <CustomText text={formattedRevenue.whole} variant="display" style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.76} />
            <CustomText text={formattedRevenue.decimals} variant="subtitle" style={styles.decimals} />
          </View>
          <CustomText text="Ingresos confirmados" variant="caption" style={styles.revenueLabel} />
        </View>
        <View style={styles.metrics}>
          <Metric value={String(reservations.length)} label={reservations.length === 1 ? "Reserva" : "Reservas"} tone="reservations" />
          <Metric value={formatOccupiedTime(occupiedMinutes)} label="Ocupadas" tone="occupied" />
        </View>
        {upcomingReservations.length > 0 ? (
          <View style={styles.nextBlock}>
            <CustomText text="Siguientes reservas" variant="bodyStrong" style={styles.nextLabel} />
            <View style={styles.reservationList}>
              {upcomingReservations.map((reservation) => (
                <ReservationPreview key={reservation.id} reservation={reservation} onPress={() => onOpenReservation(reservation)} />
              ))}
            </View>
          </View>
        ) : <CustomText text={reservations.length > 0 ? "No quedan reservas para hoy" : "Sin reservas para hoy"} variant="body" style={styles.empty} />}
      </View>
    </AppSection>
  );
};

const ReservationPreview = ({ reservation, onPress }: { reservation: ReservationRecord; onPress: () => void }) => (
  <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Abrir reserva de ${getReservationCustomerLabel(reservation)}`} style={({ pressed }) => [styles.next, reservation.status === "confirmed" && styles.nextConfirmed, pressed && styles.pressed]}>
    <SportsAvatar seed={reservation.customerName} size={42} />
    <View style={styles.nextCopy}>
      <CustomText text={getReservationCustomerLabel(reservation)} variant="bodyStrong" style={styles.customer} numberOfLines={1} />
      <ScheduleStatusLabel status={reservation.status} />
    </View>
    <CustomText text={reservation.startTime} variant="actionSecondary" style={styles.time} />
  </Pressable>
);

const Metric = ({ value, label, tone }: { value: string; label: string; tone: "reservations" | "occupied" }) => <View style={[styles.metric, tone === "reservations" ? styles.reservationsMetric : styles.occupiedMetric]}><CustomText text={value} variant="action" style={[styles.metricValue, tone === "reservations" ? styles.reservationsValue : styles.occupiedValue]} numberOfLines={1} /><CustomText text={label} variant="caption" style={styles.metricLabel} /></View>;

export default memo(FieldTodayOverview);

const styles = StyleSheet.create({
  content: { gap: theme.spacing.lg }, revenue: { alignItems: "flex-start", gap: theme.spacing.xxs }, revenueValue: { minWidth: 0, flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xs }, currency: { color: theme.colors.white, fontSize: 54, lineHeight: 62 }, amount: { flexShrink: 1, color: theme.colors.white, fontSize: 54, lineHeight: 62 }, decimals: { color: theme.colors.textOnDarkSecondary }, revenueLabel: { color: theme.colors.textOnDarkSecondary },
  metrics: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }, metric: { flex: 1, minWidth: 0, minHeight: 56, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: theme.spacing.xs, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderRadius: theme.radius.pill }, reservationsMetric: { backgroundColor: theme.colors.authSurface }, occupiedMetric: { backgroundColor: theme.colors.reservedSurface }, metricValue: { color: theme.colors.white, textAlign: "center" }, reservationsValue: { color: theme.colors.white }, occupiedValue: { color: theme.colors.iceBlue }, metricLabel: { color: theme.colors.textOnDarkSecondary, textAlign: "center" },
  nextBlock: { gap: theme.spacing.sm, marginTop: theme.spacing.sm }, nextLabel: { color: theme.colors.white }, reservationList: { gap: theme.spacing.sm }, next: { minHeight: 80, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, paddingHorizontal: theme.spacing.lg, borderRadius: theme.radius.extraLarge, backgroundColor: theme.colors.surface }, nextConfirmed: { backgroundColor: theme.colors.reservedSurface }, nextCopy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs }, customer: { color: theme.colors.white }, time: { flexShrink: 0, color: theme.colors.white }, empty: { paddingVertical: theme.spacing.lg, color: theme.colors.textOnDarkSecondary }, pressed: { opacity: 0.72 },
});
