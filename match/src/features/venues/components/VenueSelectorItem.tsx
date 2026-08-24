import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { memo } from "react";
import { Pressable, StyleSheet } from "react-native";

interface VenueSelectorItemProps {
  index: number;
  name: string;
  fieldCount: number;
  selected: boolean;
  onPress: () => void;
}

const VenueSelectorItem = ({ index, name, fieldCount, selected, onPress }: VenueSelectorItemProps) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="tab"
    accessibilityState={{ selected }}
    accessibilityLabel={`${name}, ${fieldCount} ${fieldCount === 1 ? "cancha" : "canchas"}`}
    style={({ pressed }) => [styles.item, selected && styles.selectedItem, pressed && styles.pressed]}
  >
    <CustomText text={String(index + 1)} variant="actionSecondary" style={[styles.index, selected && styles.selectedMuted]} />
    <CustomText text={name} variant="actionSecondary" style={[styles.name, selected && styles.selectedText]} numberOfLines={1} />
  </Pressable>
);

export default memo(VenueSelectorItem);

const styles = StyleSheet.create({
  item: { width: 140, minHeight: 52, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, paddingHorizontal: theme.spacing.md, borderRadius: theme.radius.pill, backgroundColor: theme.colors.surfaceOnDarkSubtle },
  selectedItem: { backgroundColor: theme.colors.white },
  index: { color: theme.colors.authTextSecondary, letterSpacing: 0.2, includeFontPadding: false, textAlignVertical: "center", transform: [{ translateY: -2 }] },
  name: { flex: 1, minWidth: 0, color: theme.colors.white, includeFontPadding: false, textAlignVertical: "center", transform: [{ translateY: -2 }] },
  selectedText: { color: theme.colors.black },
  selectedMuted: { color: theme.colors.surfaceMuted },
  pressed: { opacity: 0.72 },
});
