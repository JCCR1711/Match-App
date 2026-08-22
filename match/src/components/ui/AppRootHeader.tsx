import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import type { IconSvgElement } from "@hugeicons/react-native";
import { Pressable, StyleSheet, View } from "react-native";

interface AppRootHeaderProps {
  title: string;
  subtitle: string;
  actionIcon: IconSvgElement;
  actionLabel: string;
  onAction: () => void;
}

const AppRootHeader = ({ title, subtitle, actionIcon, actionLabel, onAction }: AppRootHeaderProps) => (
  <View style={styles.container}>
    <View style={styles.copy}>
      <CustomText text={title} variant="subtitle" style={styles.title} numberOfLines={1} />
      <CustomText text={subtitle} variant="caption" style={styles.subtitle} numberOfLines={1} />
    </View>
    <Pressable accessibilityRole="button" accessibilityLabel={actionLabel} hitSlop={8} onPress={onAction} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
      <CustomIcon icon={actionIcon} color={theme.colors.black} size={23} strokeWidth={2.3} />
    </Pressable>
  </View>
);

export default AppRootHeader;

const styles = StyleSheet.create({
  container: { minHeight: 80, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  title: { color: theme.colors.white },
  subtitle: { color: theme.colors.authTextSecondary },
  action: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.accent },
  pressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
});
