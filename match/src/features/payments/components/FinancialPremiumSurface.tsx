import { theme } from "@/src/theme";
import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

interface FinancialPremiumSurfaceProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: "primary" | "secondary";
}

const FinancialPremiumSurface = ({ children, style, tone = "primary" }: FinancialPremiumSurfaceProps) => (
  <LinearGradient
    colors={tone === "primary"
      ? [theme.colors.backgroundAlt, theme.colors.authSurface, theme.colors.appCanvas]
      : [theme.colors.authSurface, theme.colors.surface, theme.colors.backgroundAlt]}
    locations={[0, 0.58, 1]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.surface, style]}
  >
    {children}
  </LinearGradient>
);

export default FinancialPremiumSurface;

const styles = StyleSheet.create({
  surface: {
    overflow: "hidden",
    borderRadius: theme.radius.card,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.controlBorderOnDark,
  },
});
