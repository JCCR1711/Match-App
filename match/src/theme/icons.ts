import { colors } from "./colors";

export const iconSizes = {
  xsmall: 16,
  small: 20,
  medium: 24,
  large: 30,
  xlarge: 36,
  xxlarge: 40,
} as const;

export const iconColors = {
  primary: colors.text,
  secondary: colors.textSecondary,
  accent: colors.accent,
  success: colors.success,
  error: colors.error,
  disabled: colors.disabled,
} as const;
