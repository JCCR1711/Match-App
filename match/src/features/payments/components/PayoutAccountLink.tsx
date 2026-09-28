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

const PayoutAccountLink = ({ account, onPress }: { account: PayoutAccount; onPress: () => void }) => {
  const institution = getFinancialInstitution(account.institutionId);
  const institutionName = institution?.shortName ?? account.institutionName;

  return (
    <AppSurface
      variant="transparent"
      onPress={onPress}
      accessibilityLabel={`Abrir cuenta de depósito ${institutionName}, terminada en ${account.accountLastDigits}`}
      style={styles.surface}
    >
      <FinancialPremiumSurface tone="secondary" style={styles.card}>
        <View style={styles.header}>
          <CustomText text={institutionName} variant="subtitle" style={styles.bank} numberOfLines={1} />
          <PayoutAccountStatusLabel status={account.status} />
        </View>
        <View style={styles.footer}>
          <CustomText
            text={formatSettlementAccount(account.accountLastDigits)}
            variant="caption"
            style={styles.account}
            numberOfLines={1}
          />
          <AppCardArrow
            backgroundColor={theme.colors.surfaceOnDarkSubtle}
            color={theme.colors.authPrimary}
            style={styles.arrow}
          />
        </View>
      </FinancialPremiumSurface>
    </AppSurface>
  );
};

export default PayoutAccountLink;

const styles = StyleSheet.create({
  surface: { minHeight: 112, borderRadius: theme.radius.card, borderCurve: "continuous" },
  card: { minHeight: 112, justifyContent: "space-between", gap: theme.spacing.sm, padding: theme.spacing.lg },
  header: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  bank: { flex: 1, minWidth: 0, color: theme.colors.authPrimary },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  account: { flex: 1, minWidth: 0, color: theme.colors.textOnDarkSecondary, fontSize: 13, lineHeight: 18 },
  arrow: { width: 38, height: 38 },
});
