import CustomIcon from "@/src/components/ui/CustomIcon";
import { theme } from "@/src/theme";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface BusinessHighlightSurfaceProps {
  accessibilityLabel: string;
  children: ReactNode;
  onPress: () => void;
  tone: "navy" | "light";
}

const BusinessHighlightSurface = ({
  accessibilityLabel,
  children,
  onPress,
  tone,
}: BusinessHighlightSurfaceProps) => {
  const isLight = tone === "light";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isLight ? styles.lightCard : styles.navyCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>{children}</View>
      <View style={[styles.action, isLight ? styles.lightAction : styles.navyAction]}>
        <CustomIcon
          icon={ArrowRight01Icon}
          color={isLight ? theme.colors.white : theme.colors.businessBlueSurface}
          size={24}
          strokeWidth={2.5}
        />
      </View>
    </Pressable>
  );
};

export default BusinessHighlightSurface;

const styles = StyleSheet.create({
  card: {
    minHeight: 128,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.lg,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.card,
    borderCurve: "continuous",
  },
  navyCard: {
    backgroundColor: theme.colors.businessBlueSurface,
  },
  lightCard: {
    backgroundColor: theme.colors.authPrimary,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  action: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
  },
  navyAction: {
    backgroundColor: theme.colors.accent,
  },
  lightAction: {
    backgroundColor: theme.colors.black,
  },
  pressed: {
    opacity: 0.78,
  },
});
