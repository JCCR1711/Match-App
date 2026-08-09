import type { ReactNode } from "react";
import { Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

export type AppSurfaceVariant = "neutral" | "blue";

interface AppSurfaceProps {
  children: ReactNode;
  variant?: AppSurfaceVariant;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  onPress?: () => void;
  disabled?: boolean;
}

const AppSurface = ({ children, variant = "neutral", style, accessibilityLabel, onPress, disabled = false }: AppSurfaceProps) => {
  const surfaceStyle = [styles.surface, styles[variant], style];

  if (!onPress) return <View style={surfaceStyle}>{children}</View>;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [surfaceStyle, pressed && !disabled && styles.pressed, disabled && styles.disabled]}
    >
      {children}
    </Pressable>
  );
};

export default AppSurface;

const styles = StyleSheet.create({
  surface: { overflow: "hidden", borderRadius: 26, borderCurve: "continuous" },
  neutral: { backgroundColor: "rgba(255, 255, 255, 0.075)" },
  blue: { backgroundColor: "rgba(36, 124, 255, 0.76)" },
  pressed: { opacity: 0.76, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.5 },
});
