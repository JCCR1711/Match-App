import { theme } from "@/src/theme";
import { StyleSheet } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

const DashboardBackground = () => (
  <Svg
    width="100%"
    height="100%"
    viewBox="0 0 390 844"
    preserveAspectRatio="none"
    style={styles.background}
    accessible={false}
  >
    <Defs>
      <LinearGradient id="dashboardBase" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor={theme.colors.backgroundAlt} />
        <Stop offset="42%" stopColor={theme.colors.black} />
        <Stop offset="100%" stopColor={theme.colors.black} />
      </LinearGradient>
      <RadialGradient id="dashboardSilver" cx="50%" cy="50%" rx="50%" ry="50%">
        <Stop offset="0%" stopColor={theme.colors.surfaceAlt} stopOpacity={0.13} />
        <Stop offset="52%" stopColor={theme.colors.surfaceMuted} stopOpacity={0.045} />
        <Stop offset="100%" stopColor={theme.colors.black} stopOpacity={0} />
      </RadialGradient>
      <LinearGradient id="dashboardHeaderShield" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor={theme.colors.black} stopOpacity={0.88} />
        <Stop offset="58%" stopColor={theme.colors.black} stopOpacity={0.38} />
        <Stop offset="100%" stopColor={theme.colors.black} stopOpacity={0} />
      </LinearGradient>
    </Defs>
    <Rect width="390" height="844" fill="url(#dashboardBase)" />
    <Rect x="-220" y="95" width="610" height="560" fill="url(#dashboardSilver)" />
    <Rect width="390" height="190" fill="url(#dashboardHeaderShield)" />
  </Svg>
);

export default DashboardBackground;

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});
