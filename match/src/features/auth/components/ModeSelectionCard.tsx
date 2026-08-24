import AppCardArrow from "@/src/components/ui/AppCardArrow";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, View } from "react-native";

interface ModeSelectionCardProps {
  title: string;
  image: ImageSource | number;
  tone: "player" | "business";
  disabled?: boolean;
  onPress: () => void;
  accessibilityLabel: string;
}

const ModeSelectionCard = ({
  title,
  image,
  tone,
  disabled,
  onPress,
  accessibilityLabel,
}: ModeSelectionCardProps) => {
  const isBusiness = tone === "business";
  const playerColors = [theme.colors.authBlueDeep, theme.colors.cobalt] as const;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        isBusiness && styles.businessContainer,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {isBusiness ? null : (
        <>
          <LinearGradient
            colors={playerColors}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={["transparent", theme.colors.mediaScrimMid, theme.colors.mediaScrimStrong]}
            locations={[0.24, 0.64, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        </>
      )}
      <Image
        source={image}
        style={styles.image}
        contentFit="contain"
        contentPosition="bottom right"
        transition={180}
        accessible={false}
      />
      <View style={styles.content}>
        <CustomText
          text={title}
          variant="subtitle"
          style={[styles.title, isBusiness && styles.businessTitle]}
          numberOfLines={2}
        />
        <AppCardArrow
          backgroundColor={isBusiness ? theme.colors.black : theme.colors.white}
          color={isBusiness ? theme.colors.white : theme.colors.black}
          style={styles.action}
        />
      </View>
    </Pressable>
  );
};

export default ModeSelectionCard;

const styles = StyleSheet.create({
  container: {
    minWidth: 0,
    minHeight: 236,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: theme.radius.card,
    borderCurve: "continuous",
    backgroundColor: theme.colors.businessBlueSurface,
  },
  businessContainer: { backgroundColor: theme.colors.authPrimary },
  image: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    bottom: 0,
    width: "62%",
  },
  content: {
    zIndex: 1,
    minHeight: 236,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: theme.spacing.xl,
    padding: theme.spacing.xl,
  },
  title: { flex: 1, maxWidth: 176, color: theme.colors.white, fontSize: 24, lineHeight: 30 },
  businessTitle: { color: theme.colors.black },
  action: { width: 44, height: 44 },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.44 },
});
