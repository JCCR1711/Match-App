import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { memo } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

interface AppRoleNoticeProps {
  title?: string;
  message: string;
  tone?: "neutral" | "match" | "local";
  style?: StyleProp<ViewStyle>;
}

const AppRoleNotice = ({ title = "Solo consulta", message, tone = "neutral", style }: AppRoleNoticeProps) => (
  <View accessibilityLiveRegion="polite" style={[styles.container, tone === "match" && styles.matchContainer, tone === "local" && styles.localContainer, style]}>
    <View style={styles.copy}>
      <CustomText text={title} variant="bodyStrong" style={[styles.title, tone === "match" && styles.matchTitle, tone === "local" && styles.localTitle]} />
      <CustomText text={message} variant="body" style={styles.message} />
    </View>
    <CustomIcon icon={InformationCircleIcon} color={tone === "match" ? theme.colors.iceBlue : tone === "local" ? theme.colors.warmAmber : theme.colors.authTextSecondary} size={24} strokeWidth={2.4} />
  </View>
);

export default memo(AppRoleNotice);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 96,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.extraLarge,
    borderCurve: "continuous",
    backgroundColor: theme.colors.surfaceOnDarkSubtle,
  },
  matchContainer: { backgroundColor: theme.colors.businessBlueSurface },
  localContainer: { backgroundColor: theme.colors.pendingSurface },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xs },
  title: { color: theme.colors.white },
  matchTitle: { color: theme.colors.iceBlue },
  localTitle: { color: theme.colors.warmAmber },
  message: { color: theme.colors.textOnDarkSecondary },
});
