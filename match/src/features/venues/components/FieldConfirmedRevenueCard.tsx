import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { formatMoneyParts } from "@/src/utils/formatMoney";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

interface FieldConfirmedRevenueCardProps {
  amount: number;
}

const FieldConfirmedRevenueCard = ({ amount }: FieldConfirmedRevenueCardProps) => {
  const formattedAmount = formatMoneyParts(amount);

  return (
    <LinearGradient
      colors={[theme.colors.businessBlueSurface, theme.colors.authBlueDeep, theme.colors.cobalt]}
      locations={[0, 0.58, 1]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.card}
    >
      <CustomText text="Ingresos confirmados" variant="caption" style={styles.label} />
      <View style={styles.amountRow}>
        <CustomText text="S/" variant="subtitle" style={styles.currency} />
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
    </LinearGradient>
  );
};

export default FieldConfirmedRevenueCard;

const styles = StyleSheet.create({
  card: {
    minHeight: 104,
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.card,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  label: { color: theme.colors.textOnDarkSecondary },
  amountRow: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "baseline",
    gap: theme.spacing.xs,
  },
  currency: { color: theme.colors.white, fontSize: 18, lineHeight: 24 },
  amount: { flexShrink: 1, color: theme.colors.white, fontSize: 32, lineHeight: 38 },
  decimals: { color: theme.colors.textOnDarkSecondary },
});
