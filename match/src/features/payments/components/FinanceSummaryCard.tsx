import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

const FinanceSummaryCard = () => (
  <View style={styles.container}>
    <View>
      <CustomText text="Disponible" variant="caption" style={styles.label} />
      <CustomText
        text="S/ 3,940"
        variant="body"
        style={styles.total}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.82}
      />
    </View>
    <CustomText text="+8%" variant="caption" style={styles.change} />
  </View>
);

export default FinanceSummaryCard;

const styles = StyleSheet.create({
  container: {
    minHeight: 124,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.lg,
  },
  label: { color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 20 },
  total: {
    marginTop: theme.spacing.xs,
    color: theme.colors.white,
    fontFamily: theme.fontFamilies.poppinsBold,
    fontSize: 46,
    lineHeight: 54,
    letterSpacing: -1.2,
  },
  change: {
    color: theme.colors.accent,
    fontFamily: theme.fontFamilies.outfitSemiBold,
    fontSize: 15,
    lineHeight: 20,
  },
});
