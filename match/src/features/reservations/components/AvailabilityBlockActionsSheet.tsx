import AppTextField from "@/src/components/ui/AppTextField";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import ReservationSheetActionButton from "@/src/features/reservations/components/ReservationSheetActionButton";
import ReservationSheetActions from "@/src/features/reservations/components/ReservationSheetActions";
import ReservationSheetFrame from "@/src/features/reservations/components/ReservationSheetFrame";
import ReservationSheetDetails from "@/src/features/reservations/components/ReservationSheetDetails";
import ReservationSheetHeroValue from "@/src/features/reservations/components/ReservationSheetHeroValue";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import type { AvailabilityBlock } from "@/src/features/reservations/types/reservation";
import { theme } from "@/src/theme";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown, ReduceMotion } from "react-native-reanimated";

export type AvailabilityAction =
  | { kind: "available"; startTime: string; endTime: string }
  | { kind: "blocked"; block: AvailabilityBlock };

interface AvailabilityBlockActionsSheetProps {
  action: AvailabilityAction | null;
  onClose: () => void;
  onReserve: (startTime: string, customerName: string) => void;
  onBlock: (startTime: string) => void;
  onRelease: (blockId: string) => void;
}

const ACTIONS_ENTERING = FadeInDown.duration(220).delay(45).reduceMotion(ReduceMotion.System);
const ACTIONS_EXITING = FadeOutDown.duration(140).reduceMotion(ReduceMotion.System);

const addMinutes = (time: string, minutesToAdd: number) => {
  const [hour, minute] = time.split(":").map(Number);
  const totalMinutes = hour * 60 + minute + minutesToAdd;
  return `${String(Math.floor(totalMinutes / 60) % 24).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
};

const AvailabilityBlockActionsSheet = ({ action, onClose, onReserve, onBlock, onRelease }: AvailabilityBlockActionsSheetProps) => {
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    setCustomerName("");
  }, [action]);

  if (!action) return null;

  const isBlocked = action.kind === "blocked";
  const availableAction = action.kind === "available" ? action : null;
  const blockedAction = action.kind === "blocked" ? action : null;
  const startTime = isBlocked ? action.block.startTime : action.startTime;
  const endTime = isBlocked ? addMinutes(action.block.startTime, action.block.durationMinutes) : action.endTime;

  const handleReserve = () => {
    if (!availableAction || !customerName.trim()) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onReserve(availableAction.startTime, customerName.trim());
  };

  const handleBlock = () => {
    if (!availableAction) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onBlock(availableAction.startTime);
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
      expandable
      collapsedHeight={340}
      tone={isBlocked ? "blocked" : "available"}
      onClose={onClose}
      footer={(expanded) => !expanded ? null : (
        <Animated.View entering={ACTIONS_ENTERING} exiting={ACTIONS_EXITING}>
          <ReservationSheetActions>
            {isBlocked ? (
              <ReservationSheetActionButton label="Liberar horario" onPress={handleRelease} />
            ) : (
              <>
                <ReservationSheetActionButton label="Crear reserva" trailingIcon={<CustomIcon icon={CheckmarkCircle02Icon} color={theme.colors.black} size={22} strokeWidth={2.4} />} disabled={customerName.trim().length === 0 || !availableAction} onPress={handleReserve} />
                <ReservationSheetActionButton label="Bloquear horario" tone="secondary" onPress={handleBlock} accessibilityLabel="Bloquear horario" />
              </>
            )}
          </ReservationSheetActions>
        </Animated.View>
      )}
    >
      {(expanded) => (
      <>
      <View style={styles.summary}>
        <View style={styles.timeBlock}>
          <ScheduleStatusLabel status={isBlocked ? "blocked" : "available"} />
          <ReservationSheetHeroValue value={startTime} align="center" accessibilityLabel={`Horario desde las ${startTime}`} />
        </View>
        <View style={styles.endTime}>
          <CustomText text="Termina" variant="caption" style={styles.endLabel} />
          <CustomText text={endTime} variant="sectionHeading" style={styles.endValue} />
        </View>
        {blockedAction ? <ReservationSheetDetails divided={false} items={[{ label: "Cancha", value: blockedAction.block.fieldName }]} /> : null}
      </View>
        {expanded && availableAction ? (
          <Animated.View entering={ACTIONS_ENTERING} exiting={ACTIONS_EXITING} style={styles.form}>
            <AppTextField
              label="Cliente"
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Nombre del cliente"
              autoFocus
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleReserve}
              accessibilityLabel="Nombre del cliente"
            />
          </Animated.View>
        ) : null}
      </>
      )}
    </ReservationSheetFrame>
  );
};

export default AvailabilityBlockActionsSheet;

const styles = StyleSheet.create({
  summary: { gap: theme.spacing.lg },
  timeBlock: { alignItems: "center", gap: theme.spacing.sm },
  endTime: { flexDirection: "row", alignItems: "baseline", justifyContent: "center", gap: theme.spacing.sm, paddingTop: theme.spacing.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.dividerOnDark },
  endLabel: { color: theme.colors.textOnDarkSecondary },
  endValue: { color: theme.colors.white },
  form: { paddingTop: theme.spacing.sm },
});
