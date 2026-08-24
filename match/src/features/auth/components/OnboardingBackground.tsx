import { theme } from "@/src/theme";
import { StyleSheet } from "react-native";
import Svg, { Defs, Ellipse, LinearGradient, RadialGradient, Rect, Stop } from "react-native-svg";

const OnboardingBackground = () => {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 390 844"
      preserveAspectRatio="none"
      style={styles.background}
      accessible={false}
    >
      <Defs>
        <LinearGradient id="canvas" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={theme.colors.black} />
          <Stop offset="52%" stopColor={theme.colors.onboardingCanvasDeep} />
          <Stop offset="100%" stopColor={theme.colors.black} />
        </LinearGradient>
        <RadialGradient id="heroGlow" cx="50%" cy="44%" rx="50%" ry="50%">
          <Stop offset="0%" stopColor={theme.colors.authBlueSoft} stopOpacity={0.38} />
          <Stop offset="42%" stopColor={theme.colors.authBlue} stopOpacity={0.2} />
          <Stop offset="100%" stopColor={theme.colors.black} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="accentGlow" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0%" stopColor={theme.colors.accent} stopOpacity={0.18} />
          <Stop offset="46%" stopColor={theme.colors.aqua} stopOpacity={0.07} />
          <Stop offset="100%" stopColor={theme.colors.black} stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id="vignette" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={theme.colors.black} stopOpacity={0.54} />
          <Stop offset="20%" stopColor={theme.colors.black} stopOpacity={0.04} />
          <Stop offset="58%" stopColor={theme.colors.black} stopOpacity={0.02} />
          <Stop offset="100%" stopColor={theme.colors.black} stopOpacity={0.9} />
        </LinearGradient>
      </Defs>
      <Rect width="390" height="844" fill="url(#canvas)" />
      <Ellipse cx="190" cy="310" rx="320" ry="330" fill="url(#heroGlow)" />
      <Ellipse cx="386" cy="180" rx="180" ry="230" fill="url(#accentGlow)" />
      <Rect width="390" height="844" fill="url(#vignette)" />
    </Svg>
  );
};

export default OnboardingBackground;

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});
