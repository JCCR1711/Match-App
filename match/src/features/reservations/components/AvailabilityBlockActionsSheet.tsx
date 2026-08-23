import CustomIcon from "@/src/components/ui/CustomIcon";
import ReservationSheetActionButton from "@/src/features/reservations/components/ReservationSheetActionButton";
import ReservationSheetActions from "@/src/features/reservations/components/ReservationSheetActions";
import ReservationSheetFrame from "@/src/features/reservations/components/ReservationSheetFrame";
import ReservationSheetDetails from "@/src/features/reservations/components/ReservationSheetDetails";
import ReservationTimeRange from "@/src/features/reservations/components/ReservationTimeRange";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import type { AvailabilityBlock, AvailabilityBlockKind } from "@/src/features/reservations/types/reservation";
import { addMinutesToTime } from "@/src/features/reservations/utils/reservationTime";
import { theme } from "@/src/theme";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";
import { StyleSheet, View } from "react-native";

export type AvailabilityAction =
  | { kind: "available"; startTime: string; endTime: string }
  | { kind: "blocked"; block: AvailabilityBlock };

interface AvailabilityBlockActionsSheetProps {
  action: AvailabilityAction | null;
  dateLabel: string;
  fieldName?: string;
  onClose: () => void;
  onCreateReservation: (startTime: string, endTime: string) => void;
  onBlock: (startTime: string, kind: AvailabilityBlockKind) => void;
  onRelease: (blockId: string) => void;
}

const AvailabilityBlockActionsSheet = ({ action, dateLabel, fieldName, onClose, onCreateReservation, onBlock, onRelease }: AvailabilityBlockActionsSheetProps) => {
  if (!action) return null;

  const isBlocked = action.kind === "blocked";
  const availableAction = action.kind === "available" ? action : null;
  const blockedAction = action.kind === "blocked" ? action : null;
  const startTime = isBlocked ? action.block.startTime : action.startTime;
  const endTime = isBlocked ? addMinutesToTime(action.block.startTime, action.block.durationMinutes) : action.endTime;
  const blockedStatus = blockedAction?.block.kind === "maintenance" || blockedAction?.block.label.toLocaleLowerCase().includes("mantenimiento") ? "maintenance" : "blocked";

  const handleReserve = () => {
    if (!availableAction) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCreateReservation(availableAction.startTime, availableAction.endTime);
  };

  const handleBlock = (kind: AvailabilityBlockKind) => {
    if (!availableAction) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onBlock(availableAction.startTime, kind);
  };

  const handleRelease = () => {
    if (!blockedAction) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onRelease(blockedAction.block.id);
  };

  return (
    <ReservationSheetFrame
      visible
      title="Horario"
      collapsedHeight={isBlocked ? 560 : 660}
      tone={isBlocked ? blockedStatus : "available"}
      onClose={onClose}
      footer={(
        <ReservationSheetActions>
            {isBlocked ? (
              <ReservationSheetActionButton label="Liberar horario" onPress={handleRelease} />
            ) : (
              <>
                <ReservationSheetActionButton label="Crear reserva" trailingIcon={<CustomIcon icon={CheckmarkCircle02Icon} color={theme.colors.black} size={22} strokeWidth={2.4} />} onPress={handleReserve} />
                <View style={styles.secondaryActions}>
                  <ReservationSheetActionButton label="Bloquear" tone="secondary" style={styles.secondaryButton} onPress={() => handleBlock("blocked")} accessibilityLabel="Bloquear horario" />
                  <ReservationSheetActionButton label="Mantenimiento" tone="secondary" style={styles.secondaryButton} onPress={() => handleBlock("maintenance")} accessibilityLabel="Marcar horario en mantenimiento" />
                </View>
              </>
            )}
        </ReservationSheetActions>
      )}
    >
      <>
      <View style={styles.summary}>
        <View style={styles.timeBlock}>
          <ScheduleStatusLabel status={isBlocked ? blockedStatus : "available"} />
          <ReservationTimeRange startTime={startTime} endTime={endTime} tone={isBlocked ? blockedStatus : "available"} />
        </View>
        <ReservationSheetDetails
          divided={false}
          items={[
            { label: "Cancha", value: blockedAction?.block.fieldName ?? fieldName ?? "Cancha" },
            { label: "Fecha", value: dateLabel },
          ]}
        />
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
  secondaryButton: { flex: 1, paddingHorizontal: theme.spacing.sm },
});
