import { colors } from "./colors";

export const metricAccentColors = [
  colors.sunsetOrange,
  colors.warmAmber,
  colors.softCoral,
  colors.accent,
] as const;

export const payoutBankPalettes = {
  BCP: {
    gradient: ["#00245F", "#004A9F", "#0872C9"] as const,
    accent: "#B9DEFF",
    onAccent: "#00336F",
  },
  BBVA: {
    gradient: ["#061F5C", "#004481", "#1973B8"] as const,
    accent: "#A9DDFF",
    onAccent: "#072B61",
  },
  Interbank: {
    gradient: ["#07533F", "#087657", "#0B956A"] as const,
    accent: "#C5F4DC",
    onAccent: "#07513C",
  },
  Scotiabank: {
    gradient: ["#760019", "#AD0B32", "#D9254B"] as const,
    accent: "#FFD0D9",
    onAccent: "#7A0822",
  },
} as const;

export const payoutBankFallbackPalette = {
  gradient: ["#263449", "#40546F", "#607693"] as const,
  accent: colors.authPrimary,
  onAccent: "#2B3B50",
} as const;
