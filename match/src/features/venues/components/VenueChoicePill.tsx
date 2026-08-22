import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { Pressable, StyleSheet } from "react-native";

interface VenueChoicePillProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}

const VenueChoicePill = ({ label, selected, disabled, onPress }: VenueChoicePillProps) => (
  <Pressable
    disabled={disabled}
    onPress={onPress}
    accessibilityRole="radio"
    accessibilityState={{ selected, disabled }}
    style={({ pressed }) => [styles.container, selected && styles.selected, disabled && styles.disabled, pressed && styles.pressed]}
  >
    <CustomText text={label} variant="caption" style={[styles.label, selected && styles.selectedLabel]} />
  </Pressable>
);

export default VenueChoicePill;

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 50, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.surface },
  selected: { backgroundColor: theme.colors.accent },
  label: { color: theme.colors.authTextSecondary },
  selectedLabel: { color: theme.colors.black, fontFamily: theme.fontFamilies.poppinsBold },
  disabled: { opacity: 0.38 },
  pressed: { opacity: 0.8 },
});
