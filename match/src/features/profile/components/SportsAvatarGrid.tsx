import CustomIcon from "@/src/components/ui/CustomIcon";
import SportsAvatar, { sportsAvatarCatalog } from "@/src/components/ui/SportsAvatar";
import { theme } from "@/src/theme";
import type { SportsAvatarId } from "@/src/types/avatar";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";

interface SportsAvatarGridProps {
  selectedId: SportsAvatarId;
  seed: string;
  onSelect: (avatarId: SportsAvatarId) => void;
}

const SportsAvatarGrid = ({ selectedId, seed, onSelect }: SportsAvatarGridProps) => {
  const { width } = useWindowDimensions();
  const availableWidth = Math.min(width, 560) - theme.layout.screenGutter * 2;
  const optionSize = Math.floor((availableWidth - theme.spacing.md * 2) / 3);
  const avatarSize = optionSize - 12;

  return (
    <View accessibilityRole="radiogroup" style={styles.grid}>
      {sportsAvatarCatalog.map((avatar) => {
        const selected = avatar.id === selectedId;

        return (
          <Pressable
            key={avatar.id}
            accessibilityRole="radio"
            accessibilityLabel={`Elegir avatar ${avatar.id}`}
            accessibilityState={{ selected }}
            onPress={() => onSelect(avatar.id)}
            style={({ pressed }) => [
              styles.option,
              { width: optionSize, height: optionSize },
              selected && styles.selected,
              pressed && styles.pressed,
            ]}
          >
            <SportsAvatar seed={seed} avatarId={avatar.id} size={avatarSize} />
            {selected ? (
              <View style={styles.check}>
                <CustomIcon icon={CheckmarkCircle02Icon} color={theme.colors.black} size={22} strokeWidth={2.6} />
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
};

export default SportsAvatarGrid;

const styles = StyleSheet.create({
  grid: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  option: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    borderWidth: 3,
    borderColor: "transparent",
  },
  selected: {
    borderColor: theme.colors.white,
  },
  pressed: { opacity: 0.72 },
  check: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.black,
  },
});
