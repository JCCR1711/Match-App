import CustomText from "@/src/components/ui/CustomText";
import BusinessHighlightSurface from "@/src/features/dashboard/components/BusinessHighlightSurface";
import type { BusinessAvailabilityOpportunity } from "@/src/features/reservations/utils/getBusinessAvailabilityOpportunity";
import { theme } from "@/src/theme";
import { StyleSheet } from "react-native";

const BusinessOpportunityCard = ({
  opportunity,
  onPress,
}: {
  opportunity: NonNullable<BusinessAvailabilityOpportunity["bestSlot"]>;
  onPress: () => void;
}) => {
  const hours = Math.floor(opportunity.durationMinutes / 60);
  const minutes = opportunity.durationMinutes % 60;
  const availabilityLabel = [
    hours > 0 ? `${hours} h` : null,
    minutes > 0 ? `${minutes} min` : null,
  ].filter(Boolean).join(" ");

  return (
  <BusinessHighlightSurface
    accessibilityLabel={`${availabilityLabel} disponibles en ${opportunity.fieldName}, desde las ${opportunity.startTime}. Ver en agenda`}
    onPress={onPress}
    tone="navy"
  >
    <CustomText
      text={`${availabilityLabel} disponibles`}
      variant="subtitle"
      style={styles.title}
    />
    <CustomText
      text={`${opportunity.fieldName} · desde ${opportunity.startTime}`}
      variant="caption"
      style={styles.detail}
      numberOfLines={1}
    />
  </BusinessHighlightSurface>
  );
};

export default BusinessOpportunityCard;

const styles = StyleSheet.create({
  title: {
    color: theme.colors.white,
  },
  detail: {
    marginTop: theme.spacing.xs,
    color: theme.colors.textOnDarkSecondary,
  },
});
