import CustomText from "@/src/components/ui/CustomText";
import BusinessHighlightSurface from "@/src/features/dashboard/components/BusinessHighlightSurface";
import { theme } from "@/src/theme";
import { StyleSheet } from "react-native";

const BusinessOpportunityCard = ({
  availableHours,
  onPress,
}: {
  availableHours: number;
  onPress: () => void;
}) => (
  <BusinessHighlightSurface
    accessibilityLabel={`${availableHours} horas disponibles hoy`}
    onPress={onPress}
    tone="navy"
  >
    <CustomText
      text={`${availableHours} h disponibles`}
      variant="subtitle"
      style={styles.title}
    />
  </BusinessHighlightSurface>
);

export default BusinessOpportunityCard;

const styles = StyleSheet.create({
  title: {
    color: theme.colors.white,
  },
});
