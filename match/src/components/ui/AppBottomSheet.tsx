import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState, type ReactNode } from "react";
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

export type AppBottomSheetTone = "default" | "reserved" | "available" | "pending" | "blocked" | "maintenance";

export interface AppBottomSheetProps {
  visible: boolean;
  title: string;
  children: ReactNode | ((expanded: boolean) => ReactNode);
  footer?: ReactNode | ((expanded: boolean) => ReactNode);
  expandable?: boolean;
  collapsedHeight?: number;
  tone?: AppBottomSheetTone;
  onClose: () => void;
}

const REST_SPRING = { damping: 24, stiffness: 260, mass: 0.75, overshootClamping: true } as const;

const AppBottomSheet = ({ visible, title, children, footer, expandable = false, collapsedHeight = 380, tone = "default", onClose }: AppBottomSheetProps) => {
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const expandedHeight = Math.min(760 + insets.bottom, windowHeight - Math.max(insets.top, theme.spacing.md) - theme.spacing.md);
  const resolvedCollapsedHeight = Math.min(collapsedHeight + insets.bottom, expandedHeight);
  const collapsedOffset = expandable ? expandedHeight - resolvedCollapsedHeight : 0;
  const sheetHeight = expandable ? expandedHeight : resolvedCollapsedHeight;
  const [expanded, setExpanded] = useState(false);
  const translateY = useSharedValue(collapsedOffset);
  const gestureStartY = useSharedValue(collapsedOffset);

  useEffect(() => {
    if (visible) {
      setExpanded(false);
      translateY.value = sheetHeight;
      gestureStartY.value = collapsedOffset;
      translateY.value = withSpring(collapsedOffset, REST_SPRING);
    }
  }, [collapsedOffset, gestureStartY, sheetHeight, translateY, visible]);

  const requestClose = () => {
    translateY.value = withTiming(sheetHeight, { duration: 190 }, (finished) => {
      if (finished) scheduleOnRN(onClose);
    });
  };

  const settleSheet = (nextExpanded: boolean) => {
    translateY.value = withSpring(nextExpanded ? 0 : collapsedOffset, REST_SPRING, (finished) => {
      if (finished) scheduleOnRN(setExpanded, nextExpanded);
    });
  };

  const panGesture = Gesture.Pan().activeOffsetY([-8, 8]).failOffsetX([-28, 28]).averageTouches(true)
    .onBegin(() => { gestureStartY.value = translateY.value; })
    .onUpdate((event) => {
      const nextPosition = gestureStartY.value + event.translationY;
      translateY.value = nextPosition < 0 ? nextPosition * 0.08 : nextPosition;
    })
    .onEnd((event) => {
      const projectedPosition = translateY.value + event.velocityY * 0.12;
      if ((!expandable || !expanded) && projectedPosition > collapsedOffset + 96) {
        translateY.value = withTiming(sheetHeight, { duration: 190 }, (finished) => {
          if (finished) scheduleOnRN(onClose);
        });
        return;
      }
      const shouldExpand = expandable && projectedPosition < collapsedOffset * 0.55;
      translateY.value = withSpring(shouldExpand ? 0 : collapsedOffset, { ...REST_SPRING, velocity: event.velocityY }, (finished) => {
        if (finished) scheduleOnRN(setExpanded, shouldExpand);
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({ height: sheetHeight, transform: [{ translateY: translateY.value }] }));
  const content = typeof children === "function" ? children(expanded) : children;
  const footerContent = typeof footer === "function" ? footer(expanded) : footer;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent navigationBarTranslucent hardwareAccelerated onRequestClose={requestClose}>
      <GestureHandlerRootView style={styles.root}>
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={requestClose} accessible={false} importantForAccessibility="no" />
          <Animated.View style={[styles.container, animatedStyle]}>
            <SafeAreaView style={styles.sheet} edges={["bottom"]} accessibilityViewIsModal>
              <GestureDetector gesture={panGesture}>
                <View
                  accessible
                  accessibilityRole="adjustable"
                  accessibilityLabel={`${title}. Panel ${expanded ? "expandido" : "contraído"}`}
                  accessibilityActions={expandable ? [{ name: "increment", label: "Expandir" }, { name: "decrement", label: "Contraer" }] : undefined}
                  onAccessibilityAction={(event) => {
                    if (event.nativeEvent.actionName === "increment" && !expanded) settleSheet(true);
                    if (event.nativeEvent.actionName === "decrement" && expanded) settleSheet(false);
                  }}
                >
                  <View style={styles.dragArea}><View style={[styles.handle, tone === "reserved" && styles.reserved, tone === "pending" && styles.pending, tone === "blocked" && styles.blocked, tone === "maintenance" && styles.maintenance]} /></View>
                  <View style={styles.header}>
                    <CustomText text={title} variant="subtitle" style={styles.title} numberOfLines={1} />
                    <Pressable onPress={requestClose} accessibilityRole="button" accessibilityLabel="Cerrar" style={({ pressed }) => [styles.close, pressed && styles.pressed]}>
                      <CustomIcon icon={Cancel01Icon} color={theme.colors.authTextSecondary} size={22} strokeWidth={2.2} />
                    </Pressable>
                  </View>
                </View>
              </GestureDetector>
              <Animated.ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive">
                {content}
              </Animated.ScrollView>
              {footerContent ? <View style={styles.footer}>{footerContent}</View> : null}
            </SafeAreaView>
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default AppBottomSheet;

const styles = StyleSheet.create({
  root: { flex: 1 },
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.58)" },
  container: { width: "100%", maxWidth: 560, alignSelf: "center" },
  sheet: { flex: 1, paddingHorizontal: theme.layout.cardPadding, paddingBottom: theme.spacing.md, borderTopLeftRadius: theme.radius.sheet, borderTopRightRadius: theme.radius.sheet, borderCurve: "continuous", backgroundColor: theme.colors.backgroundAlt },
  dragArea: { minHeight: 40, alignItems: "center", justifyContent: "center", marginHorizontal: -theme.layout.cardPadding },
  handle: { width: 42, height: 5, borderRadius: theme.radius.pill, backgroundColor: theme.colors.surfaceMuted },
  reserved: { backgroundColor: theme.colors.accent }, pending: { backgroundColor: theme.colors.pendingLimeText }, blocked: { backgroundColor: theme.colors.error }, maintenance: { backgroundColor: theme.colors.warmAmber },
  header: { minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  title: { flex: 1, color: theme.colors.white }, close: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill }, pressed: { opacity: 0.72 },
  body: { flex: 1 },
  bodyContent: { flexGrow: 1, gap: theme.layout.groupGap, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.lg },
  footer: { paddingTop: theme.spacing.sm },
});
