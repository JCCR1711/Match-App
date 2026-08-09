import CustomText from "@/src/components/ui/CustomText";
import type { ResourceStatus } from "@/src/features/venues/types/businessOnboarding";
import { theme } from "@/src/theme";
import { StyleSheet, Switch, View } from "react-native";

interface ResourceStatusSwitchProps {
  status: ResourceStatus;
  disabled?: boolean;
  inheritedInactive?: boolean;
  onChange: (status: ResourceStatus) => void;
  accessibilityLabel: string;
}

const ResourceStatusSwitch = ({
  status,
  disabled = false,
  inheritedInactive = false,
  onChange,
  accessibilityLabel,
}: ResourceStatusSwitchProps) => {
  const active = status === "active" && !inheritedInactive;

  return (
    <View style={styles.container}>
      <CustomText
        text={inheritedInactive ? "Sede inactiva" : active ? "Activa" : "Inactiva"}
        variant="caption"
        style={[styles.label, active && styles.activeLabel]}
      />
      <Switch
        value={status === "active"}
        onValueChange={(value) => onChange(value ? "active" : "inactive")}
        disabled={disabled || inheritedInactive}
        trackColor={{ false: theme.colors.surfaceMuted, true: theme.colors.accent }}
        thumbColor={theme.colors.white}
        ios_backgroundColor={theme.colors.surfaceMuted}
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  );
};

export default ResourceStatusSwitch;

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  label: { color: theme.colors.authTextSecondary },
  activeLabel: { color: theme.colors.accent },
});
