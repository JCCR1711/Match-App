import CustomText from "@/src/components/ui/CustomText";
import type { ResourceStatus } from "@/src/features/venues/types/businessOnboarding";
import { theme } from "@/src/theme";
import { memo } from "react";
import { type StyleProp, StyleSheet, type TextStyle } from "react-native";

interface ResourceStatusLabelProps {
  status: ResourceStatus;
  style?: StyleProp<TextStyle>;
}

const ResourceStatusLabel = ({ status, style }: ResourceStatusLabelProps) => {
  const active = status === "active";
  const label = active ? "Activa" : "Inactiva";

  return <CustomText text={label} variant="label" style={[styles.label, active ? styles.activeLabel : styles.inactiveLabel, style]} accessibilityLabel={`Estado: ${label}`} numberOfLines={1} />;
};

export default memo(ResourceStatusLabel);

const styles = StyleSheet.create({
  label: { flexShrink: 0, alignSelf: "flex-start", textTransform: "uppercase", letterSpacing: 0.9 },
  activeLabel: { color: theme.colors.accent },
  inactiveLabel: { color: theme.colors.textMuted },
});
