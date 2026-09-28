import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { memo, type ReactNode } from "react";
import { ActivityIndicator, StyleSheet, View, type ViewStyle, type StyleProp } from "react-native";

export type AppScreenStateKind = "error" | "empty" | "loading";
export type AppScreenStatePresentation = "screen" | "section";

interface AppScreenStateProps {
  title: string;
  message?: string;
  kind?: AppScreenStateKind;
  presentation?: AppScreenStatePresentation;
  actionLabel?: string;
  onAction?: () => void;
  actionLoading?: boolean;
  visual?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const AppScreenState = ({
  title,
  message,
  kind = "error",
  presentation = "screen",
  actionLabel,
  onAction,
  actionLoading = false,
  visual,
  style,
}: AppScreenStateProps) => {
  const isLoading = kind === "loading";

  return (
    <View
      accessibilityRole={kind === "error" ? "alert" : undefined}
      accessibilityLiveRegion={kind === "error" ? "assertive" : "polite"}
      style={[styles.container, presentation === "section" && styles.sectionContainer, style]}
    >
      <View style={[styles.content, presentation === "section" && styles.sectionContent]}>
        {isLoading && !visual ? (
          <ActivityIndicator
            accessibilityLabel="Cargando"
            color={theme.colors.white}
            size="small"
            style={styles.loader}
          />
        ) : visual}
        <View style={styles.copy}>
          <CustomText
            text={title}
            variant={presentation === "section" ? "sectionHeading" : "subtitle"}
            style={styles.title}
          />
          {message ? <CustomText text={message} variant="body" style={styles.message} /> : null}
        </View>
        {actionLabel && onAction && !isLoading ? (
          <CustomButton
            label={actionLabel}
            variant="light"
            onPress={onAction}
            disabled={actionLoading}
            leadingIcon={
              actionLoading ? (
                <ActivityIndicator
                  accessibilityLabel="Reintentando"
                  color={theme.colors.black}
                  size="small"
                />
              ) : undefined
            }
            style={[styles.action, presentation === "section" && styles.sectionAction]}
            accessibilityLabel={actionLabel}
          />
        ) : null}
      </View>
    </View>
  );
};

export default memo(AppScreenState);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 360,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.layout.screenGutter,
    paddingVertical: theme.spacing.xxxl,
  },
  content: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    gap: theme.spacing.xxl,
  },
  sectionContainer: {
    flex: 0,
    minHeight: 280,
    paddingVertical: theme.spacing.xxl,
  },
  sectionContent: { maxWidth: 340, gap: theme.spacing.xl },
  copy: { alignItems: "center", gap: theme.spacing.xs },
  title: { color: theme.colors.white, textAlign: "center" },
  message: { color: theme.colors.authTextSecondary, textAlign: "center" },
  loader: { height: 24 },
  action: { width: "100%", maxWidth: 280, minHeight: 58, borderRadius: theme.radius.pill },
  sectionAction: { maxWidth: 260, minHeight: 56 },
});
