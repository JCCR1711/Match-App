import { theme } from "@/src/theme";
import type { ReactNode } from "react";
import { Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

export type AppSurfaceVariant = "transparent" | "neutral" | "blue";

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

  if (!onPress) {
    return (
      <View
        style={surfaceStyle}
        accessible={Boolean(accessibilityLabel)}
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </View>
    );
  }

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
  surface: { overflow: "hidden", borderRadius: theme.radius.card, borderCurve: "continuous" },
  transparent: { backgroundColor: "transparent" },
  neutral: { backgroundColor: theme.colors.surfaceOnDarkSubtle, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.controlBorderOnDark },
  blue: { backgroundColor: theme.colors.businessBlueSurface },
  pressed: { opacity: 0.76 },
  disabled: { opacity: 0.5 },
});
