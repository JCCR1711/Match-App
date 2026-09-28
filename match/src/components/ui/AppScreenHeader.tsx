import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import GlassSurface from "@/src/components/ui/GlassSurface";
import { COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT, COLLAPSIBLE_HEADER_EXPANDED_HEIGHT, SCROLL_TITLE_HEADER_HEIGHT } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { ArrowDown01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import type { ReactNode, RefObject } from "react";
import { LinearGradient } from "expo-linear-gradient";
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
  contextLabel?: string;
  titleAlign?: "left" | "center";
  titleSize?: "default" | "compact";
  titleMode?: "standard" | "scroll";
  onBack?: () => void;
  backAccessibilityLabel?: string;
  backIconVariant?: "back" | "dismiss";
  action?: ReactNode;
  actionWidth?: number;
  scrollY?: SharedValue<number>;
  glassTint?: string;
  blurTarget?: RefObject<View | null>;
}

const HEADER_TITLE_TOP = 20;
const COMPACT_TITLE_LINE_HEIGHT = 20;
const HEADER_CONTROL_SIZE = 40;
const COLLAPSED_TITLE_OFFSET = HEADER_TITLE_TOP - (COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT - COMPACT_TITLE_LINE_HEIGHT) / 2;
const COLLAPSED_CONTROL_TOP = (COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT - HEADER_CONTROL_SIZE) / 2;

const AppScreenHeader = ({
  title,
  contextLabel,
  titleAlign = "left",
  titleSize = "default",
  titleMode = "standard",
  onBack,
  backAccessibilityLabel = "Volver",
  backIconVariant = "back",
  action,
  actionWidth = 44,
  scrollY: externalScrollY,
  glassTint = "rgba(8, 8, 10, 0.46)",
  blurTarget,
}: AppScreenHeaderProps) => {
  const insets = useSafeAreaInsets();
  const localScrollY = useSharedValue(0);
  const scrollY = externalScrollY ?? localScrollY;
  const usesScrollTitle = titleMode === "scroll";
  const headerHeight = usesScrollTitle ? SCROLL_TITLE_HEADER_HEIGHT : titleSize === "compact" ? COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT : COLLAPSIBLE_HEADER_EXPANDED_HEIGHT;
  const shellStyle = useAnimatedStyle(() => ({
    height: usesScrollTitle
      ? insets.top + SCROLL_TITLE_HEADER_HEIGHT
      : titleSize === "compact"
        ? insets.top + COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT
      : interpolate(
          scrollY.get(),
          [0, 72],
          [insets.top + COLLAPSIBLE_HEADER_EXPANDED_HEIGHT, insets.top + COLLAPSIBLE_HEADER_COLLAPSED_HEIGHT],
          Extrapolation.CLAMP,
        ),
  }));
  const titleStyle = useAnimatedStyle(() => ({
    fontSize: titleSize === "compact" ? 16 : interpolate(scrollY.get(), [0, 72], [22, 16], Extrapolation.CLAMP),
    lineHeight: titleSize === "compact" ? COMPACT_TITLE_LINE_HEIGHT : interpolate(scrollY.get(), [0, 72], [28, COMPACT_TITLE_LINE_HEIGHT], Extrapolation.CLAMP),
    transform: [{
      translateY: titleSize === "compact"
        ? -COLLAPSED_TITLE_OFFSET
        : interpolate(
            scrollY.get(),
            [0, 72],
            [0, -(COLLAPSED_TITLE_OFFSET + (contextLabel ? 4 : 0))],
            Extrapolation.CLAMP,
          ),
    }],
  }));
  const contextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.get(), [0, 34], [1, 0], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(scrollY.get(), [0, 34], [0, -5], Extrapolation.CLAMP) }],
  }));
  const actionStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: titleSize === "compact" || usesScrollTitle
        ? 0
        : interpolate(scrollY.get(), [0, 72], [10, 0], Extrapolation.CLAMP),
    }],
  }));
  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.shell,
        { height: insets.top + headerHeight },
        shellStyle,
      ]}
    >
      <View pointerEvents="none" style={[styles.gradient, { height: insets.top + headerHeight }]}>
        <LinearGradient
          colors={[`${theme.colors.black}C8`, `${theme.colors.black}60`, `${theme.colors.black}00`]}
          locations={[0, 0.5, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <GlassSurface
        intensity={70}
        fallbackTint={glassTint}
        tintColor={glassTint}
        blurTarget={blurTarget}
        revealProgress={scrollY}
        revealRange={[4, 40]}
        style={[styles.glass, { height: insets.top + headerHeight }]}
      >
        <View />
      </GlassSurface>
      <View style={[styles.container, { height: insets.top + headerHeight, paddingTop: insets.top }]}>
        <View style={[styles.content, { height: headerHeight }]}>
        <View style={[styles.side, usesScrollTitle && styles.scrollSide]}>
          {onBack ? (
            <CustomButton
              icon={<CustomIcon icon={backIconVariant === "dismiss" ? ArrowDown01Icon : ArrowLeft01Icon} color={theme.colors.white} size={23} strokeWidth={3} />}
              size="icon"
              variant="inverse"
              onPress={onBack}
              hitSlop={4}
              style={[styles.backButton, usesScrollTitle && styles.scrollBackButton]}
              accessibilityLabel={backAccessibilityLabel}
            />
          ) : null}
        </View>
        {contextLabel && titleSize !== "compact" && !usesScrollTitle ? (
          <AnimatedCustomText
            text={contextLabel}
            variant="caption"
            style={[styles.contextLabel, Boolean(onBack) && styles.titleWithBack, Boolean(action) && styles.titleWithAction, titleAlign === "center" && styles.titleCentered, contextStyle]}
            numberOfLines={1}
          />
        ) : null}
        {usesScrollTitle && title ? (
          <View pointerEvents="none" style={styles.scrollTitleContainer}>
            <CustomText text={title} variant="body" style={styles.scrollTitle} numberOfLines={1} />
          </View>
        ) : title ? <AnimatedCustomText text={title} variant="body" style={[styles.title, Boolean(contextLabel) && styles.titleWithContext, Boolean(onBack) && styles.titleWithBack, Boolean(action) && titleAlign !== "center" && { right: actionWidth + theme.spacing.lg }, Boolean(action) && titleAlign === "center" && styles.titleWithAction, titleAlign === "center" && styles.titleCentered, titleStyle]} numberOfLines={1} /> : null}
        <Animated.View style={[styles.side, usesScrollTitle && styles.scrollSide, styles.action, { width: actionWidth }, actionStyle]}>{action}</Animated.View>
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
  container: { zIndex: 10, elevation: 10 },
  gradient: { ...StyleSheet.absoluteFill, overflow: "hidden" },
  glass: { ...StyleSheet.absoluteFill, overflow: "hidden" },
  content: {
    height: COLLAPSIBLE_HEADER_EXPANDED_HEIGHT,
    paddingHorizontal: theme.spacing.md,
  },
  side: { position: "absolute", top: COLLAPSED_CONTROL_TOP, left: theme.spacing.sm, width: 44 },
  scrollSide: { top: 0 },
  action: { left: undefined, right: theme.spacing.sm, alignItems: "flex-end" },
  title: {
    position: "absolute",
    top: HEADER_TITLE_TOP,
    right: theme.spacing.lg,
    left: theme.spacing.lg,
    color: theme.colors.white,
    textAlign: "left",
    fontFamily: theme.fontFamilies.poppinsBold,
    fontWeight: theme.fontWeights.bold,
    letterSpacing: -0.35,
  },
  titleWithContext: { top: 24 },
  contextLabel: {
    position: "absolute",
    top: 5,
    right: theme.spacing.lg,
    left: theme.spacing.lg,
    color: theme.colors.authTextSecondary,
    textAlign: "left",
  },
  titleWithBack: { left: 64 },
  titleWithAction: { right: 64 },
  titleCentered: { right: 64, left: 64, textAlign: "center" },
  scrollTitleContainer: { position: "absolute", top: 8, right: 64, left: 64, zIndex: 1, elevation: 1, height: COMPACT_TITLE_LINE_HEIGHT, alignItems: "center", justifyContent: "center" },
  scrollTitle: { color: theme.colors.white, textAlign: "center", fontFamily: theme.fontFamilies.poppinsBold, fontSize: 16, lineHeight: COMPACT_TITLE_LINE_HEIGHT, fontWeight: theme.fontWeights.bold, letterSpacing: -0.35 },
  backButton: {
    width: HEADER_CONTROL_SIZE,
    minHeight: HEADER_CONTROL_SIZE,
    height: HEADER_CONTROL_SIZE,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  scrollBackButton: { width: SCROLL_TITLE_HEADER_HEIGHT, minHeight: SCROLL_TITLE_HEADER_HEIGHT, height: SCROLL_TITLE_HEADER_HEIGHT },
});
