import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type AppFeedbackTone = "error" | "info";

interface AppFeedbackNoticeProps {
  message: string;
  title?: string;
  tone?: AppFeedbackTone;
  presentation?: "inline" | "card";
  actionLabel?: string;
  onAction?: () => void;
}

const AppFeedbackNotice = ({
  message,
  title,
  tone = "error",
  presentation = "inline",
  actionLabel,
  onAction,
}: AppFeedbackNoticeProps) => {
  const isError = tone === "error";
  return (
    <View
      accessibilityRole={isError ? "alert" : undefined}
      style={[styles.container, presentation === "card" && styles.card]}
    >
      <View style={styles.copy}>
        {title ? <CustomText text={title} variant="bodyStrong" style={styles.title} /> : null}
        <CustomText
          text={message}
          variant={title ? "caption" : "body"}
          style={[
            title ? styles.message : styles.singleMessage,
            isError ? styles.errorText : styles.infoText,
          ]}
        />
      </View>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
          hitSlop={8}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <CustomText text={actionLabel} variant="actionSecondary" style={styles.actionLabel} />
        </Pressable>
      ) : null}
    </View>
  );
};

export default memo(AppFeedbackNotice);

const styles = StyleSheet.create({
  container: {
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.xxs,
  },
  card: {
    minHeight: 72,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.authBorder,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.businessBlueSurface,
  },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  title: { color: theme.colors.white },
  message: { color: theme.colors.textOnDarkSecondary },
  singleMessage: { lineHeight: theme.lineHeights.body },
  errorText: { color: theme.colors.textOnDarkSecondary },
  infoText: { color: theme.colors.textOnDarkSecondary },
  action: {
    minHeight: 44,
    alignItems: "center",
    paddingHorizontal: theme.spacing.xs,
  },
  actionLabel: { color: theme.colors.white },
  pressed: { opacity: 0.68 },
});
