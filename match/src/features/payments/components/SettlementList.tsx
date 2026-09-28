import AppSurface from "@/src/components/ui/AppSurface";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import SettlementStatusLabel from "@/src/features/payments/components/SettlementStatusLabel";
import type { Settlement } from "@/src/features/payments/types/businessPayments";
import { formatSettlementAccount } from "@/src/features/payments/utils/formatSettlementAccount";
import { theme } from "@/src/theme";
import { formatSoles } from "@/src/utils/formatMoney";
import { CreditCardIcon } from "@hugeicons/core-free-icons";
import { StyleSheet, View } from "react-native";

const SettlementList = ({ settlements, onPressSettlement }: { settlements: Settlement[]; onPressSettlement?: (settlement: Settlement) => void }) => {
  if (settlements.length === 0) {
    return <CustomText text="Aun no hay liquidaciones" variant="body" style={styles.empty} />;
  }

  return (
    <View style={styles.list}>
      {settlements.map((settlement) => (
      <AppSurface key={settlement.id} variant="transparent" onPress={onPressSettlement ? () => onPressSettlement(settlement) : undefined} disabled={!onPressSettlement} accessibilityLabel={onPressSettlement ? `Ver liquidacion de ${settlement.period}` : undefined} style={[styles.card, settlement.status === "deposited" && styles.paidCard]}>
        <View style={styles.accountIcon}>
          <CustomIcon icon={CreditCardIcon} color={theme.colors.iceBlue} size={22} strokeWidth={2.25} />
        </View>
        <View style={styles.content}>
          <View style={styles.heading}>
            <CustomText text={settlement.period} variant="bodyStrong" style={styles.period} numberOfLines={1} />
            <CustomText text={formatSoles(settlement.netAmount)} variant="actionSecondary" style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} />
          </View>
          <View style={styles.footer}>
            <CustomText text={`${settlement.reservationCount} reservas · ${formatSettlementAccount(settlement.accountLastDigits)}`} accessibilityLabel={`${settlement.reservationCount} reservas. Cuenta terminada en ${settlement.accountLastDigits}`} variant="caption" style={styles.account} numberOfLines={1} />
            <SettlementStatusLabel status={settlement.status} />
          </View>
        </View>
      </AppSurface>
      ))}
    </View>
  );
};

export default SettlementList;

const styles = StyleSheet.create({
  list: { gap: theme.spacing.sm },
  card: { minHeight: 100, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, padding: theme.spacing.md, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.authSurface },
  paidCard: { backgroundColor: theme.colors.businessBlueSurface },
  accountIcon: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.standard, backgroundColor: theme.colors.businessBlueSurface },
  content: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.sm },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.sm },
  period: { flex: 1, minWidth: 0, color: theme.colors.white },
  amount: { flexShrink: 0, color: theme.colors.white, textAlign: "right" },
  account: { flex: 1, minWidth: 0, color: theme.colors.textOnDarkSecondary },
  empty: { color: theme.colors.authTextSecondary },
});
