import CustomText from "@/src/components/ui/CustomText";
import type { PayoutAccountStatus } from "@/src/features/payments/types/businessPayments";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

const contentByStatus: Record<PayoutAccountStatus, { label: string; color: string; backgroundColor: string }> = {
  verified: { label: "Verificada", color: theme.colors.success, backgroundColor: theme.colors.confirmedSurface },
  pending_verification: { label: "En verificación", color: theme.colors.iceBlue, backgroundColor: theme.colors.reservedSurface },
};

const PayoutAccountStatusLabel = ({ status, verifiedColor }: { status: PayoutAccountStatus; verifiedColor?: string }) => {
  const content = contentByStatus[status];
  const color = status === "verified" && verifiedColor ? verifiedColor : content.color;

  return (
    <View style={[styles.container, { backgroundColor: content.backgroundColor }]} accessible accessibilityLabel={`Estado de cuenta: ${content.label}`}>
      <CustomText text={content.label} variant="caption" style={[styles.label, { color }]} />
    </View>
  );
};

export default PayoutAccountStatusLabel;

const styles = StyleSheet.create({
  container: {
    minHeight: 32,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.pill,
  },
  label: { lineHeight: 18 },
});
