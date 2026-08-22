import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface AppSectionProps {
  title: string;
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const AppSection = ({ title, children, actionLabel, onAction }: AppSectionProps) => (
  <View style={styles.section}>
    <View style={styles.heading}>
      <CustomText text={title} variant="sectionHeading" style={styles.title} />
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} accessibilityRole="button" hitSlop={4} style={({ pressed }) => [styles.actionControl, pressed && styles.pressed]}>
          <CustomText text={actionLabel} variant="caption" style={styles.action} />
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
  pressed: { opacity: 0.7 },
});
