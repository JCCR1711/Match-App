import AppBottomSheet from "@/src/components/ui/AppBottomSheet";
import CustomText from "@/src/components/ui/CustomText";
import SettlementGradientSurface from "@/src/features/payments/components/SettlementGradientSurface";
import SettlementStatusLabel from "@/src/features/payments/components/SettlementStatusLabel";
import type { Settlement } from "@/src/features/payments/types/businessPayments";
import { formatSettlementAccount } from "@/src/features/payments/utils/formatSettlementAccount";
import { theme } from "@/src/theme";
import { formatSoles } from "@/src/utils/formatMoney";
import { StyleSheet, View } from "react-native";

interface SettlementDetailsSheetProps {
  settlement: Settlement | null;
  onClose: () => void;
}

const SettlementDetailsSheet = ({ settlement, onClose }: SettlementDetailsSheetProps) => {
  if (!settlement) return null;

  const depositDate = settlement.depositedAtLabel ?? settlement.expectedDepositLabel;

  return (
    <AppBottomSheet visible title="Detalle de liquidación" collapsedHeight={610} onClose={onClose}>
      <View style={styles.content}>
        <SettlementGradientSurface style={styles.summary}>
          <View style={styles.summaryHeader}>
            <CustomText text={settlement.period} variant="caption" style={styles.period} />
            <SettlementStatusLabel status={settlement.status} />
          </View>
          <CustomText text={formatSoles(settlement.netAmount)} variant="heading" style={styles.netAmount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78} />
          <CustomText text={`${settlement.reservationCount} reservas agrupadas`} variant="caption" style={styles.reservations} />
        </SettlementGradientSurface>

        <View style={styles.breakdown}>
          <BreakdownRow label="Cobrado" value={formatSoles(settlement.grossAmount)} />
          <BreakdownRow label="Comisiones" value={`-${formatSoles(settlement.feeAmount)}`} />
          {settlement.adjustmentAmount !== 0 ? <BreakdownRow label="Ajustes" value={formatSoles(settlement.adjustmentAmount)} /> : null}
          <BreakdownRow label="Neto" value={formatSoles(settlement.netAmount)} emphasized />
        </View>

        <View style={styles.destination}>
          <Detail label={settlement.depositedAtLabel ? "Depositada" : "Depósito estimado"} value={depositDate} />
          <Detail label="Cuenta destino" value={formatSettlementAccount(settlement.accountLastDigits)} align="end" />
        </View>
      </View>
    </AppBottomSheet>
  );
};

const BreakdownRow = ({ label, value, emphasized = false }: { label: string; value: string; emphasized?: boolean }) => (
  <View style={styles.breakdownRow}>
    <CustomText text={label} variant={emphasized ? "bodyStrong" : "body"} style={emphasized ? styles.strongLabel : styles.rowLabel} />
    <CustomText text={value} variant={emphasized ? "action" : "bodyStrong"} style={emphasized ? styles.strongValue : styles.rowValue} />
  </View>
);

const Detail = ({ label, value, align = "start" }: { label: string; value: string; align?: "start" | "end" }) => (
  <View style={[styles.detail, align === "end" && styles.detailEnd]}>
    <CustomText text={label} variant="caption" style={styles.detailLabel} />
    <CustomText text={value} variant="bodyStrong" style={[styles.detailValue, align === "end" && styles.detailValueEnd]} numberOfLines={1} />
  </View>
);

export default SettlementDetailsSheet;

const styles = StyleSheet.create({
  content: { gap: theme.spacing.lg },
  summary: { gap: theme.spacing.sm, padding: theme.spacing.lg, borderRadius: theme.radius.extraLarge, borderCurve: "continuous", overflow: "hidden" },
  summaryHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  period: { color: theme.colors.textOnDarkSecondary },
  netAmount: { color: theme.colors.white, letterSpacing: 0 },
  reservations: { color: theme.colors.iceBlue },
  breakdown: { gap: theme.spacing.md, paddingVertical: theme.spacing.sm },
  breakdownRow: { minHeight: 28, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.lg },
  rowLabel: { color: theme.colors.textOnDarkSecondary },
  rowValue: { color: theme.colors.white },
  strongLabel: { color: theme.colors.white },
  strongValue: { color: theme.colors.white },
  destination: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: theme.spacing.xl, paddingTop: theme.spacing.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.dividerOnDark },
  detail: { flex: 1, minWidth: 0, gap: theme.spacing.xs },
  detailEnd: { alignItems: "flex-end" },
  detailLabel: { color: theme.colors.textOnDarkSecondary },
  detailValue: { color: theme.colors.white },
  detailValueEnd: { textAlign: "right" },
});
