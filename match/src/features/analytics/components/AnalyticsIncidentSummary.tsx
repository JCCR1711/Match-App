import CustomText from "@/src/components/ui/CustomText";
import type { AnalyticsIncidentSummary as IncidentSummary } from "@/src/features/analytics/types/businessAnalytics";
import { formatCurrency } from "@/src/features/analytics/utils/formatAnalyticsMetric";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

const AnalyticsIncidentSummary = ({ summary }: { summary: IncidentSummary }) => {
  const hasPendingRefunds = summary.refundPending > 0;
  return (
    <View
      style={styles.surface}
      accessible
      accessibilityLabel={`${summary.canceled} canceladas. ${formatCurrency(summary.refundPending)} por devolver. ${formatCurrency(summary.refunded)} devuelto.`}
    >
      <View style={styles.heading}>
        <CustomText text={hasPendingRefunds ? formatCurrency(summary.refundPending) : "Sin devoluciones pendientes"} variant={hasPendingRefunds ? "heading" : "subtitle"} style={styles.mainValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.76} />
        <CustomText text={hasPendingRefunds ? "Pendiente de devolución" : "Todo conciliado"} variant="bodyStrong" style={styles.description} />
      </View>
      <View style={styles.footer}>
        <Metric value={String(summary.canceled)} label="Canceladas" tone="canceled" />
        <Metric value={formatCurrency(summary.refunded)} label="Ya devuelto" tone="refunded" />
      </View>
    </View>
  );
};

const Metric = ({ value, label, tone }: { value: string; label: string; tone: "canceled" | "refunded" }) => (
  <View style={styles.metric}>
    <CustomText text={value} variant="heading" style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.68} />
    <View style={[styles.labelSurface, tone === "canceled" ? styles.labelCanceled : styles.labelRefunded]}>
      <CustomText text={label} variant="caption" style={[styles.label, tone === "canceled" ? styles.canceledLabel : styles.refundedLabel]} />
    </View>
  </View>
);

export default AnalyticsIncidentSummary;

const styles = StyleSheet.create({
  surface: { minHeight: 180, alignItems: "center", justifyContent: "center", gap: theme.spacing.xl, padding: theme.spacing.xl, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.authSurface },
  heading: { alignItems: "center", gap: theme.spacing.xs },
  mainValue: { color: theme.colors.white, textAlign: "center" },
  description: { color: theme.colors.textOnDarkSecondary, textAlign: "center" },
  footer: { flexDirection: "row", alignItems: "stretch", gap: theme.spacing.sm },
  metric: { minWidth: 0, flex: 1, minHeight: 92, alignItems: "center", justifyContent: "center", gap: theme.spacing.sm },
  value: { color: theme.colors.white, textAlign: "center" },
  labelSurface: { minHeight: 32, alignItems: "center", justifyContent: "center", paddingHorizontal: theme.spacing.md, borderRadius: theme.radius.pill },
  labelCanceled: { backgroundColor: theme.colors.errorSurface },
  labelRefunded: { backgroundColor: theme.colors.confirmedSurface },
  label: { textAlign: "center", fontFamily: theme.fontFamilies.poppinsBold },
  canceledLabel: { color: theme.colors.errorSoft },
  refundedLabel: { color: theme.colors.accent },
});
