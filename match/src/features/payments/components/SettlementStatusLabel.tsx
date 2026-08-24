import CustomText from "@/src/components/ui/CustomText";
import type { PaymentStatus } from "@/src/features/payments/types/businessPayments";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet } from "react-native";

const statusContent: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: "En proceso", color: theme.colors.pendingLimeText },
  paid: { label: "Depositada", color: theme.colors.accent },
  failed: { label: "Fallida", color: theme.colors.error },
};

const SettlementStatusLabel = ({ status }: { status: PaymentStatus }) => {
  const content = statusContent[status];

  return (
    <CustomText
      text={content.label}
      variant="label"
      accessibilityLabel={`Estado de liquidación: ${content.label}`}
      style={[styles.label, { color: content.color }]}
      numberOfLines={1}
    />
  );
};

export default memo(SettlementStatusLabel);

const styles = StyleSheet.create({
  label: { flexShrink: 0, textTransform: "uppercase", letterSpacing: 0.9 },
});
