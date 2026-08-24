import { theme } from "@/src/theme";
import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

const SettlementGradientSurface = ({ children, style }: { children?: ReactNode; style?: StyleProp<ViewStyle> }) => (
  <LinearGradient
    colors={[theme.colors.businessBlueSurface, theme.colors.authBlueDeep, theme.colors.cobalt]}
    locations={[0, 0.58, 1]}
    start={{ x: 0, y: 1 }}
    end={{ x: 1, y: 0 }}
    style={style}
  >
    {children}
  </LinearGradient>
);

export default SettlementGradientSurface;
