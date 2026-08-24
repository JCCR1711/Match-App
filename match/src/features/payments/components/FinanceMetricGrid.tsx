import CustomText from "@/src/components/ui/CustomText";
import type { PaymentOverview } from "@/src/features/payments/types/businessPayments";
import { theme } from "@/src/theme";
import { formatSoles } from "@/src/utils/formatMoney";
import { StyleSheet, View } from "react-native";

const FinanceMetricGrid = ({ overview }: { overview: PaymentOverview }) => (
  <View style={styles.summary}>
    <Metric label="Cobrado" value={formatSoles(overview.grossCollectedThisMonth)} />
    <View style={styles.divider} />
    <Metric label="Comisiones" value={formatSoles(overview.feesThisMonth)} />
  </View>
);

const Metric = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.metric}>
    <CustomText text={value} variant="actionSecondary" style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8} />
    <CustomText text={label} variant="caption" style={styles.label} numberOfLines={1} />
  </View>
);

export default FinanceMetricGrid;

const styles = StyleSheet.create({
  summary: { minHeight: 76, flexDirection: "row", alignItems: "center", paddingVertical: theme.spacing.sm },
  metric: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  divider: { width: StyleSheet.hairlineWidth, height: 42, marginHorizontal: theme.spacing.lg, backgroundColor: theme.colors.dividerOnDark },
  value: { color: theme.colors.white },
  label: { color: theme.colors.authTextSecondary },
});
