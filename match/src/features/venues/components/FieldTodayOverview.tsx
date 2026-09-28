import AppSection from "@/src/components/ui/AppSection";
import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import SportsAvatar from "@/src/components/ui/SportsAvatar";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import ReservationSourceBadge from "@/src/features/reservations/components/ReservationSourceBadge";
import type { AvailabilityBlock, ReservationRecord } from "@/src/features/reservations/types/reservation";
import { getReservationCustomerLabel } from "@/src/features/reservations/utils/reservationIdentity";
import { toDateKey } from "@/src/features/reservations/utils/reservationDate";
import FieldConfirmedRevenueCard from "@/src/features/venues/components/FieldConfirmedRevenueCard";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

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
  const todayKey = toDateKey(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const todayReservations = ordered.filter((reservation) => reservation.dateKey === todayKey);
  const todayBlocks = blocks.filter((block) => block.dateKey === todayKey);
  const upcomingReservations = [...reservations]
    .filter((reservation) =>
      reservation.dateKey > todayKey ||
      (reservation.dateKey === todayKey && getTimeMinutes(reservation.startTime) + reservation.durationMinutes > currentMinutes),
    )
    .sort((first, second) => `${first.dateKey}T${first.startTime}`.localeCompare(`${second.dateKey}T${second.startTime}`))
    .slice(0, 3);
  const visibleReservations = upcomingReservations;
  const confirmedRevenue = todayReservations.filter((item) => item.status === "confirmed").reduce((total, item) => total + item.amount, 0);
  const occupiedMinutes = [...todayReservations, ...todayBlocks].reduce((total, item) => total + item.durationMinutes, 0);

  return (
    <AppSection title="Hoy" actionLabel="Ver agenda" onAction={onOpenAgenda}>
      <View style={styles.content}>
        <FieldConfirmedRevenueCard amount={confirmedRevenue} />
        <View style={styles.metrics}>
          <Metric value={String(todayReservations.length)} label={todayReservations.length === 1 ? "Reserva" : "Reservas"} tone="reservations" />
          <Metric value={formatOccupiedTime(occupiedMinutes)} label="Ocupadas" tone="occupied" />
        </View>
        {visibleReservations.length > 0 ? (
          <View style={styles.nextBlock}>
            <CustomText text="Próximas reservas" variant="bodyStrong" style={styles.nextLabel} />
            <View style={styles.reservationList}>
              {visibleReservations.map((reservation) => (
                <ReservationPreview key={reservation.id} reservation={reservation} onPress={() => onOpenReservation(reservation)} />
              ))}
            </View>
          </View>
        ) : <CustomText text="Sin próximas reservas" variant="body" style={styles.empty} />}
      </View>
    </AppSection>
  );
};

const ReservationPreview = ({ reservation, onPress }: { reservation: ReservationRecord; onPress: () => void }) => (
  <AppSurface variant="transparent" onPress={onPress} accessibilityLabel={`Abrir reserva de ${getReservationCustomerLabel(reservation)}`} style={[styles.next, reservation.status === "confirmed" && styles.nextConfirmed]}>
    <SportsAvatar seed={reservation.customerName} size={38} />
    <View style={styles.nextCopy}>
      <CustomText text={getReservationCustomerLabel(reservation)} variant="bodyStrong" style={styles.customer} numberOfLines={1} />
      <View style={styles.reservationMeta}>
        <ScheduleStatusLabel status={reservation.status} emphasis="micro" />
        <ReservationSourceBadge source={reservation.source} />
      </View>
    </View>
    <View style={styles.reservationTime}>
      <CustomText text={reservation.startTime} variant="actionSecondary" style={styles.time} />
      <CustomText text={reservation.dateKey === toDateKey(new Date()) ? "Hoy" : reservation.dateLabel.split(",")[0]} variant="label" style={styles.date} numberOfLines={1} />
    </View>
  </AppSurface>
);

const Metric = ({ value, label, tone }: { value: string; label: string; tone: "reservations" | "occupied" }) => <View style={[styles.metric, tone === "reservations" ? styles.reservationsMetric : styles.occupiedMetric]}><CustomText text={value} variant="action" style={[styles.metricValue, tone === "reservations" ? styles.reservationsValue : styles.occupiedValue]} numberOfLines={1} /><CustomText text={label} variant="caption" style={styles.metricLabel} /></View>;

export default memo(FieldTodayOverview);

const styles = StyleSheet.create({
  content: { gap: theme.spacing.lg },
  metrics: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }, metric: { flex: 1, minWidth: 0, minHeight: 56, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: theme.spacing.xs, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderRadius: theme.radius.pill }, reservationsMetric: { backgroundColor: theme.colors.authSurface }, occupiedMetric: { backgroundColor: theme.colors.reservedSurface }, metricValue: { color: theme.colors.white, textAlign: "center" }, reservationsValue: { color: theme.colors.white }, occupiedValue: { color: theme.colors.iceBlue }, metricLabel: { color: theme.colors.textOnDarkSecondary, textAlign: "center" },
  nextBlock: { gap: theme.spacing.sm, marginTop: theme.spacing.sm }, nextLabel: { color: theme.colors.white }, reservationList: { gap: theme.spacing.sm }, next: { minHeight: 80, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderRadius: theme.radius.extraLarge, backgroundColor: theme.colors.surface }, nextConfirmed: { backgroundColor: theme.colors.reservedSurface }, nextCopy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs }, reservationMeta: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: theme.spacing.xs }, customer: { color: theme.colors.white }, reservationTime: { flexShrink: 0, maxWidth: 72, alignItems: "flex-end", gap: 1 }, time: { color: theme.colors.white }, date: { color: theme.colors.textOnDarkSecondary }, empty: { paddingVertical: theme.spacing.lg, color: theme.colors.textOnDarkSecondary },
});
