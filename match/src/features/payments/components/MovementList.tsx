import CustomText from "@/src/components/ui/CustomText";
import PaymentStatusLabel from "@/src/features/payments/components/PaymentStatusLabel";
import type { FinancialMovement } from "@/src/features/payments/types/businessPayments";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

const MovementList = ({ movements }: { movements: FinancialMovement[] }) => (
  <View style={styles.list}>
    {movements.map((movement, index) => <MovementRow key={movement.id} movement={movement} isLast={index === movements.length - 1} />)}
  </View>
);

const MovementRow = ({ movement, isLast }: { movement: FinancialMovement; isLast: boolean }) => (
  <View style={[styles.row, !isLast && styles.rowSeparator]}>
    <View style={styles.topRow}>
      <CustomText text={movement.title} variant="body" style={styles.title} numberOfLines={1} />
      <CustomText text={movement.amount} variant="body" style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} />
    </View>
    <View style={styles.bottomRow}>
      <CustomText text={movement.detail} variant="caption" style={styles.detail} numberOfLines={1} />
      <PaymentStatusLabel status={movement.status} />
    </View>
  </View>
);

export default MovementList;

const styles = StyleSheet.create({
  list: { gap: 0 },
  row: { minHeight: 96, justifyContent: "center", paddingVertical: theme.spacing.lg, gap: theme.spacing.md },
  rowSeparator: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.dividerOnDark },
  topRow: { flexDirection: "row", alignItems: "flex-start", gap: theme.spacing.md },
  bottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  title: { flex: 1, minWidth: 0, color: theme.colors.white },
  detail: { flex: 1, minWidth: 0, color: theme.colors.authTextSecondary },
  amount: { maxWidth: "36%", flexShrink: 1, color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold, textAlign: "right" },
});
