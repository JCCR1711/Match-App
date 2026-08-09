import { theme } from "@/src/theme";
import { StyleSheet } from "react-native";
import Svg, {
  Defs,
  Ellipse,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

interface AuthFlowBackgroundProps {
  flowVariant?:
    | "hero"
    | "email"
    | "verification"
    | "profile"
    | "mode"
    | "legal";
}

const AMBIENT_SCENES = {
  hero: [
    {
      cx: 278,
      cy: 320,
      rx: 270,
      ry: 205,
      primary: theme.colors.authBlueSoft,
      secondary: theme.colors.authBlue,
      opacity: 0.18,
    },
    {
      cx: 24,
      cy: 742,
      rx: 230,
      ry: 205,
      primary: theme.colors.accent,
      secondary: theme.colors.aqua,
      opacity: 0.055,
    },
  ],
  email: [
    {
      cx: 286,
      cy: 238,
      rx: 255,
      ry: 190,
      primary: theme.colors.iceBlue,
      secondary: theme.colors.authBlue,
      opacity: 0.17,
    },
    {
      cx: 68,
      cy: 704,
      rx: 235,
      ry: 210,
      primary: theme.colors.accent,
      secondary: theme.colors.aqua,
      opacity: 0.055,
    },
  ],
  verification: [
    {
      cx: 34,
      cy: 176,
      rx: 278,
      ry: 205,
      primary: theme.colors.electricViolet,
      secondary: theme.colors.authBlueSoft,
      opacity: 0.16,
    },
    {
      cx: 372,
      cy: 548,
      rx: 248,
      ry: 220,
      primary: theme.colors.accent,
      secondary: theme.colors.aqua,
      opacity: 0.05,
    },
  ],
  profile: [
    {
      cx: 276,
      cy: 218,
      rx: 255,
      ry: 190,
      primary: theme.colors.aqua,
      secondary: theme.colors.authBlue,
      opacity: 0.16,
    },
    {
      cx: 350,
      cy: 666,
      rx: 235,
      ry: 215,
      primary: theme.colors.accent,
      secondary: theme.colors.aqua,
      opacity: 0.05,
    },
  ],
  mode: [
    {
      cx: 292,
      cy: 248,
      rx: 270,
      ry: 205,
      primary: theme.colors.authBlueSoft,
      secondary: theme.colors.authBlue,
      opacity: 0.16,
    },
    {
      cx: 24,
      cy: 690,
      rx: 230,
      ry: 205,
      primary: theme.colors.aqua,
      secondary: theme.colors.accent,
      opacity: 0.045,
    },
  ],
  legal: [
    {
      cx: 272,
      cy: 192,
      rx: 250,
      ry: 180,
      primary: theme.colors.premiumIndigo,
      secondary: theme.colors.authBlueSoft,
      opacity: 0.08,
    },
    {
      cx: 42,
      cy: 666,
      rx: 225,
      ry: 205,
      primary: theme.colors.accent,
      secondary: theme.colors.aqua,
      opacity: 0.025,
    },
  ],
} as const;

const AuthFlowBackground = ({
  flowVariant = "hero",
}: AuthFlowBackgroundProps) => {
  const ambientScene = AMBIENT_SCENES[flowVariant];

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
        <LinearGradient id="authBase" x1="8%" y1="0%" x2="92%" y2="100%">
          <Stop offset="0%" stopColor={theme.colors.authCanvasTop} />
          <Stop offset="38%" stopColor={theme.colors.authCanvas} />
          <Stop
            offset="76%"
            stopColor={theme.colors.backgroundAlt}
            stopOpacity={0.72}
          />
          <Stop offset="100%" stopColor={theme.colors.authCanvas} />
        </LinearGradient>
        {ambientScene.map((glow, index) => (
          <RadialGradient
            key={`ambient-gradient-${index}`}
            id={`ambientGlow${index}`}
            cx="50%"
            cy="50%"
            rx="50%"
            ry="50%"
          >
            <Stop
              offset="0%"
              stopColor={glow.primary}
              stopOpacity={glow.opacity * 0.72}
            />
            <Stop
              offset="28%"
              stopColor={glow.primary}
              stopOpacity={glow.opacity * 0.48}
            />
            <Stop
              offset="62%"
              stopColor={glow.secondary}
              stopOpacity={glow.opacity * 0.16}
            />
            <Stop
              offset="100%"
              stopColor={glow.secondary}
              stopOpacity={0}
            />
          </RadialGradient>
        ))}
        <LinearGradient
          id="screenReadability"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <Stop offset="0%" stopColor={theme.colors.black} stopOpacity={0.7} />
          <Stop offset="18%" stopColor={theme.colors.black} stopOpacity={0.56} />
          <Stop offset="38%" stopColor={theme.colors.black} stopOpacity={0.38} />
          <Stop offset="58%" stopColor={theme.colors.black} stopOpacity={0.22} />
          <Stop offset="78%" stopColor={theme.colors.black} stopOpacity={0.09} />
          <Stop offset="100%" stopColor={theme.colors.black} stopOpacity={0} />
        </LinearGradient>
      </Defs>

      <Rect
        width="390"
        height="844"
        fill="url(#authBase)"
      />
      <Rect
        width="390"
        height="844"
        fill="url(#screenReadability)"
      />
      {ambientScene.map((glow, index) => (
        <Ellipse
          key={`ambient-ellipse-${index}`}
          cx={glow.cx}
          cy={glow.cy}
          rx={glow.rx}
          ry={glow.ry}
          fill={`url(#ambientGlow${index})`}
        />
      ))}
    </Svg>
  );
};

export default AuthFlowBackground;

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});
