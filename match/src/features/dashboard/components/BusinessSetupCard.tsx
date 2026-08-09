import CustomIcon from "@/src/components/ui/CustomIcon";
import AppSurface from "@/src/components/ui/AppSurface";
import { theme } from "@/src/theme";
import { Image } from "expo-image";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { StyleSheet, Text, View } from "react-native";

const setupHero = require("@/src/assets/Omboarding/match3.png");

export type BusinessSetupKind = "venue" | "field" | "availability";

interface BusinessSetupCardProps {
  kind: BusinessSetupKind;
  title: string;
  accessibilityLabel: string;
  onPress: () => void;
}

const BusinessSetupCard = ({
  title,
  accessibilityLabel,
  onPress,
}: BusinessSetupCardProps) => (
  <AppSurface
    variant="blue"
    onPress={onPress}
    accessibilityLabel={accessibilityLabel}
    style={styles.card}
  >
    <Svg
      pointerEvents="none"
      width="100%"
      height="100%"
      viewBox="0 0 360 232"
      preserveAspectRatio="xMidYMid slice"
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <LinearGradient id="businessSetupBlue" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor={theme.colors.authBlueDeep} />
          <Stop offset="0.54" stopColor={theme.colors.authBlue} />
          <Stop offset="1" stopColor={theme.colors.authBlueSoft} />
        </LinearGradient>
      </Defs>
      <Rect width="360" height="232" fill="url(#businessSetupBlue)" />
    </Svg>
    <Image
      source={setupHero}
      contentFit="contain"
      contentPosition="bottom right"
      transition={180}
      accessible={false}
      style={styles.heroImage}
    />
    <View style={styles.content}>
      <View style={styles.footer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.action}>
          <CustomIcon
            icon={ArrowRight01Icon}
            color={theme.colors.black}
            size={24}
            strokeWidth={2.5}
          />
        </View>
      </View>
    </View>
  </AppSurface>
);

export default BusinessSetupCard;

const styles = StyleSheet.create({
  card: {
    minHeight: 232,
  },
  content: {
    flex: 1,
    minHeight: 232,
    justifyContent: "flex-end",
    padding: theme.spacing.xxl,
  },
  heroImage: {
    position: "absolute",
    right: -30,
    bottom: -14,
    width: 224,
    height: 246,
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: theme.spacing.xl,
  },
  title: {
    flex: 1,
    maxWidth: 170,
    color: theme.colors.white,
    fontFamily: theme.fontFamilies.poppinsBold,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: theme.fontWeights.bold,
  },
  action: {
    zIndex: 2,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: theme.colors.white,
  },
});
