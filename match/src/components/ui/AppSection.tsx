import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface AppSectionProps {
  title: string;
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: "text" | "reserved";
  actionDisabled?: boolean;
}

const AppSection = ({ title, children, actionLabel, onAction, actionVariant = "text", actionDisabled = false }: AppSectionProps) => (
  <View style={styles.section}>
    <View style={styles.heading}>
      <CustomText text={title} variant="sectionHeading" style={styles.title} />
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          disabled={actionDisabled}
          accessibilityRole="button"
          accessibilityState={{ disabled: actionDisabled }}
          hitSlop={4}
          style={({ pressed }) => [
            styles.actionControl,
            actionVariant === "reserved" && styles.reservedActionControl,
            pressed && styles.pressed,
            actionDisabled && styles.disabled,
          ]}
        >
          <CustomText text={actionLabel} variant="caption" style={[styles.action, actionVariant === "reserved" && styles.reservedAction]} />
        </Pressable>
      ) : null}
    </View>
    {children}
  </View>
);

export default AppSection;

const styles = StyleSheet.create({
  section: { gap: theme.layout.elementGap },
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.layout.elementGap },
  title: { color: theme.colors.authText },
  action: { color: theme.colors.authTextSecondary, fontFamily: theme.fontFamilies.poppinsBold },
  actionControl: { minHeight: 48, justifyContent: "center" },
  reservedActionControl: { minHeight: 40, paddingHorizontal: theme.spacing.md, borderRadius: theme.radius.pill, backgroundColor: theme.colors.reservedSurface },
  reservedAction: { color: theme.colors.white },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.62 },
});
