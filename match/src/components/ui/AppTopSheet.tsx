import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { useEffect, type ReactNode } from "react";
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

interface AppTopSheetProps {
  visible: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  height?: number;
  onClose: () => void;
}

const REST_SPRING = { damping: 25, stiffness: 280, mass: 0.78, overshootClamping: true } as const;

const AppTopSheet = ({ visible, title, children, footer, height = 300, onClose }: AppTopSheetProps) => {
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentHeight = Math.max(height, 320);
  const sheetHeight = Math.min(contentHeight + insets.top, windowHeight - Math.max(insets.bottom, theme.spacing.lg));
  const translateY = useSharedValue(-sheetHeight);
  const gestureStartY = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;
    translateY.set(-sheetHeight);
    const animationFrame = requestAnimationFrame(() => {
      translateY.set(withSpring(0, REST_SPRING));
    });
    return () => cancelAnimationFrame(animationFrame);
  }, [sheetHeight, translateY, visible]);

  const requestClose = () => {
    translateY.set(withTiming(-sheetHeight, { duration: 190 }, (finished) => {
      if (finished) scheduleOnRN(onClose);
    }));
  };

  const panGesture = Gesture.Pan()
    .activeOffsetY([-8, 8])
    .failOffsetX([-28, 28])
    .averageTouches(true)
    .onBegin(() => { gestureStartY.set(translateY.get()); })
    .onUpdate((event) => {
      const nextPosition = gestureStartY.get() + event.translationY;
      translateY.set(nextPosition > 0 ? nextPosition * 0.08 : Math.max(-sheetHeight, nextPosition));
    })
    .onEnd((event) => {
      const projectedPosition = translateY.get() + event.velocityY * 0.12;
      if (projectedPosition < -84) {
        translateY.set(withTiming(-sheetHeight, { duration: 190 }, (finished) => {
          if (finished) scheduleOnRN(onClose);
        }));
        return;
      }
      translateY.set(withSpring(0, { ...REST_SPRING, velocity: event.velocityY }));
    });

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.get() }] }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      hardwareAccelerated
      onRequestClose={requestClose}
    >
      <GestureHandlerRootView style={styles.root}>
        <View style={styles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={requestClose}
            accessible={false}
            importantForAccessibility="no"
          />
          <Animated.View style={[styles.container, { height: sheetHeight }, animatedStyle]}>
            <View style={[styles.sheet, { paddingTop: insets.top + theme.spacing.xs }]} accessibilityViewIsModal>
              <View style={styles.header}>
                <CustomText text={title} variant="subtitle" style={styles.title} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.88} />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Cerrar"
                  onPress={requestClose}
                  style={({ pressed }) => [styles.close, pressed && styles.pressed]}
                >
                  <CustomIcon icon={Cancel01Icon} color={theme.colors.authTextSecondary} size={22} strokeWidth={2.2} />
                </Pressable>
              </View>
              <View style={styles.body}>{children}</View>
              {footer ? <View style={styles.footer}>{footer}</View> : null}
              <GestureDetector gesture={panGesture}>
                <View
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Desliza hacia arriba para cerrar"
                  style={styles.dragArea}
                >
                  <View style={styles.handle} />
                </View>
              </GestureDetector>
            </View>
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default AppTopSheet;

const styles = StyleSheet.create({
  root: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.58)" },
  container: { position: "absolute", top: 0, width: "100%", maxWidth: 560, alignSelf: "center" },
  sheet: {
    flex: 1,
    paddingHorizontal: theme.layout.cardPadding,
    borderBottomLeftRadius: theme.radius.sheet,
    borderBottomRightRadius: theme.radius.sheet,
    borderCurve: "continuous",
    backgroundColor: theme.colors.backgroundAlt,
    overflow: "hidden",
  },
  header: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  title: { flex: 1, color: theme.colors.white },
  close: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
  },
  body: { flex: 1, justifyContent: "center" },
  footer: { paddingTop: theme.spacing.sm },
  dragArea: { minHeight: 36, alignItems: "center", justifyContent: "center" },
  handle: { width: 42, height: 5, borderRadius: theme.radius.pill, backgroundColor: theme.colors.surfaceMuted },
  pressed: { opacity: 0.68 },
});
