import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet } from "react-native";

export type ScheduleStatus = "available" | "confirmed" | "pending" | "blocked" | "canceled";

const statusContent: Record<ScheduleStatus, { label: string; color: string }> = {
  available: { label: "Disponible", color: theme.colors.accent },
  confirmed: { label: "Confirmada", color: theme.colors.accent },
  pending: { label: "Pendiente", color: theme.colors.warmAmber },
  blocked: { label: "Bloqueada", color: theme.colors.errorSoft },
  canceled: { label: "Cancelada", color: theme.colors.errorSoft },
};

const ScheduleStatusLabel = ({ status }: { status: ScheduleStatus }) => {
  const content = statusContent[status];
  return <CustomText text={content.label} variant="label" accessibilityLabel={`Estado: ${content.label}`} style={[styles.label, { color: content.color }]} />;
};

export default memo(ScheduleStatusLabel);

const styles = StyleSheet.create({
  label: { textTransform: "uppercase", letterSpacing: 0.9 },
});
