import AppSurface from "@/src/components/ui/AppSurface";
import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { type StyleProp, StyleSheet, type ViewStyle } from "react-native";

interface AppGradientSurfaceProps {
  children: ReactNode;
  gradientId: string;
  colors: readonly [string, string, ...string[]];
  locations?: readonly [number, number, ...number[]];
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  onPress?: () => void;
}

const AppGradientSurface = ({ children, gradientId, colors, locations, style, accessibilityLabel, onPress }: AppGradientSurfaceProps) => (
  <AppSurface style={style} onPress={onPress} accessibilityLabel={accessibilityLabel}>
    <LinearGradient
      nativeID={gradientId}
      pointerEvents="none"
      colors={colors}
      locations={locations}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={StyleSheet.absoluteFill}
    />
    {children}
  </AppSurface>
);

export default AppGradientSurface;
