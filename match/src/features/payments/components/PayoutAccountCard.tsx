import AppCardArrow from "@/src/components/ui/AppCardArrow";
import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import FinancialPremiumSurface from "@/src/features/payments/components/FinancialPremiumSurface";
import PayoutAccountStatusLabel from "@/src/features/payments/components/PayoutAccountStatusLabel";
import { getFinancialInstitution } from "@/src/features/payments/data/financialInstitutions";
import type { PayoutAccount } from "@/src/features/payments/types/businessPayments";
import { formatSettlementAccount } from "@/src/features/payments/utils/formatSettlementAccount";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

interface PayoutAccountCardProps {
  account: PayoutAccount;
  presentation?: "compact" | "full";
  onPress?: () => void;
}

const PayoutAccountCard = ({ account, presentation = "full", onPress }: PayoutAccountCardProps) => {
  const compact = presentation === "compact";
  const institution = getFinancialInstitution(account.institutionId);
  const institutionName = institution?.shortName ?? account.institutionName;

  return (
    <AppSurface
      variant="transparent"
      onPress={onPress}
      accessibilityLabel={`${onPress ? "Abrir" : ""} cuenta de depósito ${institutionName}, terminada en ${account.accountLastDigits}`.trim()}
      style={[styles.surface, compact ? styles.compactSurface : styles.fullSurface]}
    >
      <FinancialPremiumSurface tone="primary" style={[styles.card, compact ? styles.compactCard : styles.fullCard]}>
        <View style={styles.header}>
          <CustomText text={institutionName} variant="subtitle" style={styles.bank} numberOfLines={1} />
          <PayoutAccountStatusLabel status={account.status} />
        </View>
        <CustomText
          text={formatSettlementAccount(account.accountLastDigits)}
          variant="subtitle"
          style={[styles.account, compact ? styles.compactAccount : styles.fullAccount]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
        />
        <View style={styles.footer}>
          <CustomText text={account.holderName} variant="caption" style={styles.holder} numberOfLines={1} />
          {onPress ? (
            <AppCardArrow backgroundColor={theme.colors.authPrimary} color={theme.colors.black} style={styles.arrow} />
          ) : (
            <CustomText text="PEN" variant="label" style={styles.currency} />
          )}
        </View>
      </FinancialPremiumSurface>
    </AppSurface>
  );
};

export default PayoutAccountCard;

const styles = StyleSheet.create({
  surface: { borderRadius: theme.radius.card },
  compactSurface: { minHeight: 144 },
  fullSurface: { minHeight: 208 },
  card: { justifyContent: "space-between" },
  compactCard: { minHeight: 144, gap: theme.spacing.md, padding: theme.spacing.lg },
  fullCard: { minHeight: 208, gap: theme.spacing.xl, padding: theme.spacing.xl },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  bank: { flex: 1, minWidth: 0, color: theme.colors.white },
  account: { color: theme.colors.authPrimary },
  compactAccount: { fontSize: 18, lineHeight: 24 },
  fullAccount: { fontSize: 17, lineHeight: 23 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  holder: { flex: 1, minWidth: 0, color: theme.colors.textOnMediaSecondary },
  currency: { color: theme.colors.authTextSecondary, letterSpacing: 0.8 },
  arrow: { width: 42, height: 42 },
});
