import { theme } from "@/src/theme";
import { StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

type VenueBackgroundVariant = "default" | "venue" | "field";

interface VenueSetupBackgroundProps { variant?: VenueBackgroundVariant }

const VenueSetupBackground = ({ variant = "default" }: VenueSetupBackgroundProps) => {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="none" style={styles.background} accessible={false}>
      <Defs>
        <LinearGradient id={`venueBase-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={theme.colors.backgroundAlt} />
          <Stop offset="34%" stopColor={theme.colors.black} />
          <Stop offset="100%" stopColor={theme.colors.black} />
        </LinearGradient>
        <LinearGradient id={`venueLowerGlow-${variant}`} x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0%" stopColor={theme.colors.surfaceAlt} stopOpacity={0.18} />
          <Stop offset="54%" stopColor={theme.colors.surfaceMuted} stopOpacity={0.045} />
          <Stop offset="100%" stopColor={theme.colors.black} stopOpacity={0} />
        </LinearGradient>
        <LinearGradient id={`venueSideGlow-${variant}`} x1="1" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={theme.colors.surfaceAlt} stopOpacity={0.075} />
          <Stop offset="100%" stopColor={theme.colors.black} stopOpacity={0} />
        </LinearGradient>
        <LinearGradient id={`venueShield-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={theme.colors.black} stopOpacity={0.92} />
          <Stop offset="100%" stopColor={theme.colors.black} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect width="390" height="844" fill={`url(#venueBase-${variant})`} />
      <Rect width="390" height="844" fill={`url(#venueLowerGlow-${variant})`} />
      <Rect width="390" height="844" fill={`url(#venueSideGlow-${variant})`} />
      <Rect width="390" height="185" fill={`url(#venueShield-${variant})`} />
    </Svg>
  );
};

export default VenueSetupBackground;

const styles = StyleSheet.create({ background: { ...StyleSheet.absoluteFillObject } });
