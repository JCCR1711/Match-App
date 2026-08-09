import CustomText from "@/src/components/ui/CustomText";
import type { PaymentStatus } from "@/src/features/payments/types/businessPayments";
import { theme } from "@/src/theme";
import { StyleSheet } from "react-native";

const statusCopy: Record<PaymentStatus, string> = { pending: "Pendiente", paid: "Pagado", failed: "Fallido" };

const PaymentStatusLabel = ({ status }: { status: PaymentStatus }) => (
  <CustomText
    text={statusCopy[status]}
    variant="caption"
    style={[styles.base, status === "paid" ? styles.paid : status === "failed" ? styles.failed : styles.pending]}
  />
);

export default PaymentStatusLabel;

const styles = StyleSheet.create({
  base: { alignSelf: "flex-start" },
  paid: { color: theme.colors.accent },
  pending: { color: theme.colors.authTextSecondary },
  failed: { color: theme.colors.errorSoft },
});
