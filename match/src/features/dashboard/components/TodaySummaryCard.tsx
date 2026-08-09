import CustomText from "@/src/components/ui/CustomText";
import AppSurface from "@/src/components/ui/AppSurface";
import { theme } from "@/src/theme";
import { StyleSheet, Text, View } from "react-native";

interface TodaySummaryCardProps {
  onPress?: () => void;
}

const TodaySummaryCard = ({ onPress }: TodaySummaryCardProps) => (
  <AppSurface variant="blue" style={styles.card} onPress={onPress} accessibilityLabel="Ver estadísticas del negocio">
    <View>
      <CustomText text="Ingresos" variant="caption" style={styles.label} />
      <Text style={styles.revenue}>S/ 0</Text>
    </View>
    <View style={styles.metrics}>
      <Metric value="0" label="Reservas" />
      <View style={styles.divider} />
      <Metric value="0%" label="Ocupación" />
    </View>
  </AppSurface>
);

const Metric = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.metric}>
    <Text style={styles.metricValue}>{value}</Text>
    <CustomText text={label} variant="caption" style={styles.metricLabel} />
  </View>
);

export default TodaySummaryCard;

const styles = StyleSheet.create({
  card: { minHeight: 196, justifyContent: "space-between", padding: theme.spacing.xxl },
  label: { color: "rgba(255, 255, 255, 0.76)" },
  revenue: { marginTop: theme.spacing.xs, color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold, fontSize: 34, lineHeight: 42, fontWeight: theme.fontWeights.bold, letterSpacing: -0.7 },
  metrics: { flexDirection: "row", alignItems: "center", paddingTop: theme.spacing.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "rgba(255, 255, 255, 0.24)" },
  metric: { flex: 1, gap: theme.spacing.xxs },
  metricValue: { color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold, fontSize: 21, lineHeight: 27, fontWeight: theme.fontWeights.bold },
  metricLabel: { color: "rgba(255, 255, 255, 0.7)" },
  divider: { width: StyleSheet.hairlineWidth, height: 38, marginHorizontal: theme.spacing.xl, backgroundColor: "rgba(255, 255, 255, 0.24)" },
});
