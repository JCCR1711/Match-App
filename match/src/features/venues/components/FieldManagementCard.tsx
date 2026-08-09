import AppSurface from "@/src/components/ui/AppSurface";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import type { SportsFieldDraft } from "@/src/features/venues/types/businessOnboarding";
import { theme } from "@/src/theme";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

interface FieldManagementCardProps {
  field: SportsFieldDraft;
  disabled?: boolean;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  showArrow?: boolean;
  onPress: () => void;
}

const FieldManagementCard = ({ field, disabled, subtitle, style, showArrow = true, onPress }: FieldManagementCardProps) => (
  <AppSurface
    style={[styles.card, style]}
    onPress={onPress}
    disabled={disabled}
    accessibilityLabel={`Abrir ${field.fieldName}`}
  >
    <View style={styles.heading}>
      <CustomText text={field.fieldName} variant="body" style={styles.name} numberOfLines={2} />
      {showArrow ? <CustomIcon icon={ArrowRight01Icon} color={theme.colors.white} size={29} strokeWidth={3} /> : null}
    </View>

    <CustomText text={subtitle ?? "Cancha deportiva"} variant="caption" style={styles.subtitle} numberOfLines={1} />

    <View style={styles.footer}>
      <CustomText text={field.format} variant="caption" style={styles.format} />
      <CustomText text={`S/ ${field.hourlyPrice} por hora`} variant="caption" style={styles.price} numberOfLines={1} />
    </View>
  </AppSurface>
);

export default FieldManagementCard;

const styles = StyleSheet.create({
  card: {
    minHeight: 150,
    justifyContent: "space-between",
    padding: theme.spacing.xl,
  },
  heading: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.lg,
  },
  name: {
    flex: 1,
    color: theme.colors.white,
    fontSize: 19,
    lineHeight: 25,
    fontFamily: theme.fontFamilies.poppinsBold,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
    color: theme.colors.authTextSecondary,
  },
  footer: {
    marginTop: theme.spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  format: {
    color: theme.colors.accentSoft,
    fontFamily: theme.fontFamilies.outfitSemiBold,
  },
  price: {
    flexShrink: 1,
    color: theme.colors.authTextSecondary,
    textAlign: "right",
  },
});
