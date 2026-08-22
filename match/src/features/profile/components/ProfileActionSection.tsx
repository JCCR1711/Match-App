import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react-native";
import { Pressable, StyleSheet, View } from "react-native";

export interface ProfileActionItem {
  key: string;
  icon: IconSvgElement;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface ProfileActionSectionProps {
  title: string;
  items: ProfileActionItem[];
}

const ProfileActionSection = ({ title, items }: ProfileActionSectionProps) => (
  <View style={styles.section}>
    <CustomText text={title} variant="body" style={styles.sectionTitle} />
    <View>
      {items.map((item, index) => {
        const color = item.destructive ? theme.colors.errorSoft : theme.colors.authText;
        return (
          <View key={item.key}>
            <Pressable
              onPress={item.onPress}
              disabled={item.disabled}
              accessibilityRole="button"
              accessibilityState={{ disabled: item.disabled }}
              style={({ pressed }) => [styles.row, pressed && styles.pressed, item.disabled && styles.disabled]}
            >
              <CustomIcon icon={item.icon} color={color} size={25} strokeWidth={2.2} />
              <CustomText text={item.label} variant="body" style={[styles.label, item.destructive && styles.destructive]} />
              {!item.destructive ? <CustomIcon icon={ArrowRight01Icon} color={theme.colors.authTextSecondary} size={24} strokeWidth={2.5} /> : null}
            </Pressable>
            {index < items.length - 1 ? <View style={styles.separator} /> : null}
          </View>
        );
      })}
    </View>
  </View>
);

export default ProfileActionSection;

const styles = StyleSheet.create({
  section: { gap: theme.spacing.md },
  sectionTitle: { color: theme.colors.white, fontSize: 19, lineHeight: 26, fontFamily: theme.fontFamilies.poppinsBold },
  row: { minHeight: 68, flexDirection: "row", alignItems: "center", gap: theme.spacing.md },
  label: { flex: 1, color: theme.colors.authText, fontFamily: theme.fontFamilies.poppinsBold },
  destructive: { color: theme.colors.errorSoft },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 41, backgroundColor: "rgba(255, 255, 255, 0.1)" },
  pressed: { opacity: 0.62 },
  disabled: { opacity: 0.48 },
});
