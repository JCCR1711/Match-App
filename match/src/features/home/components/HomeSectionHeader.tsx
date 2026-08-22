import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

interface HomeSectionHeaderProps {
  title: string;
  label?: string;
}

const HomeSectionHeader = ({ title, label }: HomeSectionHeaderProps) => (
  <View style={styles.container}>
    <CustomText text={title} variant="subtitle" style={styles.title} />
    {label ? <CustomText text={label} variant="label" style={styles.label} /> : null}
  </View>
);

export default HomeSectionHeader;

const styles = StyleSheet.create({
  container: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  title: { flex: 1, color: theme.colors.white },
  label: { color: theme.colors.accent },
});
