import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import type { IconSvgElement } from "@hugeicons/react-native";
import { StyleSheet, View } from "react-native";

export interface ProfileInformationItem {
  key: string;
  icon: IconSvgElement;
  label: string;
  value: string;
}

interface ProfileInformationSectionProps {
  title: string;
  items: ProfileInformationItem[];
}

const ProfileInformationSection = ({ title, items }: ProfileInformationSectionProps) => (
  <View style={styles.section}>
    <CustomText text={title} variant="body" style={styles.sectionTitle} />
    <View>
      {items.map((item, index) => (
        <View key={item.key}>
          <View style={styles.row}>
            <CustomIcon icon={item.icon} color={theme.colors.authTextSecondary} size={25} strokeWidth={2.2} />
            <View style={styles.copy}>
              <CustomText text={item.label} variant="caption" style={styles.label} />
              <CustomText text={item.value} variant="body" style={styles.value} numberOfLines={2} />
            </View>
          </View>
          {index < items.length - 1 ? <View style={styles.separator} /> : null}
        </View>
      ))}
    </View>
  </View>
);

export default ProfileInformationSection;

const styles = StyleSheet.create({
  section: { gap: theme.spacing.md },
  sectionTitle: { color: theme.colors.white, fontSize: 19, lineHeight: 26, fontFamily: theme.fontFamilies.poppinsBold },
  row: { minHeight: 76, flexDirection: "row", alignItems: "center", gap: theme.spacing.md },
  copy: { flex: 1, gap: theme.spacing.xxs },
  label: { color: theme.colors.authTextSecondary },
  value: { color: theme.colors.authText, fontFamily: theme.fontFamilies.poppinsBold },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 41, backgroundColor: "rgba(255, 255, 255, 0.1)" },
});
