import CustomText from "@/src/components/ui/CustomText";
import SportsAvatar from "@/src/components/ui/SportsAvatar";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import type { FinancialMovement } from "@/src/features/payments/types/businessPayments";
import { theme } from "@/src/theme";
import { formatMoneyAmount } from "@/src/utils/formatMoney";
import { StyleSheet, View } from "react-native";

const MovementList = ({ movements }: { movements: FinancialMovement[] }) => (
  <View style={styles.list}>
    {movements.map((movement) => <MovementRow key={movement.id} movement={movement} />)}
  </View>
);

const MovementRow = ({ movement }: { movement: FinancialMovement }) => {
  const isConfirmed = movement.reservationStatus === "confirmed";

  return (
    <View style={[styles.card, isConfirmed && styles.confirmedCard]}>
      <SportsAvatar seed={movement.customerName} size={44} />
      <View style={styles.content}>
        <View style={styles.heading}>
          <CustomText text={movement.customerName} variant="bodyStrong" style={styles.name} numberOfLines={1} ellipsizeMode="tail" />
          <ScheduleStatusLabel status={movement.reservationStatus} />
        </View>
        <View style={styles.footer}>
          <CustomText text={movement.dateLabel} variant="caption" style={styles.date} numberOfLines={1} />
          <View style={styles.amountRow}>
            <CustomText text="S/" variant="label" style={styles.currency} />
            <CustomText text={formatMoneyAmount(movement.amount)} variant="actionSecondary" style={styles.amount} numberOfLines={1} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MovementList;

const styles = StyleSheet.create({
  list: { gap: theme.spacing.sm },
  card: { minHeight: 96, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, padding: theme.spacing.md, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.authSurface },
  confirmedCard: { backgroundColor: theme.colors.businessBlueSurface },
  content: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.sm },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.sm },
  name: { flex: 1, minWidth: 0, color: theme.colors.white },
  date: { color: theme.colors.textOnDarkSecondary },
  amountRow: { flexShrink: 0, flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xxs },
  currency: { color: theme.colors.textOnDarkSecondary },
  amount: { color: theme.colors.white, textAlign: "right" },
});
