import { theme } from "@/src/theme";
import { useId } from "react";
import { StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from "react-native-svg";

/**
 * `dashboard` is reserved for high-level product summaries.
 * `content` is used by lists, details, forms and confirmations.
 */
export type AppBackgroundVariant = "dashboard" | "content";

interface AppBackgroundProps {
  variant?: AppBackgroundVariant;
}

const AppBackground = ({ variant = "content" }: AppBackgroundProps) => {
  const isDashboard = variant === "dashboard";
  const instanceId = useId().replace(/:/g, "");
  const id = `app-background-${variant}-${instanceId}`;

  return (
    <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="none" style={styles.background} accessible={false}>
      <Defs>
        <LinearGradient id={`${id}-base`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={theme.colors.backgroundAlt} />
          <Stop offset={isDashboard ? "46%" : "38%"} stopColor={theme.colors.appCanvas} />
          <Stop offset="100%" stopColor={theme.colors.appCanvas} />
        </LinearGradient>
        {isDashboard ? (
          <RadialGradient id={`${id}-ambient`} cx="72%" cy="32%" rx="58%" ry="52%">
            <Stop offset="0%" stopColor={theme.colors.cobalt} stopOpacity={0.16} />
            <Stop offset="45%" stopColor={theme.colors.electricBlue} stopOpacity={0.055} />
            <Stop offset="100%" stopColor={theme.colors.black} stopOpacity={0} />
          </RadialGradient>
        ) : (
          <RadialGradient id={`${id}-ambient`} cx="72%" cy="32%" rx="58%" ry="52%">
            <Stop offset="0%" stopColor={theme.colors.cobalt} stopOpacity={0.09} />
            <Stop offset="45%" stopColor={theme.colors.electricBlue} stopOpacity={0.025} />
            <Stop offset="100%" stopColor={theme.colors.black} stopOpacity={0} />
          </RadialGradient>
        )}
        <LinearGradient id={`${id}-header`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={theme.colors.black} stopOpacity={isDashboard ? 0.88 : 0.92} />
          <Stop offset={isDashboard ? "58%" : "100%"} stopColor={theme.colors.black} stopOpacity={isDashboard ? 0.38 : 0} />
          <Stop offset="100%" stopColor={theme.colors.black} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect width="390" height="844" fill={`url(#${id}-base)`} />
      <Rect width="390" height="844" fill={`url(#${id}-ambient)`} />
      <Rect width="390" height={isDashboard ? 190 : 185} fill={`url(#${id}-header)`} />
    </Svg>
  );
};

export default AppBackground;

const styles = StyleSheet.create({ background: { ...StyleSheet.absoluteFillObject } });
