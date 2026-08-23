import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import GlassSurface from "@/src/components/ui/GlassSurface";
import { COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT, COLLAPSIBLE_HEADER_EXPANDED_HEIGHT } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AppScreenHeaderProps {
  title: string;
  onBack?: () => void;
  backAccessibilityLabel?: string;
  action?: ReactNode;
  scrollY?: SharedValue<number>;
  glassTint?: string;
}

const AppScreenHeader = ({
  title,
  onBack,
  backAccessibilityLabel = "Volver",
  action,
  scrollY: externalScrollY,
  glassTint = "rgba(8, 8, 10, 0.72)",
}: AppScreenHeaderProps) => {
  const insets = useSafeAreaInsets();
  const localScrollY = useSharedValue(0);
  const scrollY = externalScrollY ?? localScrollY;
  const shellStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, 72],
      [insets.top + COLLAPSIBLE_HEADER_EXPANDED_HEIGHT, insets.top + COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT],
      Extrapolation.CLAMP,
    ),
  }));
  const titleStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(scrollY.value, [0, 72], [22, 16], Extrapolation.CLAMP),
    lineHeight: interpolate(scrollY.value, [0, 72], [28, 20], Extrapolation.CLAMP),
    transform: [
      {
        translateX: interpolate(scrollY.value, [0, 72], [0, onBack ? 48 : 0], Extrapolation.CLAMP),
      },
      {
        translateY: interpolate(scrollY.value, [0, 72], [0, -14], Extrapolation.CLAMP),
      },
    ],
  }));
  const glassStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [4, 40], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.shell,
        { height: insets.top + COLLAPSIBLE_HEADER_EXPANDED_HEIGHT },
        shellStyle,
      ]}
    >
      <Animated.View pointerEvents="none" style={[styles.glass, { height: insets.top + COLLAPSIBLE_HEADER_EXPANDED_HEIGHT }, glassStyle]}>
        <GlassSurface intensity={58} fallbackTint={glassTint} tintColor={glassTint} style={StyleSheet.absoluteFill}>
          <View />
        </GlassSurface>
      </Animated.View>
      <View style={[styles.container, { height: insets.top + COLLAPSIBLE_HEADER_EXPANDED_HEIGHT, paddingTop: insets.top }]}>
        <View style={styles.content}>
        <View style={styles.side}>
          {onBack ? (
            <CustomButton
              icon={<CustomIcon icon={ArrowLeft01Icon} color={theme.colors.white} size={23} />}
              size="icon"
              variant="inverse"
              onPress={onBack}
              hitSlop={4}
              style={styles.backButton}
              accessibilityLabel={backAccessibilityLabel}
            />
          ) : null}
        </View>
        <AnimatedCustomText text={title} variant="body" style={[styles.title, titleStyle]} numberOfLines={1} />
        <View style={[styles.side, styles.action]}>{action}</View>
        </View>
      </View>
    </Animated.View>
  );
};

const AnimatedCustomText = Animated.createAnimatedComponent(CustomText);

export default AppScreenHeader;

const styles = StyleSheet.create({
  shell: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    overflow: "hidden",
    zIndex: 10,
  },
  container: {
    zIndex: 10,
  },
  glass: { ...StyleSheet.absoluteFillObject, overflow: "hidden" },
  content: {
    height: COLLAPSIBLE_HEADER_EXPANDED_HEIGHT,
    paddingHorizontal: theme.spacing.md,
  },
  side: { position: "absolute", top: 0, left: theme.spacing.sm, width: 44 },
  action: { left: undefined, right: theme.spacing.sm, alignItems: "flex-end" },
  title: {
    position: "absolute",
    top: 24,
    right: theme.spacing.lg,
    left: theme.spacing.lg,
    color: theme.colors.white,
    textAlign: "left",
    fontFamily: theme.fontFamilies.poppinsBold,
    fontWeight: theme.fontWeights.bold,
    letterSpacing: -0.35,
  },
  backButton: {
    width: 40,
    minHeight: 40,
    height: 40,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
});
