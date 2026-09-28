import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { Download04Icon } from "@hugeicons/core-free-icons";
import { Pressable, StyleSheet, View } from "react-native";

const AnalyticsExportCard = ({ exporting, onPress }: { exporting: boolean; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    disabled={exporting}
    accessibilityLabel={exporting ? "Preparando reporte CSV" : "Exportar reporte CSV del periodo"}
    style={({ pressed }) => [styles.card, pressed && !exporting && styles.pressed, exporting && styles.disabled]}
  >
    <View style={styles.copy}>
      <CustomText text={exporting ? "Preparando reporte" : "Lleva tus datos contigo"} variant="subtitle" style={styles.title} />
      <CustomText text="Reservas, origen, sede, cancha, estado e importe en un archivo CSV." variant="caption" style={styles.description} />
    </View>
    <View style={styles.action} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <CustomIcon icon={Download04Icon} color={theme.colors.black} sizeToken="small" strokeWidth={2} />
      <CustomText text={exporting ? "Espera" : "Exportar"} variant="caption" style={styles.actionLabel} />
    </View>
  </Pressable>
);

export default AnalyticsExportCard;

const styles = StyleSheet.create({
  card: { minHeight: 180, alignItems: "center", justifyContent: "center", gap: theme.spacing.lg, padding: theme.spacing.xl, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.authSurface },
  copy: { alignItems: "center", gap: theme.spacing.xs },
  title: { color: theme.colors.white, textAlign: "center" },
  description: { maxWidth: 330, color: theme.colors.textOnDarkSecondary, textAlign: "center" },
  action: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: theme.spacing.xs, paddingHorizontal: theme.spacing.lg, borderRadius: theme.radius.pill, backgroundColor: theme.colors.white },
  actionLabel: { color: theme.colors.black, fontFamily: theme.fontFamilies.poppinsBold },
  pressed: { opacity: 0.72 },
  disabled: { opacity: 0.5 },
});
