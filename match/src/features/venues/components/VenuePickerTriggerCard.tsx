import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { ArrowDown01Icon, Building02Icon } from "@hugeicons/core-free-icons";
import { Pressable, StyleSheet, View } from "react-native";

interface VenuePickerTriggerCardProps {
  name: string;
  location: string;
  disabled?: boolean;
  onPress: () => void;
}

const VenuePickerTriggerCard = ({ name, location, disabled, onPress }: VenuePickerTriggerCardProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel={`Cambiar sede. Seleccionada: ${name}`}
    style={({ pressed }) => [styles.container, disabled && styles.disabled, pressed && styles.pressed]}
  >
    <View style={styles.venueIcon}>
      <CustomIcon icon={Building02Icon} color={theme.colors.white} size={24} strokeWidth={3} />
    </View>
    <View style={styles.copy}>
      <CustomText text={name} variant="subtitle" style={styles.name} numberOfLines={1} />
      <CustomText text={location} variant="caption" style={styles.location} numberOfLines={1} />
    </View>
    <View style={styles.action}>
      <CustomIcon icon={ArrowDown01Icon} color={theme.colors.black} size={24} strokeWidth={3} />
    </View>
  </Pressable>
);

export default VenuePickerTriggerCard;

const styles = StyleSheet.create({
  container: { minHeight: 104, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, padding: theme.spacing.md, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.businessBlueSurface },
  venueIcon: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  name: { color: theme.colors.white, fontSize: 20, lineHeight: 27 },
  location: { color: theme.colors.textOnDarkSecondary },
  action: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.white },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.8 },
});
