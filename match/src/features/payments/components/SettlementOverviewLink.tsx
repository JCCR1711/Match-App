import AppCardArrow from "@/src/components/ui/AppCardArrow";
import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import SettlementGradientSurface from "@/src/features/payments/components/SettlementGradientSurface";
import { theme } from "@/src/theme";
import { formatSoles } from "@/src/utils/formatMoney";
import { StyleSheet, View } from "react-native";

interface SettlementOverviewLinkProps {
  pendingAmount: number;
  pendingCount: number;
  expectedDepositLabel: string;
  onPress: () => void;
}

const SettlementOverviewLink = ({ pendingAmount, pendingCount, expectedDepositLabel, onPress }: SettlementOverviewLinkProps) => (
  <AppSurface
    variant="transparent"
    accessibilityLabel={`Ver ${pendingCount} ${pendingCount === 1 ? "liquidación" : "liquidaciones"} en proceso por ${formatSoles(pendingAmount)}`}
    onPress={onPress}
    style={styles.pressable}
  >
    <SettlementGradientSurface style={styles.container}>
      <CustomText text={`Depósito estimado · ${expectedDepositLabel}`} variant="caption" style={styles.label} />
      <CustomText text={formatSoles(pendingAmount)} variant="heading" style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78} />
      <View style={styles.footer}>
        <CustomText text={`${pendingCount} ${pendingCount === 1 ? "liquidación" : "liquidaciones"}`} variant="caption" style={styles.detail} numberOfLines={1} />
        <AppCardArrow backgroundColor={theme.colors.authPrimary} color={theme.colors.black} style={styles.arrow} />
      </View>
    </SettlementGradientSurface>
  </AppSurface>
);

export default SettlementOverviewLink;

const styles = StyleSheet.create({
  pressable: { minHeight: 160, overflow: "hidden", borderRadius: theme.radius.card, borderCurve: "continuous" },
  container: { minHeight: 160, justifyContent: "space-between", gap: theme.spacing.sm, padding: theme.spacing.lg },
  label: { color: theme.colors.textOnDarkSecondary },
  value: { color: theme.colors.white },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  detail: { flex: 1, minWidth: 0, color: theme.colors.iceBlue },
  arrow: { width: 44, height: 44 },
});
