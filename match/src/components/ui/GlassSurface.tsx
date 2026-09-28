import { theme } from "@/src/theme";
import { BlurView } from "expo-blur";
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import type { ReactNode, RefObject } from "react";
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface GlassSurfaceProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  fallbackTint?: string;
  tintColor?: string;
  interactive?: boolean;
  blurTarget?: RefObject<View | null>;
  revealProgress?: SharedValue<number>;
  revealRange?: readonly [number, number];
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
  tintColor = theme.colors.authSurface,
  interactive = false,
  blurTarget,
  revealProgress,
  revealRange = [0, 1],
}: GlassSurfaceProps) => {
  const revealStyle = useAnimatedStyle(() => ({
    opacity: revealProgress
      ? interpolate(
          revealProgress.get(),
          revealRange,
          [0, 1],
          Extrapolation.CLAMP,
        )
      : 1,
  }));

  if (supportsLiquidGlass && !revealProgress) {
    return (
      <GlassView
        glassEffectStyle="regular"
        colorScheme="dark"
        tintColor={tintColor}
        isInteractive={interactive}
        style={style}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <View style={style}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, revealStyle]}
      >
        <BlurView
          intensity={intensity}
          tint="dark"
          blurMethod={blurTarget ? "dimezisBlurViewSdk31Plus" : "none"}
          blurTarget={blurTarget}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[styles.fallbackTint, { backgroundColor: fallbackTint }]}
        />
      </Animated.View>
      {children}
    </View>
  );
};

export default GlassSurface;

const styles = StyleSheet.create({
  fallbackTint: StyleSheet.absoluteFill,
});
