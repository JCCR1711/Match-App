import AppContextHelp from "@/src/components/ui/AppContextHelp";
import CustomText from "@/src/components/ui/CustomText";
import type { PaymentOverview } from "@/src/features/payments/types/businessPayments";
import { theme } from "@/src/theme";
import { formatMoneyParts } from "@/src/utils/formatMoney";
import { StyleSheet, View } from "react-native";

const FinanceSummaryCard = ({ overview }: { overview: PaymentOverview }) => {
  const balance = formatMoneyParts(overview.unsettledBalance);

  return (
    <View style={styles.summary}>
      <View style={styles.heading}>
        <CustomText text="Por liquidar" variant="sectionHeading" style={styles.label} />
        <AppContextHelp
          title="Por liquidar"
          description="Dinero neto ya cobrado que todavía está pendiente de incluirse en un depósito a tu cuenta bancaria."
        />
      </View>
      <View style={styles.totalRow}>
        <CustomText text="S/" variant="display" style={styles.currency} />
        <CustomText text={balance.whole} variant="display" style={styles.total} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72} />
        <CustomText text={balance.decimals} variant="subtitle" style={styles.decimals} />
      </View>
    </View>
  );
};

export default FinanceSummaryCard;

const styles = StyleSheet.create({
  summary: { minWidth: 0, gap: theme.spacing.sm, paddingVertical: theme.spacing.lg },
  heading: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  label: { color: theme.colors.white },
  totalRow: { minWidth: 0, flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xs },
  total: { flexShrink: 1, color: theme.colors.white, fontSize: 54, lineHeight: 62 },
  currency: { color: theme.colors.white, fontSize: 54, lineHeight: 62 },
  decimals: { color: theme.colors.textOnDarkSecondary },
});
