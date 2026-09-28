import { theme } from "@/src/theme";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useEffect, useState } from "react";
import { type DimensionValue, StyleSheet, View, type ViewStyle, type StyleProp } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface AppSkeletonProps {
  height: number;
  width?: DimensionValue;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

const AppSkeleton = ({ height, width = "100%", radius = theme.radius.large, style }: AppSkeletonProps) => {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const [measuredWidth, setMeasuredWidth] = useState(0);

  useEffect(() => {
    if (reduceMotion || measuredWidth === 0) return;
    progress.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
    return () => cancelAnimation(progress);
  }, [measuredWidth, progress, reduceMotion]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: interpolate(progress.value, [0, 1], [-measuredWidth, measuredWidth]),
    }],
  }));

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={(event) => setMeasuredWidth(event.nativeEvent.layout.width)}
      style={[styles.container, { width, height, borderRadius: radius }, style]}
    >
      {!reduceMotion && measuredWidth > 0 ? (
        <Animated.View style={[styles.shimmer, { width: measuredWidth }, shimmerStyle]}>
          <LinearGradient
            colors={["transparent", theme.colors.surfaceOnDarkSubtle, "transparent"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : null}
    </View>
  );
};

export default memo(AppSkeleton);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: theme.colors.controlSurfaceOnDark,
  },
  shimmer: { ...StyleSheet.absoluteFill },
});
