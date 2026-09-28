import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import AppToastContext, {
  type AppToastPlacement,
  type AppToastPresentation,
  type AppToastTone,
  type ShowAppToastInput,
} from "@/src/context/AppToastContext";
import { theme } from "@/src/theme";
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  Keyframe,
  ReduceMotion,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ActiveToast {
  id: number;
  message: string;
  title?: string;
  tone: AppToastTone;
  placement: AppToastPlacement;
  presentation: AppToastPresentation;
  duration: number;
  actionLabel?: string;
  onAction?: () => void;
}

const DEFAULT_DURATION = 4200;
const compactBannerEntering = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: -28 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }] },
}).duration(240).reduceMotion(ReduceMotion.System);
const compactBannerExiting = new Keyframe({
  0: { opacity: 1, transform: [{ translateY: 0 }] },
  100: { opacity: 0, transform: [{ translateY: -16 }] },
}).duration(170).reduceMotion(ReduceMotion.System);

const AppToastProvider = ({ children }: { children: ReactNode }) => {
  const insets = useSafeAreaInsets();
  const nextId = useRef(0);
  const [toast, setToast] = useState<ActiveToast | null>(null);

  const dismissToast = useCallback(() => setToast(null), []);
  const showToast = useCallback((input: ShowAppToastInput) => {
    const tone = input.tone ?? "error";
    const placement = input.placement ?? (tone === "error" ? "top" : "bottom");
    const presentation = input.presentation ?? (placement === "top" ? "compactBanner" : "standard");
    const duration = input.duration ?? (tone === "error" ? 5200 : DEFAULT_DURATION);

    nextId.current += 1;
    setToast({
      id: nextId.current,
      message: input.message,
      title: input.title,
      tone,
      placement,
      presentation,
      duration,
      actionLabel: input.actionLabel,
      onAction: input.onAction,
    });
    if (tone === "error") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else if (tone === "success") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(dismissToast, toast.duration);
    return () => clearTimeout(timeout);
  }, [dismissToast, toast]);

  const contextValue = useMemo(() => ({ showToast, dismissToast }), [dismissToast, showToast]);
  const isCompactBanner = toast?.placement === "top" && toast.presentation === "compactBanner";

  return (
    <AppToastContext.Provider value={contextValue}>
      {children}
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        {toast ? (
          <Animated.View
            key={toast.id}
            entering={isCompactBanner
              ? compactBannerEntering
              : (toast.placement === "top" ? FadeInDown : FadeInUp)
                  .duration(240)
                  .reduceMotion(ReduceMotion.System)}
            exiting={isCompactBanner
              ? compactBannerExiting
              : (toast.placement === "top" ? FadeOutUp : FadeOutDown)
                  .duration(180)
                  .reduceMotion(ReduceMotion.System)}
            style={[
              styles.positioner,
              isCompactBanner && styles.compactPositioner,
              isCompactBanner
                ? { top: insets.top + theme.spacing.xs }
                : toast.placement === "top"
                ? { top: insets.top + (isCompactBanner ? theme.spacing.xxs : theme.spacing.xs) }
                : { bottom: insets.bottom + theme.layout.tabBarClearance + theme.spacing.sm },
            ]}
          >
            <View
              accessibilityRole={toast.tone === "error" ? "alert" : undefined}
              accessibilityLiveRegion={toast.tone === "error" ? "assertive" : "polite"}
              style={[
                styles.toast,
                isCompactBanner && styles.compactToast,
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${toast.title ? `${toast.title}. ` : ""}${toast.message}. Toca para cerrar.`}
                onPress={dismissToast}
                style={({ pressed }) => [
                  styles.dismissArea,
                  isCompactBanner && styles.compactDismissArea,
                  pressed && styles.pressed,
                ]}
              >
              <CustomIcon
                icon={getToastIcon(toast.tone)}
                color={getToastColor(toast.tone)}
                size={isCompactBanner ? 24 : 22}
                strokeWidth={2.4}
                />
                <View style={styles.copy}>
                  {toast.title ? (
                    <CustomText
                      text={toast.title}
                      variant="bodyStrong"
                      style={[styles.title, isCompactBanner && styles.compactTitle]}
                      numberOfLines={1}
                    />
                  ) : null}
                  <CustomText
                    text={toast.message}
                    variant={toast.title ? "caption" : "bodyStrong"}
                    style={[
                      styles.message,
                      toast.title && styles.messageSecondary,
                      isCompactBanner && styles.compactMessage,
                    ]}
                    numberOfLines={toast.title ? 2 : 3}
                  />
                </View>
              </Pressable>
              {toast.actionLabel && toast.onAction ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={toast.actionLabel}
                  hitSlop={8}
                  onPress={() => {
                    dismissToast();
                    toast.onAction?.();
                  }}
                  style={({ pressed }) => [
                    styles.action,
                    isCompactBanner && styles.compactAction,
                    pressed && styles.actionPressed,
                  ]}
                >
                  <CustomText text={toast.actionLabel} variant="actionSecondary" style={styles.actionText} />
                </Pressable>
              ) : null}
            </View>
          </Animated.View>
        ) : null}
      </View>
    </AppToastContext.Provider>
  );
};

const getToastIcon = (tone: AppToastTone) => {
  if (tone === "success") return CheckmarkCircle02Icon;
  if (tone === "info") return InformationCircleIcon;
  return AlertCircleIcon;
};

const getToastColor = (tone: AppToastTone) => {
  if (tone === "success") return theme.colors.accent;
  if (tone === "info") return theme.colors.iceBlue;
  return theme.colors.error;
};

export default AppToastProvider;

const styles = StyleSheet.create({
  positioner: {
    position: "absolute",
    zIndex: 1000,
    right: theme.layout.screenGutter,
    left: theme.layout.screenGutter,
    alignItems: "center",
  },
  compactPositioner: {
    right: theme.layout.screenGutter,
    left: theme.layout.screenGutter,
  },
  toast: {
    width: "100%",
    maxWidth: 520,
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.extraLarge,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.controlBorderOnDark,
    backgroundColor: theme.colors.authSurface,
    ...theme.shadows.medium,
  },
  compactToast: {
    minHeight: 76,
    borderRadius: theme.radius.extraLarge,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.controlBorderOnDark,
    backgroundColor: theme.colors.authSurface,
  },
  dismissArea: {
    flex: 1,
    minWidth: 0,
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  compactDismissArea: {
    minHeight: 76,
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  copy: { flex: 1, minWidth: 0 },
  title: { color: theme.colors.white },
  compactTitle: { fontSize: theme.fontSizes.body, lineHeight: theme.lineHeights.body },
  message: { color: theme.colors.white },
  messageSecondary: { color: theme.colors.textOnDarkSecondary },
  compactMessage: { fontSize: theme.fontSizes.caption, lineHeight: theme.lineHeights.caption },
  action: {
    minHeight: 44,
    justifyContent: "center",
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.lg,
  },
  compactAction: {
    minHeight: 48,
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.lg,
  },
  actionText: { color: theme.colors.white },
  actionPressed: { opacity: 0.62 },
  pressed: { opacity: 0.78 },
});
