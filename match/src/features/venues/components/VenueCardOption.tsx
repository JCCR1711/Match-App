import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { Location01Icon } from "@hugeicons/core-free-icons";
import { Pressable, StyleSheet, View } from "react-native";

interface VenueCardOptionProps {
  name: string;
  location: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}

const VenueCardOption = ({ name, location, selected, disabled, onPress }: VenueCardOptionProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="radio"
    accessibilityState={{ selected, disabled }}
    style={({ pressed }) => [styles.container, selected && styles.selected, pressed && styles.pressed]}
  >
    <CustomIcon icon={Location01Icon} color={selected ? theme.colors.black : theme.colors.authTextSecondary} size={27} strokeWidth={2.2} />
    <View style={styles.copy}>
      <CustomText text={name} variant="body" style={[styles.name, selected && styles.selectedText]} />
      <CustomText text={location} variant="caption" style={[styles.location, selected && styles.selectedMeta]} numberOfLines={2} />
    </View>
  </Pressable>
);

export default VenueCardOption;

const styles = StyleSheet.create({
  container: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm, borderRadius: theme.radius.extraLarge, backgroundColor: theme.colors.surface },
  selected: { backgroundColor: theme.colors.authPrimary },
  pressed: { opacity: 0.8 },
  copy: { flex: 1, gap: theme.spacing.xxs },
  name: { color: theme.colors.authText },
  location: { color: theme.colors.authTextSecondary },
  selectedText: { color: theme.colors.black, fontFamily: theme.fontFamilies.poppinsBold },
  selectedMeta: { color: "rgba(0, 0, 0, 0.62)" },
});
