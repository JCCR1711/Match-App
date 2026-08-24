import CustomText from "@/src/components/ui/CustomText";
import ReservationBookingDetails from "@/src/features/reservations/components/ReservationBookingDetails";
import SportsAvatar from "@/src/components/ui/SportsAvatar";
import ReservationSheetActionButton from "@/src/features/reservations/components/ReservationSheetActionButton";
import ReservationSheetActions from "@/src/features/reservations/components/ReservationSheetActions";
import ReservationSheetDetails from "@/src/features/reservations/components/ReservationSheetDetails";
import ReservationSheetFrame from "@/src/features/reservations/components/ReservationSheetFrame";
import ReservationSheetHeroValue from "@/src/features/reservations/components/ReservationSheetHeroValue";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import { formatTimeRange } from "@/src/features/reservations/utils/reservationTime";
import { getReservationReferenceLabel } from "@/src/features/reservations/utils/reservationIdentity";
import { theme } from "@/src/theme";
import { formatMoneyAmount } from "@/src/utils/formatMoney";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, ReduceMotion } from "react-native-reanimated";

interface ReservationActionsSheetProps {
  reservation: ReservationRecord | null;
  onClose: () => void;
  onConfirm: (reservationId: string) => void;
  onCancel: (reservationId: string) => void;
}

const ReservationCustomerSummary = ({ reservation }: { reservation: ReservationRecord }) => (
  <View style={styles.customer}>
    <SportsAvatar seed={reservation.customerName} />
    <View style={styles.customerCopy}>
      <CustomText text={reservation.customerName} variant="sectionHeading" style={styles.title} numberOfLines={2} ellipsizeMode="tail" />
      <View style={styles.statusRow}>
        <ScheduleStatusLabel status={reservation.status} />
        <CustomText text={getReservationReferenceLabel(reservation)} variant="label" style={styles.reference} />
      </View>
    </View>
  </View>
);

const ReservationActionsSheet = ({ reservation, onClose, onConfirm, onCancel }: ReservationActionsSheetProps) => {
  const [confirmingCancellation, setConfirmingCancellation] = useState(false);

  useEffect(() => {
    setConfirmingCancellation(false);
  }, [reservation?.id]);

  if (!reservation) return null;
  const confirmed = reservation.status === "confirmed";

  const handleConfirm = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onConfirm(reservation.id);
  };

  const handleClose = () => {
    setConfirmingCancellation(false);
    onClose();
  };

  const handleCancelRequest = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setConfirmingCancellation(true);
  };

  const handleCancelConfirm = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setConfirmingCancellation(false);
    onCancel(reservation.id);
  };

  return (
    <ReservationSheetFrame
      visible
      title={confirmingCancellation ? "Cancelar reserva" : "Reserva"}
      collapsedHeight={confirmingCancellation ? 610 : confirmed ? 700 : 760}
      tone={confirmingCancellation ? "blocked" : confirmed ? "reserved" : "pending"}
      onClose={handleClose}
      footer={(
        <ReservationSheetActions>
          {confirmingCancellation ? (
            <>
              <ReservationSheetActionButton label="Volver" tone="secondary" onPress={() => setConfirmingCancellation(false)} />
              <ReservationSheetActionButton label="Cancelar reserva" tone="destructive" onPress={handleCancelConfirm} accessibilityLabel="Confirmar cancelación de reserva" />
            </>
          ) : (
            <>
              {reservation.status === "pending" ? <ReservationSheetActionButton label="Confirmar" onPress={handleConfirm} /> : null}
              <ReservationSheetActionButton label="Cancelar reserva" tone={confirmed ? "secondary" : "destructive"} onPress={handleCancelRequest} accessibilityLabel="Cancelar reserva" />
            </>
          )}
        </ReservationSheetActions>
      )}
    >
      {confirmingCancellation ? (
        <Animated.View entering={FadeIn.duration(180).reduceMotion(ReduceMotion.System)} style={styles.cancelConfirmation}>
          <ReservationCustomerSummary reservation={reservation} />
          <CustomText text="El horario quedará disponible nuevamente." variant="body" style={styles.cancelDescription} />
          <ReservationSheetDetails
            items={[
              { label: "Reserva", value: getReservationReferenceLabel(reservation) },
              { label: "Cancha", value: reservation.fieldName },
              { label: "Fecha", value: reservation.dateLabel },
              { label: "Horario", value: formatTimeRange(reservation.startTime, reservation.durationMinutes) },
            ]}
          />
        </Animated.View>
      ) : (
        <View style={styles.summary}>
          <ReservationCustomerSummary reservation={reservation} />
          <View style={styles.amount}>
            <CustomText text="Total" variant="caption" style={styles.amountLabel} />
            <ReservationSheetHeroValue value={formatMoneyAmount(reservation.amount)} prefix="S/" accessibilityLabel={`Precio S/ ${formatMoneyAmount(reservation.amount)}`} />
          </View>
          <ReservationBookingDetails reservation={reservation} />
        </View>
      )}
    </ReservationSheetFrame>
  );
};

export default ReservationActionsSheet;

const styles = StyleSheet.create({
  summary: { gap: theme.spacing.lg },
  customer: { flexDirection: "row", alignItems: "center", gap: theme.spacing.md },
  customerCopy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  statusRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  reference: { color: theme.colors.textOnDarkSecondary },
  title: { color: theme.colors.white },
  amount: { gap: theme.spacing.xxs },
  amountLabel: { color: theme.colors.textOnDarkSecondary },
  cancelConfirmation: { gap: theme.spacing.lg },
  cancelDescription: { maxWidth: 320, color: theme.colors.textOnDarkSecondary },
});
