import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

export type ScheduleStatus = "available" | "confirmed" | "pending" | "blocked" | "maintenance" | "canceled";

const statusContent: Record<ScheduleStatus, { label: string; color: string; backgroundColor: string }> = {
  available: { label: "Disponible", color: theme.colors.textMuted, backgroundColor: theme.colors.surfaceOnDarkSubtle },
  confirmed: { label: "Confirmada", color: theme.colors.accent, backgroundColor: theme.colors.confirmedSurface },
  pending: { label: "Pendiente", color: theme.colors.pendingLimeText, backgroundColor: theme.colors.pendingSurface },
  blocked: { label: "Bloqueada", color: theme.colors.errorSoft, backgroundColor: theme.colors.blockedSurface },
  maintenance: { label: "Mantenimiento", color: theme.colors.warmAmber, backgroundColor: theme.colors.maintenanceSurface },
  canceled: { label: "Cancelada", color: theme.colors.errorSoft, backgroundColor: theme.colors.errorSurface },
};

const ScheduleStatusLabel = ({ status, variant = "text", emphasis = "compact" }: { status: ScheduleStatus; variant?: "text" | "badge"; emphasis?: "compact" | "regular" }) => {
  const content = statusContent[status];
  const label = <CustomText text={content.label} variant={emphasis === "regular" ? "caption" : "label"} accessibilityLabel={`Estado: ${content.label}`} style={[styles.label, { color: content.color }]} />;
  return variant === "badge" ? <View style={[styles.badge, { backgroundColor: content.backgroundColor }]}>{label}</View> : label;
};

export default memo(ScheduleStatusLabel);

const styles = StyleSheet.create({
  label: { textTransform: "uppercase", letterSpacing: 0.9 },
  badge: { alignSelf: "flex-start", paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs, borderRadius: theme.radius.pill },
});
