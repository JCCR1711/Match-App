import { theme } from "@/src/theme";
import { useId } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from "react-native-svg";

/**
 * `dashboard` is reserved for high-level product summaries.
 * `content` is used by lists, details, forms and confirmations.
 */
export type AppBackgroundVariant = "dashboard" | "content" | "solid";

interface AppBackgroundProps {
  variant?: AppBackgroundVariant;
}

const AppBackground = ({ variant = "content" }: AppBackgroundProps) => {
  const instanceId = useId().replace(/:/g, "");
  if (variant === "solid") return <View style={[styles.background, styles.solid]} />;

  const id = `app-background-${variant}-${instanceId}`;

  if (variant === "dashboard") {
    return (
      <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="none" style={styles.background} accessible={false}>
        <Defs>
          <LinearGradient id={`${id}-base`} x1="0" y1="0" x2="0.82" y2="1">
            <Stop offset="0%" stopColor={theme.colors.surface} stopOpacity={0.72} />
            <Stop offset="34%" stopColor={theme.colors.backgroundAlt} stopOpacity={0.86} />
            <Stop offset="100%" stopColor={theme.colors.black} />
          </LinearGradient>
          <LinearGradient id={`${id}-light`} x1="1" y1="0" x2="0.08" y2="0.76">
            <Stop offset="0%" stopColor={theme.colors.surfaceMuted} stopOpacity={0.2} />
            <Stop offset="42%" stopColor={theme.colors.surface} stopOpacity={0.08} />
            <Stop offset="100%" stopColor={theme.colors.black} stopOpacity={0} />
          </LinearGradient>
          <LinearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="38%" stopColor={theme.colors.black} stopOpacity={0} />
            <Stop offset="76%" stopColor={theme.colors.black} stopOpacity={0.44} />
            <Stop offset="100%" stopColor={theme.colors.black} stopOpacity={0.82} />
          </LinearGradient>
        </Defs>
        <Rect width="390" height="844" fill={`url(#${id}-base)`} />
        <Rect width="390" height="560" fill={`url(#${id}-light)`} />
        <Rect width="390" height="844" fill={`url(#${id}-fade)`} />
      </Svg>
    );
  }

  return (
    <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="none" style={styles.background} accessible={false}>
      <Defs>
        <LinearGradient id={`${id}-base`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={theme.colors.backgroundAlt} />
          <Stop offset="38%" stopColor={theme.colors.appCanvas} />
          <Stop offset="100%" stopColor={theme.colors.appCanvas} />
        </LinearGradient>
        <RadialGradient id={`${id}-ambient`} cx="72%" cy="32%" rx="58%" ry="52%">
          <Stop offset="0%" stopColor={theme.colors.cobalt} stopOpacity={0.09} />
          <Stop offset="45%" stopColor={theme.colors.electricBlue} stopOpacity={0.025} />
          <Stop offset="100%" stopColor={theme.colors.black} stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id={`${id}-header`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={theme.colors.black} stopOpacity={0.92} />
          <Stop offset="100%" stopColor={theme.colors.black} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect width="390" height="844" fill={`url(#${id}-base)`} />
      <Rect width="390" height="844" fill={`url(#${id}-ambient)`} />
      <Rect width="390" height={185} fill={`url(#${id}-header)`} />
    </Svg>
  );
};

export default AppBackground;

const styles = StyleSheet.create({
  background: { ...StyleSheet.absoluteFillObject },
  solid: { backgroundColor: theme.colors.background },
});
