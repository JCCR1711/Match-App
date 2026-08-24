import CustomButton, { type CustomButtonProps } from "@/src/components/ui/CustomButton";
import { theme } from "@/src/theme";
import { memo } from "react";
import { type StyleProp, StyleSheet, type ViewStyle } from "react-native";

export type AppSheetActionTone = "primary" | "secondary" | "light" | "destructive" | "text" | "blocked" | "maintenance";

interface AppSheetActionButtonProps extends Omit<CustomButtonProps, "variant" | "style" | "labelStyle"> {
  tone?: AppSheetActionTone;
  style?: StyleProp<ViewStyle>;
}

const AppSheetActionButton = ({ tone = "primary", style, ...props }: AppSheetActionButtonProps) => (
  <CustomButton
    {...props}
    variant={tone === "primary" ? "primary" : tone === "light" ? "light" : "secondary"}
    style={[
      styles.button,
      tone === "secondary" && styles.secondaryButton,
      tone === "light" && styles.lightButton,
      tone === "destructive" && styles.destructiveButton,
      tone === "text" && styles.textButton,
      tone === "blocked" && styles.blockedButton,
      tone === "maintenance" && styles.maintenanceButton,
      style,
    ]}
    labelStyle={
      tone === "light"
        ? styles.lightLabel
        : tone === "destructive"
          ? styles.destructiveLabel
          : tone === "text"
            ? styles.textLabel
            : tone === "blocked"
              ? styles.blockedLabel
              : tone === "maintenance"
                ? styles.maintenanceLabel
                : undefined
    }
  />
);

export default memo(AppSheetActionButton);

const styles = StyleSheet.create({
  button: { minHeight: 58, borderRadius: theme.radius.pill },
  secondaryButton: { borderWidth: 0, backgroundColor: theme.colors.businessBlueSurface },
  lightButton: { borderWidth: 0, backgroundColor: theme.colors.authPrimary },
  lightLabel: { color: theme.colors.black },
  destructiveButton: { minHeight: 48, borderWidth: 0, backgroundColor: "transparent", shadowOpacity: 0, elevation: 0 },
  destructiveLabel: { color: theme.colors.textOnDarkSecondary },
  textButton: { minHeight: 48, borderWidth: 0, backgroundColor: "transparent", shadowOpacity: 0, elevation: 0 },
  textLabel: { color: theme.colors.textOnDarkSecondary },
  blockedButton: { borderWidth: 0, backgroundColor: theme.colors.errorSurface },
  blockedLabel: { color: theme.colors.error },
  maintenanceButton: { borderWidth: 0, backgroundColor: theme.colors.maintenanceSurface },
  maintenanceLabel: { color: theme.colors.warmAmber },
});
