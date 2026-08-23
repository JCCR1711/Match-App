import BusinessCardArrow from "@/src/features/dashboard/components/BusinessCardArrow";
import { theme } from "@/src/theme";
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
      <BusinessCardArrow
        backgroundColor={isLight ? theme.colors.black : theme.colors.white}
        color={isLight ? theme.colors.white : theme.colors.black}
      />
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
  pressed: {
    opacity: 0.78,
  },
});
