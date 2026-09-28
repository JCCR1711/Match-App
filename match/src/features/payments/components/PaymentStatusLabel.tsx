import CustomText from "@/src/components/ui/CustomText";
import type { PaymentStatus } from "@/src/features/payments/types/businessPayments";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet } from "react-native";

const statusContent: Record<PaymentStatus, { label: string; color: string }> = {
  processing: { label: "Procesando", color: theme.colors.pendingLimeText },
  paid: { label: "Cobrado", color: theme.colors.accent },
  failed: { label: "Fallido", color: theme.colors.error },
  refunded: { label: "Devuelto", color: theme.colors.iceBlue },
};

const PaymentStatusLabel = ({ status }: { status: PaymentStatus }) => {
  const content = statusContent[status];
  return <CustomText text={content.label} variant="label" accessibilityLabel={`Estado del cobro: ${content.label}`} style={[styles.label, { color: content.color }]} numberOfLines={1} />;
};

export default memo(PaymentStatusLabel);

const styles = StyleSheet.create({
  label: { flexShrink: 0, textTransform: "uppercase", letterSpacing: 0.9 },
});
