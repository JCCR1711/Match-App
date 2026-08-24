import AppSection from "@/src/components/ui/AppSection";
import BusinessReservationPreviewCard from "@/src/features/reservations/components/BusinessReservationPreviewCard";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import { isActiveReservation } from "@/src/features/reservations/utils/isActiveReservation";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

const TodayAgendaPreview = ({ reservations, onOpenAll, onOpenReservation }: { reservations: ReservationRecord[]; onOpenAll: () => void; onOpenReservation: (reservation: ReservationRecord) => void }) => {
  const items = reservations
    .filter(isActiveReservation)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 3);

  if (items.length === 0) return null;

  return (
    <AppSection title="Agenda de hoy" actionLabel="Ver agenda" onAction={onOpenAll}>
      <View style={styles.list}>
        {items.map((reservation) => <BusinessReservationPreviewCard key={reservation.id} reservation={reservation} onPress={() => onOpenReservation(reservation)} />)}
      </View>
    </AppSection>
  );
};

export default TodayAgendaPreview;

const styles = StyleSheet.create({
  list: { gap: theme.spacing.sm },
});
