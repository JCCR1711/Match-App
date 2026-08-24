import CustomText from "@/src/components/ui/CustomText";
import SportsAvatar from "@/src/components/ui/SportsAvatar";
import SettlementStatusLabel from "@/src/features/payments/components/SettlementStatusLabel";
import type { FinancialMovement } from "@/src/features/payments/types/businessPayments";
import { theme } from "@/src/theme";
import { formatMoneyAmount } from "@/src/utils/formatMoney";
import { Pressable, StyleSheet, View } from "react-native";

const MovementList = ({ movements, onPressMovement }: { movements: FinancialMovement[]; onPressMovement?: (movement: FinancialMovement) => void }) => {
  if (movements.length === 0) {
    return <CustomText text="Aun no hay movimientos" variant="body" style={styles.empty} />;
  }

  return (
    <View style={styles.list}>
      {movements.map((movement) => <MovementRow key={movement.id} movement={movement} onPress={onPressMovement && movement.reservationId ? () => onPressMovement(movement) : undefined} />)}
    </View>
  );
};

const MovementRow = ({ movement, onPress }: { movement: FinancialMovement; onPress?: () => void }) => {
  const isPaid = movement.status === "paid";

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={onPress ? `Abrir reserva de ${movement.customerName}` : undefined}
      style={({ pressed }) => [styles.card, isPaid && styles.paidCard, pressed && styles.pressed]}
    >
      <SportsAvatar seed={movement.customerName} size={44} />
      <View style={styles.content}>
        <View style={styles.heading}>
          <CustomText text={movement.customerName} variant="bodyStrong" style={styles.name} numberOfLines={1} ellipsizeMode="tail" />
          <SettlementStatusLabel status={movement.status} context="movement" />
        </View>
        <View style={styles.footer}>
          <CustomText text={movement.dateLabel} variant="caption" style={styles.date} numberOfLines={1} />
          <View style={styles.amountRow}>
            <CustomText text="S/" variant="label" style={styles.currency} />
            <CustomText text={formatMoneyAmount(movement.amount)} variant="actionSecondary" style={styles.amount} numberOfLines={1} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default MovementList;

const styles = StyleSheet.create({
  list: { gap: theme.spacing.sm },
  card: { minHeight: 96, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, padding: theme.spacing.md, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.authSurface },
  paidCard: { backgroundColor: theme.colors.businessBlueSurface },
  content: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.sm },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.sm },
  name: { flex: 1, minWidth: 0, color: theme.colors.white },
  date: { color: theme.colors.textOnDarkSecondary },
  amountRow: { flexShrink: 0, flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xxs },
  currency: { color: theme.colors.textOnDarkSecondary },
  amount: { color: theme.colors.white, textAlign: "right" },
  pressed: { opacity: 0.76 },
  empty: { color: theme.colors.authTextSecondary },
});
