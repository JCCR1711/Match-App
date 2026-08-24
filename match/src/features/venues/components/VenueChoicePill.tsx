import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { Pressable, StyleSheet } from "react-native";

interface VenueChoicePillProps {
  label: string;
  selected: boolean;
  tone?: "accent" | "neutral";
  disabled?: boolean;
  onPress: () => void;
}

const VenueChoicePill = ({ label, selected, tone = "accent", disabled, onPress }: VenueChoicePillProps) => (
  <Pressable
    disabled={disabled}
    onPress={onPress}
    accessibilityRole="radio"
    accessibilityState={{ selected, disabled }}
    style={({ pressed }) => [
      styles.container,
      selected && tone === "accent" && styles.selectedAccent,
      selected && tone === "neutral" && styles.selectedNeutral,
      disabled && styles.disabled,
      pressed && styles.pressed,
    ]}
  >
    <CustomText text={label} variant="bodyStrong" style={[styles.label, selected && styles.selectedLabel]} numberOfLines={1} />
  </Pressable>
);

export default VenueChoicePill;

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: theme.spacing.huge, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.surface },
  selectedAccent: { backgroundColor: theme.colors.accent },
  selectedNeutral: { backgroundColor: theme.colors.authPrimary },
  label: { color: theme.colors.authTextSecondary },
  selectedLabel: { color: theme.colors.black },
  disabled: { opacity: 0.38 },
  pressed: { opacity: 0.8 },
});
