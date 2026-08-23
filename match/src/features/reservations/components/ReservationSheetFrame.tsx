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

interface ReservationSheetFrameProps {
  visible: boolean;
  title: string;
  children: ReactNode | ((expanded: boolean) => ReactNode);
  footer?: ReactNode | ((expanded: boolean) => ReactNode);
  expandable?: boolean;
  collapsedHeight?: number;
  tone?: "default" | "reserved" | "available" | "pending" | "blocked" | "maintenance";
  onClose: () => void;
}

const REST_SPRING = {
  damping: 24,
  stiffness: 260,
  mass: 0.75,
  overshootClamping: true,
} as const;

const DEFAULT_COLLAPSED_HEIGHT = 380;

const ReservationSheetFrame = ({ visible, title, children, footer, expandable = false, collapsedHeight = DEFAULT_COLLAPSED_HEIGHT, tone = "default", onClose }: ReservationSheetFrameProps) => {
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const availableHeight = windowHeight - Math.max(insets.top, theme.spacing.md) - theme.spacing.md;
  const expandedHeight = Math.min(760 + insets.bottom, availableHeight);
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
    } else {
      setExpanded(false);
    }
  }, [collapsedOffset, gestureStartY, sheetHeight, translateY, visible]);

  const setSheetExpanded = (nextExpanded: boolean) => setExpanded(nextExpanded);

  const closeSheet = () => onClose();

  const requestClose = () => {
    translateY.value = withTiming(sheetHeight, { duration: 190 }, (finished) => {
      if (finished) scheduleOnRN(closeSheet);
    });
  };

  const settleSheet = (nextExpanded: boolean) => {
    const targetPosition = nextExpanded ? 0 : collapsedOffset;
    translateY.value = withSpring(targetPosition, REST_SPRING, (finished) => {
      if (finished) scheduleOnRN(setSheetExpanded, nextExpanded);
    });
  };

  const panGesture = Gesture.Pan()
    .activeOffsetY([-8, 8])
    .failOffsetX([-28, 28])
    .averageTouches(true)
    .onBegin(() => {
      gestureStartY.value = translateY.value;
    })
    .onUpdate((event) => {
      const nextPosition = gestureStartY.value + event.translationY;
      translateY.value = nextPosition < 0 ? nextPosition * 0.08 : nextPosition;
    })
    .onEnd((event) => {
      const projectedPosition = translateY.value + event.velocityY * 0.12;

      if ((!expandable || !expanded) && projectedPosition > collapsedOffset + 96) {
        translateY.value = withTiming(sheetHeight, { duration: 190 }, (finished) => {
          if (finished) scheduleOnRN(closeSheet);
        });
        return;
      }

      const shouldExpand = expandable && projectedPosition < collapsedOffset * 0.55;
      const targetPosition = shouldExpand ? 0 : collapsedOffset;

      translateY.value = withSpring(targetPosition, { ...REST_SPRING, velocity: event.velocityY }, (finished) => {
        if (finished) scheduleOnRN(setSheetExpanded, shouldExpand);
      });
    });

  const animatedSheetStyle = useAnimatedStyle(() => ({ height: sheetHeight, transform: [{ translateY: translateY.value }] }));
  const content = typeof children === "function" ? children(expanded) : children;
  const footerContent = typeof footer === "function" ? footer(expanded) : footer;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent navigationBarTranslucent hardwareAccelerated onRequestClose={requestClose}>
      <GestureHandlerRootView style={styles.modalRoot}>
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={requestClose} accessible={false} importantForAccessibility="no" />
          <View style={styles.sheetArea} pointerEvents="box-none">
            <Animated.View style={[styles.sheetContainer, animatedSheetStyle]}>
                <SafeAreaView style={styles.sheet} edges={["bottom"]} accessibilityViewIsModal>
                  <GestureDetector gesture={panGesture}>
                    <View
                      accessible
                      accessibilityRole="adjustable"
                      accessibilityLabel={`${title}. Panel ${expanded ? "expandido" : "contraído"}`}
                      accessibilityHint={expandable ? "Desliza verticalmente o usa las acciones de accesibilidad para expandir o contraer" : "Desliza hacia abajo para cerrar"}
                      accessibilityValue={{ text: expanded ? "Expandido" : "Contraído" }}
                      accessibilityActions={expandable ? [{ name: "increment", label: "Expandir" }, { name: "decrement", label: "Contraer" }] : undefined}
                      onAccessibilityAction={(event) => {
                        if (event.nativeEvent.actionName === "increment" && !expanded) settleSheet(true);
                        if (event.nativeEvent.actionName === "decrement" && expanded) settleSheet(false);
                      }}
                    >
                      <View style={styles.dragArea}>
                        <View
                          style={[
                            styles.handle,
                            tone === "reserved" && styles.reservedHandle,
                            tone === "available" && styles.availableHandle,
                            tone === "pending" && styles.pendingHandle,
                            tone === "blocked" && styles.blockedHandle,
                            tone === "maintenance" && styles.maintenanceHandle,
                          ]}
                        />
                      </View>
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
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default ReservationSheetFrame;

const styles = StyleSheet.create({
  modalRoot: { flex: 1 },
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.58)" },
  sheetArea: { flex: 1, justifyContent: "flex-end" },
  sheetContainer: { width: "100%", maxWidth: 560, alignSelf: "center" },
  sheet: { flex: 1, paddingHorizontal: theme.layout.cardPadding, paddingTop: 0, paddingBottom: theme.spacing.md, borderTopLeftRadius: theme.radius.sheet, borderTopRightRadius: theme.radius.sheet, backgroundColor: theme.colors.backgroundAlt },
  dragArea: { minHeight: 40, alignItems: "center", justifyContent: "center", marginHorizontal: -theme.layout.cardPadding },
  handle: { width: 42, height: 5, borderRadius: theme.radius.pill, backgroundColor: theme.colors.surfaceMuted },
  reservedHandle: { backgroundColor: theme.colors.accent },
  availableHandle: { backgroundColor: theme.colors.surfaceMuted },
  pendingHandle: { backgroundColor: theme.colors.pendingLimeText },
  blockedHandle: { backgroundColor: theme.colors.errorSoft },
  maintenanceHandle: { backgroundColor: theme.colors.warmAmber },
  header: { minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  body: { flex: 1 },
  bodyContent: { flexGrow: 1, gap: theme.layout.groupGap, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.lg },
  footer: { paddingTop: theme.spacing.sm },
  title: { flex: 1, color: theme.colors.white },
  close: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill },
  pressed: { opacity: 0.72 },
});
