import CustomText from "@/src/components/ui/CustomText";
import type { SettlementStatus } from "@/src/features/payments/types/businessPayments";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet } from "react-native";

const statusContent: Record<SettlementStatus, { label: string; color: string }> = {
  scheduled: { label: "Programada", color: theme.colors.iceBlue },
  processing: { label: "En proceso", color: theme.colors.pendingLimeText },
  deposited: { label: "Depositada", color: theme.colors.accent },
  failed: { label: "Fallida", color: theme.colors.error },
};

const SettlementStatusLabel = ({ status }: { status: SettlementStatus }) => {
  const content = statusContent[status];
  return <CustomText text={content.label} variant="label" accessibilityLabel={`Estado de liquidación: ${content.label}`} style={[styles.label, { color: content.color }]} numberOfLines={1} />;
};

export default memo(SettlementStatusLabel);

const styles = StyleSheet.create({
  label: { flexShrink: 0, textTransform: "uppercase", letterSpacing: 0.9 },
});
