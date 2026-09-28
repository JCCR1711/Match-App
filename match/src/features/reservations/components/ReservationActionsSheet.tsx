import CustomText from "@/src/components/ui/CustomText";
import ReservationSheetNotice from "@/src/features/reservations/components/ReservationSheetNotice";
import ReservationBookingDetails from "@/src/features/reservations/components/ReservationBookingDetails";
import SportsAvatar from "@/src/components/ui/SportsAvatar";
import ReservationSheetActionButton from "@/src/features/reservations/components/ReservationSheetActionButton";
import ReservationSheetActions from "@/src/features/reservations/components/ReservationSheetActions";
import ReservationSheetDetails from "@/src/features/reservations/components/ReservationSheetDetails";
import ReservationSheetFrame from "@/src/features/reservations/components/ReservationSheetFrame";
import ReservationPriceSummary from "@/src/features/reservations/components/ReservationPriceSummary";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import { formatTimeRange } from "@/src/features/reservations/utils/reservationTime";
import { getReservationReferenceLabel } from "@/src/features/reservations/utils/reservationIdentity";
import { getReservationActionErrorMessage } from "@/src/features/reservations/utils/getReservationActionErrorMessage";
import { theme } from "@/src/theme";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, ReduceMotion } from "react-native-reanimated";

interface ReservationActionsSheetProps {
  reservation: ReservationRecord | null;
  canManage?: boolean;
  canCancel?: boolean;
  canCompleteRefund?: boolean;
  readOnlyMessage?: string;
  onClose: () => void;
  onConfirm: (reservationId: string) => Promise<boolean>;
  onCancel: (reservationId: string) => Promise<boolean>;
  onCompleteRefund: (reservationId: string) => Promise<boolean>;
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

const ReservationActionsSheet = ({ reservation, canManage = true, canCancel = canManage, canCompleteRefund = canManage, readOnlyMessage, onClose, onConfirm, onCancel, onCompleteRefund }: ReservationActionsSheetProps) => {
  const [confirmingCancellation, setConfirmingCancellation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeReservationId, setActiveReservationId] = useState(reservation?.id);

  if (activeReservationId !== reservation?.id) {
    setActiveReservationId(reservation?.id);
    setConfirmingCancellation(false);
    setSubmitting(false);
    setErrorMessage(null);
  }

  if (!reservation) return null;
  const confirmed = reservation.status === "confirmed";
  const paidInMatch = reservation.paymentStatus === "paid";
  const manualReservation = reservation.source === "manual";
  const canConfirmManually = reservation.status === "pending" && manualReservation;
  const refundPending = reservation.status === "canceled" && reservation.paymentStatus === "refund_pending";
  const canRequestCancellation = canCancel && reservation.status !== "canceled";
  const hasActions = (canManage && canConfirmManually) || canRequestCancellation || (canCompleteRefund && refundPending);

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    setErrorMessage(null);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      if (!await onConfirm(reservation.id)) setErrorMessage("No pudimos confirmar la reserva.");
    } catch (confirmError) {
      setErrorMessage(getReservationActionErrorMessage(confirmError, "No pudimos confirmar la reserva."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setConfirmingCancellation(false);
    onClose();
  };

  const handleCancelRequest = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setConfirmingCancellation(true);
  };

  const handleCancelConfirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    setErrorMessage(null);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    try {
      if (!await onCancel(reservation.id)) setErrorMessage("No pudimos cancelar la reserva.");
    } catch (cancelError) {
      setErrorMessage(getReservationActionErrorMessage(cancelError, "No pudimos cancelar la reserva."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteRefund = async () => {
    if (submitting) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      if (!await onCompleteRefund(reservation.id)) setErrorMessage("No pudimos registrar la devolución.");
    } catch (refundError) {
      setErrorMessage(getReservationActionErrorMessage(refundError, "No pudimos registrar la devolución."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ReservationSheetFrame
      visible
      title={confirmingCancellation ? "Cancelar reserva" : "Reserva"}
      collapsedHeight={confirmingCancellation ? 610 : confirmed ? 700 : 760}
      tone={confirmingCancellation ? "blocked" : confirmed ? "reserved" : "pending"}
      onClose={handleClose}
      footer={hasActions ? (
        <ReservationSheetActions>
          {confirmingCancellation ? (
            <>
              <ReservationSheetActionButton label={submitting ? "Cancelando..." : "Cancelar reserva"} tone="blocked" onPress={() => void handleCancelConfirm()} disabled={submitting} accessibilityLabel="Confirmar cancelación de reserva" />
              <ReservationSheetActionButton label="Volver" tone="text" onPress={() => setConfirmingCancellation(false)} disabled={submitting} />
            </>
          ) : (
            <>
              {canManage && canConfirmManually ? <ReservationSheetActionButton label={submitting ? "Confirmando..." : "Confirmar reserva"} onPress={() => void handleConfirm()} disabled={submitting} /> : null}
              {canCompleteRefund && refundPending ? <ReservationSheetActionButton label={submitting ? "Registrando..." : "Marcar como devuelto"} onPress={() => void handleCompleteRefund()} disabled={submitting} /> : null}
              {canRequestCancellation ? <ReservationSheetActionButton label="Cancelar reserva" tone={canConfirmManually ? "text" : "blocked"} onPress={handleCancelRequest} disabled={submitting} accessibilityLabel="Cancelar reserva" /> : null}
            </>
          )}
        </ReservationSheetActions>
      ) : undefined}
    >
      {confirmingCancellation ? (
        <Animated.View entering={FadeIn.duration(180).reduceMotion(ReduceMotion.System)} style={styles.cancelConfirmation}>
          <ReservationCustomerSummary reservation={reservation} />
          <CustomText
            text={paidInMatch
              ? "El horario quedará libre. La devolución al jugador quedará pendiente de procesamiento."
              : "La reserva se cancelará y el horario volverá a estar disponible."}
            variant="body"
            style={styles.cancelDescription}
          />
          <ReservationSheetDetails
            items={[
              { label: "Reserva", value: getReservationReferenceLabel(reservation) },
              { label: "Cancha", value: reservation.fieldName },
              { label: "Fecha", value: reservation.dateLabel },
              { label: "Horario", value: formatTimeRange(reservation.startTime, reservation.durationMinutes) },
            ]}
          />
          {errorMessage ? <ReservationSheetNotice message={errorMessage} /> : null}
        </Animated.View>
      ) : (
        <View style={styles.summary}>
          <ReservationCustomerSummary reservation={reservation} />
          <ReservationPriceSummary amount={reservation.amount} />
          {paidInMatch ? <ReservationSheetNotice tone="match" title="Pago confirmado" message="El pago fue realizado en Match." /> : null}
          {manualReservation ? <ReservationSheetNotice tone="local" title="Cobro en sede" message="Esta reserva se cobra directamente en la sede." /> : null}
          {!manualReservation && reservation.paymentStatus === "pending" ? (
            <ReservationSheetNotice tone="match" title="Pago pendiente" message="Match confirmará la reserva cuando se apruebe el pago." />
          ) : null}
          {refundPending ? <ReservationSheetNotice title="Devolución pendiente" message="Registra la devolución cuando el dinero haya sido enviado al jugador." /> : null}
          <ReservationBookingDetails reservation={reservation} />
          {!hasActions ? <ReservationSheetNotice tone="readOnly" message={readOnlyMessage ?? "Tu rol permite consultar esta reserva, pero no modificarla."} /> : null}
          {errorMessage ? <ReservationSheetNotice message={errorMessage} /> : null}
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
  cancelConfirmation: { gap: theme.spacing.lg },
  cancelDescription: { maxWidth: 320, color: theme.colors.textOnDarkSecondary },
});
