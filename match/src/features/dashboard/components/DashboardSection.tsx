import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface DashboardSectionProps {
  title: string;
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const DashboardSection = ({ title, children, actionLabel, onAction }: DashboardSectionProps) => (
  <View style={styles.section}>
    <View style={styles.heading}>
      <CustomText text={title} variant="body" style={styles.title} />
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} accessibilityRole="button" style={({ pressed }) => pressed && styles.pressed}>
          <CustomText text={actionLabel} variant="caption" style={styles.action} />
        </Pressable>
      ) : null}
    </View>
    {children}
  </View>
);

export default DashboardSection;

const styles = StyleSheet.create({
  section: { gap: theme.spacing.md },
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  title: { color: theme.colors.authText, fontFamily: theme.fontFamilies.poppinsBold, fontSize: 19, lineHeight: 26 },
  action: { color: theme.colors.authTextSecondary, fontFamily: theme.fontFamilies.poppinsBold },
  pressed: { opacity: 0.7 },
});
