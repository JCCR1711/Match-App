import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import CustomText from "@/src/components/ui/CustomText";
import PaymentStatusLabel from "@/src/features/payments/components/PaymentStatusLabel";
import { settlements } from "@/src/features/payments/data/paymentsPreview";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

const BusinessSettlementsView = () => {
  return (
    <AppScreenLayout title="Liquidaciones" backgroundVariant="dashboard" onBack={() => router.back()}>
      <View style={styles.summary}>
        <CustomText text="En proceso" variant="caption" style={styles.summaryLabel} />
        <View style={styles.summaryAmount}>
          <CustomText text="S/" variant="caption" style={styles.currency} />
          <CustomText text="1,840" variant="display" style={styles.total} />
        </View>
      </View>
      <View style={styles.list}>
        {settlements.map((settlement, index) => (
          <View key={settlement.id} style={styles.timelineRow}>
            <View style={styles.rail}>
              <View style={[styles.marker, settlement.status === "paid" && styles.paidMarker, settlement.status === "failed" && styles.failedMarker]} />
              {index < settlements.length - 1 ? <View style={styles.line} /> : null}
            </View>
            <View style={[styles.row, index < settlements.length - 1 && styles.rowSeparator]}>
              <View style={styles.heading}>
                <CustomText text={settlement.period} variant="body" style={styles.period} numberOfLines={2} />
                <CustomText text={settlement.amount} variant="subtitle" style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} />
              </View>
              <View style={styles.footer}>
                <CustomText text={settlement.destination} variant="caption" style={styles.destination} numberOfLines={2} />
                <PaymentStatusLabel status={settlement.status} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </AppScreenLayout>
  );
};

export default BusinessSettlementsView;

const styles = StyleSheet.create({
  summary: { padding: theme.spacing.xl, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.businessBlueSurface, gap: theme.spacing.xs },
  summaryLabel: { color: theme.colors.textOnDarkSecondary },
  summaryAmount: { flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xs },
  currency: { color: theme.colors.authTextSecondary },
  total: { color: theme.colors.white },
  list: { gap: 0 },
  timelineRow: { flexDirection: "row", gap: theme.spacing.md },
  rail: { width: 18, alignItems: "center" },
  marker: { width: 12, height: 12, marginTop: theme.spacing.lg + 6, borderRadius: theme.radius.pill, backgroundColor: theme.colors.authPrimary },
  paidMarker: { backgroundColor: theme.colors.accent },
  failedMarker: { backgroundColor: theme.colors.errorSoft },
  line: { flex: 1, width: 1, marginVertical: theme.spacing.xs, backgroundColor: theme.colors.dividerOnDark },
  row: {
    flex: 1,
    minHeight: 120,
    justifyContent: "space-between",
    paddingVertical: theme.spacing.lg,
  },
  rowSeparator: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.separatorOnDark },
  heading: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: theme.spacing.lg },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.lg },
  period: { flex: 1, minWidth: 0, color: theme.colors.white },
  amount: { flexShrink: 0, color: theme.colors.white },
  destination: { flex: 1, color: theme.colors.authTextSecondary },
});
