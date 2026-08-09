import CustomIcon from "@/src/components/ui/CustomIcon";
import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { BanknoteIcon, Clock01Icon, Money03Icon, PercentCircleIcon } from "@hugeicons/core-free-icons";
import { StyleSheet, View } from "react-native";

const metrics = [
  { id: "received", label: "Cobrado", value: "S/ 4,260", change: "+12%", icon: Money03Icon },
  { id: "fees", label: "Comisiones", value: "S/ 320", change: "7.5%", icon: PercentCircleIcon },
  { id: "pending", label: "Pendiente", value: "S/ 410", change: "3 pagos", icon: Clock01Icon },
  { id: "settled", label: "Liquidado", value: "S/ 2,260", change: "+6%", icon: BanknoteIcon },
] as const;

const FinanceMetricGrid = () => (
  <View style={styles.grid}>
    {metrics.map((metric, index) => {
      const featured = index === 0;
      const accent = theme.metricAccentColors[index % theme.metricAccentColors.length];

      return <AppSurface key={metric.id} style={[styles.card, featured && styles.featured]}>
        <CustomIcon icon={metric.icon} size={31} strokeWidth={2.4} color={featured ? theme.colors.black : accent} />
        <View style={styles.copy}>
          <CustomText text={metric.value} variant="body" style={[styles.value, featured && styles.featuredValue]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78} />
          <CustomText text={metric.label} variant="caption" style={[styles.label, featured && styles.featuredLabel]} />
        </View>
        <CustomText text={metric.change} variant="caption" style={[styles.change, { color: accent }]} />
      </AppSurface>;
    })}
  </View>
);

export default FinanceMetricGrid;

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.md },
  card: { width: "46%", minHeight: 170, flexGrow: 1, justifyContent: "space-between", padding: theme.spacing.xl },
  featured: { backgroundColor: theme.colors.white },
  label: { color: theme.colors.authTextSecondary },
  featuredLabel: { color: theme.colors.surfaceMuted },
  copy: { gap: theme.spacing.xxs },
  value: { color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold, fontSize: 29, lineHeight: 36, letterSpacing: -0.6 },
  featuredValue: { color: theme.colors.black },
  change: { color: theme.colors.authTextSecondary },
});
