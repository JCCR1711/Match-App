import ReservationSheetNotice from "@/src/features/reservations/components/ReservationSheetNotice";
import ReservationSheetActionButton from "@/src/features/reservations/components/ReservationSheetActionButton";
import ReservationSheetActions from "@/src/features/reservations/components/ReservationSheetActions";
import ReservationSheetFrame from "@/src/features/reservations/components/ReservationSheetFrame";
import ReservationSheetDetails from "@/src/features/reservations/components/ReservationSheetDetails";
import ReservationTimeRange from "@/src/features/reservations/components/ReservationTimeRange";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import type { AvailabilityBlock, AvailabilityBlockKind } from "@/src/features/reservations/types/reservation";
import { addMinutesToTime } from "@/src/features/reservations/utils/reservationTime";
import { getReservationActionErrorMessage } from "@/src/features/reservations/utils/getReservationActionErrorMessage";
import { theme } from "@/src/theme";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export type AvailabilityAction =
  | { kind: "available"; startTime: string; endTime: string }
  | { kind: "blocked"; block: AvailabilityBlock };

interface AvailabilityBlockActionsSheetProps {
  action: AvailabilityAction | null;
  dateLabel: string;
  fieldName?: string;
  canCreateReservation?: boolean;
  canManageAvailability?: boolean;
  readOnlyMessage?: string;
  onClose: () => void;
  onCreateReservation: (startTime: string, endTime: string) => void;
  onBlock: (startTime: string, endTime: string, kind: AvailabilityBlockKind) => Promise<boolean>;
  onRelease: (blockId: string) => Promise<boolean>;
}

const AvailabilityBlockActionsSheet = ({ action, dateLabel, fieldName, canCreateReservation = true, canManageAvailability = true, readOnlyMessage, onClose, onCreateReservation, onBlock, onRelease }: AvailabilityBlockActionsSheetProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const actionKey = action?.kind === "blocked"
    ? action.block.id
    : action
      ? `${action.startTime}-${action.endTime}`
      : null;
  const [activeActionKey, setActiveActionKey] = useState(actionKey);

  if (activeActionKey !== actionKey) {
    setActiveActionKey(actionKey);
    setErrorMessage(null);
    setSubmitting(false);
  }

  if (!action) return null;

  const isBlocked = action.kind === "blocked";
  const availableAction = action.kind === "available" ? action : null;
  const blockedAction = action.kind === "blocked" ? action : null;
  const startTime = isBlocked ? action.block.startTime : action.startTime;
  const endTime = isBlocked ? addMinutesToTime(action.block.startTime, action.block.durationMinutes) : action.endTime;
  const blockedStatus = blockedAction?.block.kind === "maintenance" || blockedAction?.block.label.toLocaleLowerCase().includes("mantenimiento") ? "maintenance" : "blocked";
  const sheetTitle = !isBlocked
    ? "Horario disponible"
    : blockedStatus === "maintenance"
      ? "Mantenimiento"
      : "Horario bloqueado";
  const hasFooterActions = isBlocked ? canManageAvailability : canCreateReservation || canManageAvailability;

  const handleReserve = () => {
    if (!availableAction) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCreateReservation(availableAction.startTime, availableAction.endTime);
  };

  const handleBlock = async (kind: AvailabilityBlockKind) => {
    if (!availableAction || submitting) return;
    setSubmitting(true);
    setErrorMessage(null);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    try {
      if (!await onBlock(availableAction.startTime, availableAction.endTime, kind)) {
        setErrorMessage("Este horario ya no está disponible.");
      }
    } catch (blockError) {
      setErrorMessage(getReservationActionErrorMessage(blockError, "Este horario ya no está disponible."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRelease = async () => {
    if (!blockedAction || submitting) return;
    setSubmitting(true);
    setErrorMessage(null);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      if (!await onRelease(blockedAction.block.id)) {
        setErrorMessage("No pudimos liberar este horario.");
      }
    } catch (releaseError) {
      setErrorMessage(getReservationActionErrorMessage(releaseError, "No pudimos liberar este horario."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ReservationSheetFrame
      visible
      title={sheetTitle}
      collapsedHeight={isBlocked ? 560 : 730}
      tone={isBlocked ? blockedStatus : "available"}
      onClose={onClose}
      footer={hasFooterActions ? (
        <ReservationSheetActions>
            {isBlocked ? (
              canManageAvailability ? <ReservationSheetActionButton label={submitting ? "Liberando..." : "Liberar horario"} onPress={() => void handleRelease()} disabled={submitting} /> : null
            ) : (
              <>
                {canCreateReservation ? <ReservationSheetActionButton label="Crear reserva" onPress={handleReserve} disabled={submitting} /> : null}
                {canManageAvailability ? (
                  <View style={styles.secondaryActions}>
                    <ReservationSheetActionButton label={submitting ? "Guardando..." : "Bloquear hora"} tone="blocked" style={styles.secondaryButton} onPress={() => void handleBlock("blocked")} disabled={submitting} accessibilityLabel="Bloquear horario" />
                    <ReservationSheetActionButton label="Mantenimiento" tone="maintenance" style={styles.secondaryButton} onPress={() => void handleBlock("maintenance")} disabled={submitting} accessibilityLabel="Marcar horario en mantenimiento" />
                  </View>
                ) : null}
              </>
            )}
        </ReservationSheetActions>
      ) : undefined}
    >
      <>
      <View style={styles.summary}>
        <View style={styles.timeBlock}>
          <ScheduleStatusLabel status={isBlocked ? blockedStatus : "available"} tone={isBlocked ? "default" : "accent"} />
          <ReservationTimeRange startTime={startTime} endTime={endTime} tone={isBlocked ? blockedStatus : "available"} />
        </View>
        <ReservationSheetDetails
          divided={false}
          items={[
            { label: "Cancha", value: blockedAction?.block.fieldName ?? fieldName ?? "Cancha" },
            { label: "Fecha", value: dateLabel },
          ]}
        />
        {isBlocked && !canManageAvailability ? <ReservationSheetNotice tone="readOnly" message={readOnlyMessage ?? "Tu rol permite consultar este bloqueo, pero no modificarlo."} /> : null}
        {errorMessage ? <ReservationSheetNotice message={errorMessage} /> : null}
      </View>
      </>
    </ReservationSheetFrame>
  );
};

export default AvailabilityBlockActionsSheet;

const styles = StyleSheet.create({
  summary: { gap: theme.spacing.lg },
  timeBlock: { alignItems: "center", gap: theme.spacing.sm },
  secondaryActions: { flexDirection: "row", gap: theme.spacing.sm },
  secondaryButton: { flex: 1, minWidth: 0 },
});
