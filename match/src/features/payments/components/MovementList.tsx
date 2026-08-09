import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import PaymentStatusLabel from "@/src/features/payments/components/PaymentStatusLabel";
import type { FinancialMovement } from "@/src/features/payments/types/businessPayments";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

const MovementList = ({ movements }: { movements: FinancialMovement[] }) => (
  <View style={styles.list}>
    {movements.map((movement) => <MovementCard key={movement.id} movement={movement} />)}
  </View>
);

const MovementCard = ({ movement }: { movement: FinancialMovement }) => (
  <AppSurface style={styles.card}>
    <View style={styles.topRow}>
      <CustomText text={movement.title} variant="body" style={styles.title} numberOfLines={1} />
      <CustomText text={movement.amount} variant="body" style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} />
    </View>
    <View style={styles.bottomRow}>
      <CustomText text={movement.detail} variant="caption" style={styles.detail} numberOfLines={1} />
      <PaymentStatusLabel status={movement.status} />
    </View>
  </AppSurface>
);

export default MovementList;

const styles = StyleSheet.create({
  list: { gap: theme.spacing.lg },
  card: { minHeight: 120, justifyContent: "space-between", padding: theme.spacing.xl, gap: theme.spacing.xl },
  topRow: { flexDirection: "row", alignItems: "flex-start", gap: theme.spacing.md },
  bottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  title: { flex: 1, minWidth: 0, color: theme.colors.white },
  detail: { flex: 1, minWidth: 0, color: theme.colors.authTextSecondary },
  amount: { maxWidth: "36%", flexShrink: 1, color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold, textAlign: "right" },
});
