import AppCardArrow from "@/src/components/ui/AppCardArrow";
import AppSurface from "@/src/components/ui/AppSurface";
import { theme } from "@/src/theme";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

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
    <AppSurface
      variant="transparent"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[
        styles.card,
        isLight ? styles.lightCard : styles.navyCard,
      ]}
    >
      <View style={styles.content}>{children}</View>
      <AppCardArrow
        backgroundColor={isLight ? theme.colors.black : theme.colors.white}
        color={isLight ? theme.colors.pendingLimeText : theme.colors.black}
      />
    </AppSurface>
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
});
