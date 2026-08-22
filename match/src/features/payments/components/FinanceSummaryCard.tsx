import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { Money03Icon } from "@hugeicons/core-free-icons";
import { StyleSheet, View } from "react-native";

const FinanceSummaryCard = () => (
  <View style={styles.card}>
    <View style={styles.heading}>
      <View style={styles.labelRow}>
        <CustomIcon icon={Money03Icon} color={theme.colors.black} size={22} strokeWidth={2.25} />
        <CustomText text="Saldo disponible" variant="caption" style={styles.label} />
      </View>
      <CustomText text="+8%" variant="caption" style={styles.change} />
    </View>
    <View style={styles.totalRow}>
      <CustomText text="S/" variant="caption" style={styles.currency} />
      <CustomText text="3,940" variant="display" style={styles.total} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78} />
    </View>
    <View style={styles.footer}>
      <CustomText text="Cobrado este mes" variant="caption" style={styles.detail} />
      <CustomText text="S/ 4,260" variant="body" style={styles.monthTotal} />
    </View>
  </View>
);

export default FinanceSummaryCard;

const styles = StyleSheet.create({
  card: { minWidth: 0, gap: theme.spacing.xs, padding: theme.spacing.xl, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.authPrimary },
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  labelRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  label: { color: theme.colors.black, opacity: 0.64 },
  change: { color: theme.colors.black },
  totalRow: { flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xs, marginTop: theme.spacing.xs },
  total: { flexShrink: 1, color: theme.colors.black },
  currency: { color: theme.colors.black, opacity: 0.55 },
  footer: { marginTop: theme.spacing.lg, paddingTop: theme.spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "rgba(0,0,0,0.16)", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  detail: { color: theme.colors.black, opacity: 0.58 },
  monthTotal: { color: theme.colors.black, fontFamily: theme.fontFamilies.poppinsBold },
});
