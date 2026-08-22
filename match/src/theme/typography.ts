import { TextStyle } from "react-native";

export const fontFamilies = {
  outfitSemiBold: "Outfit_600SemiBold",
  poppinsBold: "Poppins_700Bold",
} as const;

export const fontWeights = {
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extraBold: "800",
} as const;

export const fontSizes = {
  display: 40,
  heading: 28,
  subtitle: 20,
  body: 16,
  caption: 14,
  label: 12,
  button: 16,
  textAction: 15,
} as const;

export const lineHeights = {
  display: 48,
  heading: 36,
  subtitle: 24,
  body: 24,
  caption: 18,
  label: 16,
  textAction: 20,
} as const;

export const letterSpacings = {
  normal: 0,
  button: 0.5,
  tight: -0.2,
} as const;

const display: TextStyle = {
  fontFamily: fontFamilies.poppinsBold,
  fontSize: 48,
  lineHeight: 56,
  letterSpacing: -1,
  fontWeight: fontWeights.bold,
};

const heading: TextStyle = {
  fontFamily: fontFamilies.poppinsBold,
  fontSize: 32,
  lineHeight: 40,
  letterSpacing: -0.8,
  fontWeight: fontWeights.bold,
};

const subtitle: TextStyle = {
  fontFamily: fontFamilies.poppinsBold,
  fontSize: 22,
  lineHeight: 28,
  letterSpacing: -0.3,
  fontWeight: fontWeights.bold,
};

const body: TextStyle = {
  fontFamily: fontFamilies.outfitSemiBold,
  fontSize: fontSizes.body,
  lineHeight: lineHeights.body,
  letterSpacing: letterSpacings.normal,
  fontWeight: fontWeights.semibold,
};

const bodyStrong: TextStyle = {
  fontFamily: fontFamilies.outfitSemiBold,
  fontSize: fontSizes.body,
  lineHeight: lineHeights.body,
  letterSpacing: letterSpacings.normal,
  fontWeight: fontWeights.semibold,
};

const caption: TextStyle = {
  fontFamily: fontFamilies.outfitSemiBold,
  fontSize: fontSizes.caption,
  lineHeight: lineHeights.caption,
  letterSpacing: letterSpacings.normal,
  fontWeight: fontWeights.semibold,
};

const button: TextStyle = {
  fontFamily: fontFamilies.outfitSemiBold,
  fontSize: fontSizes.button,
  lineHeight: lineHeights.label,
  letterSpacing: letterSpacings.button,
  fontWeight: fontWeights.semibold,
};

const label: TextStyle = {
  fontFamily: fontFamilies.outfitSemiBold,
  fontSize: fontSizes.label,
  lineHeight: lineHeights.label,
  letterSpacing: letterSpacings.normal,
  fontWeight: fontWeights.semibold,
};

const screenTitle: TextStyle = {
  fontFamily: fontFamilies.poppinsBold,
  fontSize: 36,
  lineHeight: 46,
  letterSpacing: -0.6,
  fontWeight: fontWeights.bold,
};

const heroTitle: TextStyle = {
  fontFamily: fontFamilies.poppinsBold,
  fontSize: 32,
  lineHeight: 42,
  letterSpacing: -0.5,
  fontWeight: fontWeights.bold,
};

const action: TextStyle = {
  fontFamily: fontFamilies.poppinsBold,
  fontSize: 18,
  lineHeight: 24,
  fontWeight: fontWeights.bold,
};

const sectionHeading: TextStyle = {
  fontFamily: fontFamilies.poppinsBold,
  fontSize: 19,
  lineHeight: 26,
  fontWeight: fontWeights.bold,
};

const actionSecondary: TextStyle = {
  fontFamily: fontFamilies.poppinsBold,
  fontSize: fontSizes.textAction,
  lineHeight: lineHeights.textAction,
  fontWeight: fontWeights.bold,
};

const codeDigit: TextStyle = {
  fontFamily: fontFamilies.poppinsBold,
  fontSize: 22,
  lineHeight: 30,
  fontWeight: fontWeights.bold,
};

const input: TextStyle = {
  fontFamily: fontFamilies.poppinsBold,
  fontSize: fontSizes.body,
  lineHeight: lineHeights.body,
  fontWeight: fontWeights.bold,
};

export const typography: {
  display: TextStyle;
  heading: TextStyle;
  subtitle: TextStyle;
  body: TextStyle;
  bodyStrong: TextStyle;
  caption: TextStyle;
  label: TextStyle;
  button: TextStyle;
  screenTitle: TextStyle;
  heroTitle: TextStyle;
  action: TextStyle;
  sectionHeading: TextStyle;
  actionSecondary: TextStyle;
  codeDigit: TextStyle;
  input: TextStyle;
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
} = {
  display,
  heading,
  subtitle,
  body,
  bodyStrong,
  caption,
  label,
  button,
  screenTitle,
  heroTitle,
  action,
  sectionHeading,
  actionSecondary,
  codeDigit,
  input,
  h1: display,
  h2: heading,
  h3: subtitle,
};
