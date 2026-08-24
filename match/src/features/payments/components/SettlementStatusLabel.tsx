import CustomText from "@/src/components/ui/CustomText";
import type { PaymentStatus } from "@/src/features/payments/types/businessPayments";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet } from "react-native";

const statusContent: Record<PaymentStatus, { settlementLabel: string; movementLabel: string; color: string }> = {
  pending: { settlementLabel: "En proceso", movementLabel: "En proceso", color: theme.colors.pendingLimeText },
  paid: { settlementLabel: "Depositada", movementLabel: "Cobrado", color: theme.colors.accent },
  failed: { settlementLabel: "Fallida", movementLabel: "Fallido", color: theme.colors.error },
};

const SettlementStatusLabel = ({ status, context = "settlement" }: { status: PaymentStatus; context?: "settlement" | "movement" }) => {
  const content = statusContent[status];
  const label = context === "movement" ? content.movementLabel : content.settlementLabel;

  return (
    <CustomText
      text={label}
      variant="label"
      accessibilityLabel={`Estado de ${context === "movement" ? "movimiento" : "liquidacion"}: ${label}`}
      style={[styles.label, { color: content.color }]}
      numberOfLines={1}
    />
  );
};

export default memo(SettlementStatusLabel);

const styles = StyleSheet.create({
  label: { flexShrink: 0, textTransform: "uppercase", letterSpacing: 0.9 },
});
