import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import GlassSurface from "@/src/components/ui/GlassSurface";
import { COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT, COLLAPSIBLE_HEADER_EXPANDED_HEIGHT } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { ArrowDown01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
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
  titleAlign?: "left" | "center";
  titleSize?: "default" | "compact";
  titleMode?: "standard" | "scroll";
  onBack?: () => void;
  backAccessibilityLabel?: string;
  backIconVariant?: "back" | "dismiss";
  action?: ReactNode;
  scrollY?: SharedValue<number>;
  glassTint?: string;
}

const AppScreenHeader = ({
  title,
  titleAlign = "left",
  titleSize = "default",
  titleMode = "standard",
  onBack,
  backAccessibilityLabel = "Volver",
  backIconVariant = "back",
  action,
  scrollY: externalScrollY,
  glassTint = "rgba(8, 8, 10, 0.72)",
}: AppScreenHeaderProps) => {
  const insets = useSafeAreaInsets();
  const localScrollY = useSharedValue(0);
  const scrollY = externalScrollY ?? localScrollY;
  const usesScrollTitle = titleMode === "scroll";
  const shellStyle = useAnimatedStyle(() => ({
    height: titleSize === "compact" || usesScrollTitle
      ? insets.top + COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT
      : interpolate(
          scrollY.value,
          [0, 72],
          [insets.top + COLLAPSIBLE_HEADER_EXPANDED_HEIGHT, insets.top + COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT],
          Extrapolation.CLAMP,
        ),
  }));
  const collapsedTitleOffset = COLLAPSIBLE_HEADER_EXPANDED_HEIGHT - COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT;
  const titleStyle = useAnimatedStyle(() => ({
    fontSize: titleSize === "compact" ? 16 : interpolate(scrollY.value, [0, 72], [22, 16], Extrapolation.CLAMP),
    lineHeight: titleSize === "compact" ? 20 : interpolate(scrollY.value, [0, 72], [28, 20], Extrapolation.CLAMP),
    transform: [{
      translateY: titleSize === "compact"
        ? -collapsedTitleOffset
        : interpolate(scrollY.value, [0, 72], [0, -collapsedTitleOffset], Extrapolation.CLAMP),
    }],
  }));
  const glassStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [4, 40], [0, 1], Extrapolation.CLAMP),
  }));
  const scrollTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [20, 56], [0, 1], Extrapolation.CLAMP),
  }));
  const actionStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: titleSize === "compact" || usesScrollTitle
        ? 0
        : interpolate(scrollY.value, [0, 72], [16, 0], Extrapolation.CLAMP),
    }],
  }));
  const headerHeight = titleSize === "compact" || usesScrollTitle ? COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT : COLLAPSIBLE_HEADER_EXPANDED_HEIGHT;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.shell,
        { height: insets.top + headerHeight },
        shellStyle,
      ]}
    >
      <Animated.View pointerEvents="none" style={[styles.glass, { height: insets.top + headerHeight }, glassStyle]}>
        <GlassSurface intensity={58} fallbackTint={glassTint} tintColor={glassTint} style={StyleSheet.absoluteFill}>
          <View />
        </GlassSurface>
      </Animated.View>
      <View style={[styles.container, { height: insets.top + headerHeight, paddingTop: insets.top }]}>
        <View style={[styles.content, { height: headerHeight }]}>
        <View style={styles.side}>
          {onBack ? (
            <CustomButton
              icon={<CustomIcon icon={backIconVariant === "dismiss" ? ArrowDown01Icon : ArrowLeft01Icon} color={theme.colors.white} size={23} strokeWidth={3} />}
              size="icon"
              variant="inverse"
              onPress={onBack}
              hitSlop={4}
              style={styles.backButton}
              accessibilityLabel={backAccessibilityLabel}
            />
          ) : null}
        </View>
        {title ? <AnimatedCustomText text={title} variant="body" importantForAccessibility={usesScrollTitle ? "no" : "auto"} style={[styles.title, Boolean(onBack) && !usesScrollTitle && styles.titleWithBack, Boolean(action) && !usesScrollTitle && styles.titleWithAction, (titleAlign === "center" || usesScrollTitle) && styles.titleCentered, usesScrollTitle ? styles.scrollHeaderTitle : titleStyle, usesScrollTitle && scrollTitleStyle]} numberOfLines={1} /> : null}
        <Animated.View style={[styles.side, styles.action, actionStyle]}>{action}</Animated.View>
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
  titleWithBack: { left: 64 },
  titleWithAction: { right: 64 },
  titleCentered: { right: 64, left: 64, textAlign: "center" },
  scrollHeaderTitle: { top: 12, fontSize: 16, lineHeight: 20 },
  backButton: {
    width: 40,
    minHeight: 40,
    height: 40,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
});
