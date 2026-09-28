import CustomText from "@/src/components/ui/CustomText";
import { getVenueRoleLabel } from "@/src/features/venues/utils/venueRoleLabel";
import { theme } from "@/src/theme";
import type { VenueRole } from "@/src/types/businessAccess";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface DevBusinessRoleSwitcherProps {
  value: VenueRole;
  disabled?: boolean;
  onChange: (role: VenueRole) => void;
}

const roles: readonly VenueRole[] = ["owner", "manager", "staff"];

const DevBusinessRoleSwitcher = ({ value, disabled, onChange }: DevBusinessRoleSwitcherProps) => (
  <View style={styles.section}>
    <View style={styles.heading}>
      <CustomText text="Rol de prueba" variant="body" style={styles.title} />
      <CustomText text="Solo desarrollo" variant="caption" style={styles.devLabel} />
    </View>
    <View style={styles.control} accessibilityRole="radiogroup">
      {roles.map((role) => {
        const selected = role === value;
        return (
          <Pressable
            key={role}
            disabled={disabled || selected}
            onPress={() => onChange(role)}
            accessibilityRole="radio"
            accessibilityLabel={`Probar como ${getVenueRoleLabel(role)}`}
            accessibilityState={{ selected, disabled }}
            style={({ pressed }) => [
              styles.option,
              selected && styles.optionSelected,
              pressed && styles.optionPressed,
              disabled && styles.optionDisabled,
            ]}
          >
            <CustomText
              text={getVenueRoleLabel(role)}
              variant="label"
              style={[styles.optionLabel, selected && styles.optionLabelSelected]}
              numberOfLines={1}
            />
          </Pressable>
        );
      })}
    </View>
  </View>
);

export default memo(DevBusinessRoleSwitcher);

const styles = StyleSheet.create({
  section: { gap: theme.spacing.md },
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  title: { color: theme.colors.white, fontSize: 19, lineHeight: 26, fontFamily: theme.fontFamilies.poppinsBold },
  devLabel: { color: theme.colors.authTextSecondary },
  control: { minHeight: 52, flexDirection: "row", gap: theme.spacing.xs, padding: theme.spacing.xs, borderRadius: theme.radius.extraLarge, backgroundColor: theme.colors.authSurface },
  option: { flex: 1, minWidth: 0, alignItems: "center", justifyContent: "center", paddingHorizontal: theme.spacing.xs, borderRadius: theme.radius.large },
  optionSelected: { backgroundColor: theme.colors.authPrimary },
  optionPressed: { opacity: 0.72 },
  optionDisabled: { opacity: 0.5 },
  optionLabel: { color: theme.colors.authTextSecondary },
  optionLabelSelected: { color: theme.colors.black },
});
