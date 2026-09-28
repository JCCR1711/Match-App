import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { formatMoneyParts } from "@/src/utils/formatMoney";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

interface ReservationPriceSummaryProps {
  amount: number;
  label?: string;
}

const ReservationPriceSummary = ({ amount, label = "Total" }: ReservationPriceSummaryProps) => {
  const formattedAmount = formatMoneyParts(amount);

  return (
    <View
      accessible
      accessibilityLabel={`${label}: S/ ${formattedAmount.whole}${formattedAmount.decimals}`}
      style={styles.card}
    >
      <CustomText text={label} variant="bodyStrong" style={styles.label} />
      <View style={styles.amountRow}>
        <CustomText text="S/" variant="caption" style={styles.currency} />
        <CustomText
          text={formattedAmount.whole}
          variant="heading"
          style={styles.amount}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
        />
        <CustomText text={formattedAmount.decimals} variant="bodyStrong" style={styles.decimals} />
      </View>
    </View>
  );
};

export default memo(ReservationPriceSummary);

const styles = StyleSheet.create({
  card: {
    minHeight: 96,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.extraLarge,
    borderCurve: "continuous",
    backgroundColor: theme.colors.surfaceOnDarkSubtle,
  },
  label: { flexShrink: 0, color: theme.colors.textOnDarkSecondary },
  amountRow: {
    minWidth: 0,
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-end",
    gap: theme.spacing.xs,
  },
  currency: { color: theme.colors.textOnDarkSecondary },
  amount: { flexShrink: 1, color: theme.colors.white, fontSize: 32, lineHeight: 38, letterSpacing: 0 },
  decimals: { color: theme.colors.textOnDarkSecondary },
});
