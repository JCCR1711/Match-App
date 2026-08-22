import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { ArrowRight01Icon, BankIcon } from "@hugeicons/core-free-icons";
import { Pressable, StyleSheet, View } from "react-native";

const SettlementSummaryLink = ({ onPress }: { onPress: () => void }) => (
  <Pressable accessibilityRole="button" accessibilityLabel="Ver próxima liquidación de S/ 1,840" onPress={onPress} style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
    <View style={styles.icon}>
      <CustomIcon icon={BankIcon} color={theme.colors.black} size={23} strokeWidth={2.2} />
    </View>
    <View style={styles.copy}>
      <CustomText text="Próxima liquidación" variant="caption" style={styles.label} />
      <CustomText text="S/ 1,840" variant="subtitle" style={styles.value} />
    </View>
    <CustomIcon icon={ArrowRight01Icon} color={theme.colors.black} size={24} strokeWidth={2.4} />
  </Pressable>
);

export default SettlementSummaryLink;

const styles = StyleSheet.create({
  container: { minHeight: 108, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, padding: theme.spacing.lg, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.accent },
  icon: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: "rgba(0,0,0,0.10)" },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  label: { color: theme.colors.black, opacity: 0.66 },
  value: { color: theme.colors.black },
  pressed: { opacity: 0.78 },
});
