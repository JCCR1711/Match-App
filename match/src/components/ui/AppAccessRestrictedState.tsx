import AppSurface from "@/src/components/ui/AppSurface";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { memo, type ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

interface AppAccessRestrictedStateProps {
  title: string;
  message: string;
  onBack?: () => void;
  actionLabel?: string;
  style?: StyleProp<ViewStyle>;
  tone?: "neutral" | "premium";
  illustration?: ReactNode;
}

const AppAccessRestrictedState = ({ title, message, onBack, actionLabel = "Volver", style, tone = "neutral", illustration }: AppAccessRestrictedStateProps) => {
  const premium = tone === "premium";
  const content = (
    <>
      {!premium ? (
        <View style={styles.icon}>
          <CustomIcon icon={InformationCircleIcon} color={theme.colors.white} size={24} strokeWidth={2.4} />
        </View>
      ) : null}
      {illustration}
      <View style={styles.copy}>
        <CustomText text={title} variant={premium ? "heading" : "sectionHeading"} style={[styles.title, premium && styles.premiumTitle]} />
        <CustomText text={message} variant="body" style={[styles.message, premium && styles.premiumMessage]} />
      </View>
      {onBack ? (
        <CustomButton
          label={actionLabel}
          variant={premium ? "light" : "secondary"}
          onPress={onBack}
          style={[styles.action, premium && styles.premiumAction]}
          accessibilityLabel={actionLabel}
        />
      ) : null}
    </>
  );

  return (
    <View accessibilityRole="alert" style={[styles.container, style]}>
      {premium ? (
        <View style={styles.premiumContent}>
          {content}
        </View>
      ) : (
        <AppSurface variant="neutral" style={styles.surface}>
          {content}
        </AppSurface>
      )}
    </View>
  );
};

export default memo(AppAccessRestrictedState);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 360,
    justifyContent: "center",
    paddingVertical: theme.spacing.xxxl,
  },
  surface: {
    width: "100%",
    padding: theme.spacing.xl,
    gap: theme.spacing.xl,
  },
  premiumContent: {
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
    alignItems: "center",
    gap: theme.spacing.xxl,
  },
  icon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceAlt,
  },
  copy: { gap: theme.spacing.sm },
  title: { color: theme.colors.white },
  premiumTitle: { maxWidth: 320, color: theme.colors.white, textAlign: "center" },
  message: { color: theme.colors.authTextSecondary, maxWidth: 300 },
  premiumMessage: { maxWidth: 330, color: theme.colors.textOnDarkSecondary, textAlign: "center" },
  action: {
    alignSelf: "flex-start",
    minHeight: 48,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.pill,
  },
  premiumAction: { width: "100%", maxWidth: 280, alignSelf: "center" },
});
