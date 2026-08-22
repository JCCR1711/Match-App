import AppSurface, { type AppSurfaceVariant } from "@/src/components/ui/AppSurface";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react-native";
import { StyleSheet, Text, View } from "react-native";

interface DashboardStatusCardProps {
  icon: IconSvgElement;
  title: string;
  subtitle?: string;
  value?: string;
  accessibilityLabel?: string;
  onPress?: () => void;
  accentColor?: string;
  variant?: AppSurfaceVariant;
  showArrow?: boolean;
}

const DashboardStatusCard = ({ icon, title, subtitle, value, accessibilityLabel, onPress, accentColor = theme.colors.white, variant = "neutral", showArrow = true }: DashboardStatusCardProps) => (
  <AppSurface variant={variant} onPress={onPress} accessibilityLabel={accessibilityLabel} style={styles.card}>
    <CustomIcon icon={icon} color={accentColor} size={28} strokeWidth={2.3} />
    <View style={styles.copy}>
      <CustomText text={title} variant="body" style={styles.title} />
      {subtitle ? <CustomText text={subtitle} variant="caption" style={styles.subtitle} /> : null}
    </View>
    {value ? <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78} style={[styles.value, { color: accentColor }]}>{value}</Text> : null}
    {onPress && !value && showArrow ? <CustomIcon icon={ArrowRight01Icon} color={accentColor} size={25} strokeWidth={2.6} /> : null}
  </AppSurface>
);

export default DashboardStatusCard;

const styles = StyleSheet.create({
  card: { minHeight: 104, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.lg },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  title: { color: theme.colors.authText, fontFamily: theme.fontFamilies.poppinsBold, fontSize: 17, lineHeight: 23 },
  subtitle: { color: theme.colors.authTextSecondary },
  value: { maxWidth: "38%", flexShrink: 1, fontFamily: theme.fontFamilies.poppinsBold, fontSize: 20, lineHeight: 26, textAlign: "right" },
});
