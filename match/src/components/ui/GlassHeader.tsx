import GlassSurface from "@/src/components/ui/GlassSurface";
import { theme } from "@/src/theme";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface GlassHeaderProps {
  children: ReactNode;
  topInset: number;
  contentHeight?: number;
}

const GlassHeader = ({
  children,
  topInset,
  contentHeight = 56,
}: GlassHeaderProps) => (
  <GlassSurface
    intensity={52}
    fallbackTint="rgba(0, 0, 0, 0.3)"
    style={[
      styles.container,
      {
        height: topInset + contentHeight,
        paddingTop: topInset,
      },
    ]}
  >
    <View style={styles.content}>{children}</View>
  </GlassSurface>
);

export default GlassHeader;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 10,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: "center",
  },
});
