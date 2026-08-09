import { theme } from "@/src/theme";
import { BlurView } from "expo-blur";
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import type { ReactNode } from "react";
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

interface GlassSurfaceProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  fallbackTint?: string;
  interactive?: boolean;
}

const supportsLiquidGlass =
  Platform.OS === "ios" &&
  isGlassEffectAPIAvailable() &&
  isLiquidGlassAvailable();

const GlassSurface = ({
  children,
  style,
  intensity = 58,
  fallbackTint = "rgba(8, 8, 10, 0.28)",
  interactive = false,
}: GlassSurfaceProps) => {
  if (supportsLiquidGlass) {
    return (
      <GlassView
        glassEffectStyle="regular"
        colorScheme="dark"
        tintColor={theme.colors.authSurface}
        isInteractive={interactive}
        style={style}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <View style={style}>
      <BlurView
        intensity={intensity}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
      />
      <View
        pointerEvents="none"
        style={[styles.fallbackTint, { backgroundColor: fallbackTint }]}
      />
      {children}
    </View>
  );
};

export default GlassSurface;

const styles = StyleSheet.create({
  fallbackTint: StyleSheet.absoluteFillObject,
});
