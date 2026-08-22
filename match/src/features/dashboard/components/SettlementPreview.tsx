import CustomText from "@/src/components/ui/CustomText";
import BusinessHighlightSurface from "@/src/features/dashboard/components/BusinessHighlightSurface";
import type { Settlement } from "@/src/features/payments/types/businessPayments";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

interface SettlementPreviewProps {
  settlement: Settlement;
  onPress: () => void;
}

const SettlementPreview = ({ settlement, onPress }: SettlementPreviewProps) => {
  const amount = settlement.amount.replace(/^S\/\s*/, "");

  return (
    <BusinessHighlightSurface
      accessibilityLabel={`Ver próximo abono de ${settlement.amount}`}
      onPress={onPress}
      tone="light"
    >
      <View style={styles.copy}>
        <CustomText text="Próximo abono" variant="caption" style={styles.label} />
        <View style={styles.amountRow}>
          <CustomText text="S/" variant="caption" style={styles.currency} />
          <CustomText text={amount} variant="heading" style={styles.amount} />
        </View>
      </View>
    </BusinessHighlightSurface>
  );
};

export default SettlementPreview;

const styles = StyleSheet.create({
  copy: {
    gap: theme.spacing.xxs,
  },
  label: {
    color: theme.colors.black,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: theme.spacing.xs,
  },
  currency: {
    color: theme.colors.black,
    opacity: 0.7,
  },
  amount: {
    color: theme.colors.black,
  },
});
