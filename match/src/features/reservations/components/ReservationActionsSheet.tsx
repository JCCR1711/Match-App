import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import ReservationBookingDetails from "@/src/features/reservations/components/ReservationBookingDetails";
import SportsAvatar from "@/src/components/ui/SportsAvatar";
import ReservationSheetActionButton from "@/src/features/reservations/components/ReservationSheetActionButton";
import ReservationSheetActions from "@/src/features/reservations/components/ReservationSheetActions";
import ReservationSheetFrame from "@/src/features/reservations/components/ReservationSheetFrame";
import ReservationSheetHeroValue from "@/src/features/reservations/components/ReservationSheetHeroValue";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import type { ReservationRecord } from "@/src/features/reservations/types/reservation";
import { theme } from "@/src/theme";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";
import { Alert, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown, ReduceMotion } from "react-native-reanimated";

interface ReservationActionsSheetProps {
  reservation: ReservationRecord | null;
  onClose: () => void;
  onConfirm: (reservationId: string) => void;
  onCancel: (reservationId: string) => void;
}

const ACTIONS_ENTERING = FadeInDown.duration(220).delay(85).reduceMotion(ReduceMotion.System);
const ACTIONS_EXITING = FadeOutDown.duration(120).reduceMotion(ReduceMotion.System);

const ReservationActionsSheet = ({ reservation, onClose, onConfirm, onCancel }: ReservationActionsSheetProps) => {
  if (!reservation) return null;
  const confirmed = reservation.status === "confirmed";

  const handleConfirm = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onConfirm(reservation.id);
  };

  const handleCancel = () => {
    Alert.alert("Cancelar reserva", `¿Deseas cancelar la reserva de ${reservation.customerName}?`, [
      { text: "Volver", style: "cancel" },
      {
        text: "Cancelar reserva",
        style: "destructive",
        onPress: () => {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          onCancel(reservation.id);
        },
      },
    ]);
  };

  return (
    <ReservationSheetFrame
      visible
      title="Reserva"
      expandable
      collapsedHeight={380}
      tone={confirmed ? "reserved" : "default"}
      onClose={onClose}
      footer={(expanded) => expanded ? (
        <Animated.View entering={ACTIONS_ENTERING} exiting={ACTIONS_EXITING}>
          <ReservationSheetActions>
            {reservation.status === "pending" ? <ReservationSheetActionButton label="Confirmar" trailingIcon={<CustomIcon icon={CheckmarkCircle02Icon} color={theme.colors.black} size={22} strokeWidth={2.4} />} onPress={handleConfirm} /> : null}
            <ReservationSheetActionButton label="Cancelar reserva" tone={confirmed ? "primary" : "destructive"} onPress={handleCancel} accessibilityLabel="Cancelar reserva" />
          </ReservationSheetActions>
        </Animated.View>
      ) : null}
    >
      {(expanded) => (
        <>
          <View style={styles.summary}>
            <View style={styles.customer}>
              <SportsAvatar seed={reservation.customerName} />
              <CustomText text={reservation.customerName} variant="sectionHeading" style={styles.title} numberOfLines={1} />
              <ScheduleStatusLabel status={reservation.status} />
            </View>
            <View style={styles.amount}>
              <CustomText text="Total" variant="caption" style={styles.amountLabel} />
              <ReservationSheetHeroValue value={String(reservation.amount)} prefix="S/" accessibilityLabel={`Precio S/ ${reservation.amount}`} />
            </View>
            <ReservationBookingDetails reservation={reservation} expanded={expanded} />
          </View>
        </>
      )}
    </ReservationSheetFrame>
  );
};

export default ReservationActionsSheet;

const styles = StyleSheet.create({
  summary: { gap: theme.spacing.lg },
  customer: { flexDirection: "row", alignItems: "center", gap: theme.spacing.md },
  title: { flex: 1, minWidth: 0, color: theme.colors.white },
  amount: { gap: theme.spacing.xxs },
  amountLabel: { color: theme.colors.textOnDarkSecondary },
});
