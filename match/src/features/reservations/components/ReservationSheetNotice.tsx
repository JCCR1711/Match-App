import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import AppRoleNotice from "@/src/components/ui/AppRoleNotice";
import { theme } from "@/src/theme";
import { AlertCircleIcon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

type ReservationSheetNoticeTone = "error" | "readOnly" | "match" | "local";

interface ReservationSheetNoticeProps {
  message: string;
  title?: string;
  tone?: ReservationSheetNoticeTone;
}

const ReservationSheetNotice = ({ message, title, tone = "error" }: ReservationSheetNoticeProps) => {
  const isError = tone === "error";

  if (!isError) return <AppRoleNotice title={title} message={message} tone={tone === "match" || tone === "local" ? tone : "neutral"} />;

  return (
    <View
      accessibilityRole={isError ? "alert" : undefined}
      accessibilityLiveRegion={isError ? "assertive" : "polite"}
      style={styles.container}
    >
      <View style={styles.copy}>
        <CustomText text={title ?? "No se pudo completar"} variant="bodyStrong" style={styles.errorTitle} />
        <CustomText text={message} variant="body" style={styles.message} />
      </View>
      <CustomIcon
        icon={isError ? AlertCircleIcon : InformationCircleIcon}
        color={isError ? theme.colors.errorSoft : theme.colors.authTextSecondary}
        size={24}
        strokeWidth={2.4}
      />
    </View>
  );
};

export default memo(ReservationSheetNotice);

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
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xs },
  errorTitle: { color: theme.colors.white },
  message: { color: theme.colors.textOnDarkSecondary },
});
