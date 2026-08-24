import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { Building02Icon } from "@hugeicons/core-free-icons";
import { Pressable, StyleSheet, View } from "react-native";

interface VenueCardOptionProps {
  name: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}

const VenueCardOption = ({ name, selected, disabled, onPress }: VenueCardOptionProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="radio"
    accessibilityState={{ selected, disabled }}
    accessibilityLabel={name}
    style={({ pressed }) => [styles.container, selected && styles.selected, disabled && styles.disabled, pressed && styles.pressed]}
  >
    <View style={styles.icon}>
      <CustomIcon icon={Building02Icon} color={selected ? theme.colors.white : theme.colors.authTextSecondary} size={23} strokeWidth={3} />
    </View>
    <CustomText text={name} variant="bodyStrong" style={styles.name} numberOfLines={2} />
  </Pressable>
);

export default VenueCardOption;

const styles = StyleSheet.create({
  container: { width: "100%", minHeight: 72, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, borderRadius: theme.radius.extraLarge, borderCurve: "continuous", backgroundColor: "transparent" },
  selected: { backgroundColor: theme.colors.businessBlueSurface },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.45 },
  icon: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  name: { flex: 1, minWidth: 0, color: theme.colors.authText },
});
