import AppCardArrow from "@/src/components/ui/AppCardArrow";
import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import FinancialPremiumSurface from "@/src/features/payments/components/FinancialPremiumSurface";
import type { Settlement } from "@/src/features/payments/types/businessPayments";
import { theme } from "@/src/theme";
import { formatMoneyAmount, formatSoles } from "@/src/utils/formatMoney";
import { StyleSheet, View } from "react-native";

interface SettlementPreviewProps {
  settlement: Settlement;
  onPress: () => void;
}

const SettlementPreview = ({ settlement, onPress }: SettlementPreviewProps) => {
  const amount = formatMoneyAmount(settlement.netAmount);

  return (
    <AppSurface
      variant="transparent"
      accessibilityLabel={`Ver próximo depósito de ${formatSoles(settlement.netAmount)}, estimado para ${settlement.expectedDepositLabel}`}
      onPress={onPress}
      style={styles.surface}
    >
      <FinancialPremiumSurface style={styles.card}>
        <View style={styles.copy}>
          <CustomText text="Próximo depósito" variant="bodyStrong" style={styles.label} />
          <View style={styles.amountRow}>
            <CustomText text="S/" variant="caption" style={styles.currency} />
            <CustomText text={amount} variant="heading" style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} />
          </View>
        </View>
        <View style={styles.footer}>
          <CustomText text={settlement.expectedDepositLabel} variant="caption" style={styles.date} numberOfLines={1} />
          <AppCardArrow backgroundColor={theme.colors.authPrimary} color={theme.colors.black} style={styles.arrow} />
        </View>
      </FinancialPremiumSurface>
    </AppSurface>
  );
};

export default SettlementPreview;

const styles = StyleSheet.create({
  surface: { minHeight: 132, borderRadius: theme.radius.card, borderCurve: "continuous" },
  card: { minHeight: 132, justifyContent: "space-between", padding: theme.spacing.lg },
  copy: { gap: theme.spacing.sm },
  label: { color: theme.colors.textOnDarkSecondary },
  amountRow: { minWidth: 0, flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xs },
  currency: { color: theme.colors.authTextSecondary },
  amount: { flexShrink: 1, color: theme.colors.white },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  date: { flex: 1, minWidth: 0, color: theme.colors.authPrimary },
  arrow: { width: 42, height: 42 },
});
