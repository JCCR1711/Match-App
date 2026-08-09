import type { CartesianChartTheme } from "react-native-chart-kit/v2";

import { colors } from "./colors";
import { fontFamilies } from "./typography";

export const createLineChartTheme = (accent: string): CartesianChartTheme => ({
  background: "transparent",
  plotBackground: "transparent",
  grid: "transparent",
  axis: "transparent",
  text: colors.authTextSecondary,
  mutedText: colors.authTextSecondary,
  series: [accent],
  typography: {
    fontFamily: fontFamilies.outfitSemiBold,
    axisLabelSize: 11,
  },
});
