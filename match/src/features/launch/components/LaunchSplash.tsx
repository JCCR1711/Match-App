import { theme } from "@/src/theme";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface LaunchSplashProps {
  onComplete: () => void;
}

const BRAND_LETTERS = ["M", "A", "T", "C", "H"] as const;

interface BrandLetterProps {
  letter: (typeof BRAND_LETTERS)[number];
  index: number;
}

const BrandLetter = ({ letter, index }: BrandLetterProps) => (
  <Animated.Text
    entering={FadeInDown.delay(100 + index * 65)
      .duration(460)
      .easing(Easing.out(Easing.cubic))}
    style={styles.brandLetter}
  >
    {letter}
  </Animated.Text>
);

const LaunchSplash = ({ onComplete }: LaunchSplashProps) => {
  const splashOpacity = useSharedValue(1);
  const titleScale = useSharedValue(0.97);

  useEffect(() => {
    titleScale.value = withSpring(1, {
      damping: 16,
      stiffness: 110,
    });
    splashOpacity.value = withDelay(
      1450,
      withTiming(
        0,
        {
          duration: 420,
          easing: Easing.inOut(Easing.cubic),
        },
        (finished) => {
          if (finished) {
            runOnJS(onComplete)();
          }
        },
      ),
    );
  }, [onComplete, splashOpacity, titleScale]);

  const splashAnimatedStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  return (
    <Animated.View
      style={[styles.root, splashAnimatedStyle]}
      accessibilityViewIsModal
    >
      <StatusBar style="light" />
      <View style={styles.brandContainer}>
        <Animated.View
          style={[styles.wordmark, titleAnimatedStyle]}
          accessibilityRole="header"
          accessibilityLabel="MATCH"
        >
          {BRAND_LETTERS.map((letter, index) => (
            <BrandLetter key={letter} letter={letter} index={index} />
          ))}
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default LaunchSplash;

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.black,
  },
  brandContainer: {
    alignItems: "center",
  },
  wordmark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  brandLetter: {
    color: theme.colors.white,
    fontFamily: theme.fontFamilies.outfitSemiBold,
    fontSize: 42,
    lineHeight: 50,
    fontWeight: theme.fontWeights.semibold,
    letterSpacing: 1.2,
  },
});
