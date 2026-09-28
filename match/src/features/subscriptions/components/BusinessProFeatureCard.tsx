import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import BusinessProEmblem from "@/src/features/subscriptions/components/BusinessProEmblem";
import { theme } from "@/src/theme";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

interface BusinessProFeatureCardProps {
  title: string;
  message: string;
  onPress: () => void;
}

const BusinessProFeatureCard = ({ title, message, onPress }: BusinessProFeatureCardProps) => (
  <LinearGradient
    colors={[theme.colors.premiumPlanDeep, theme.colors.premiumPlanBright]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.card}
  >
    <BusinessProEmblem decorative contained alignRight style={styles.emblem} />
    <View style={styles.copy}>
      <CustomText text={title} variant="sectionHeading" style={styles.title} />
      <CustomText text={message} variant="body" style={styles.message} />
    </View>
    <CustomButton label="Ver Pro" variant="light" onPress={onPress} style={styles.action} />
  </LinearGradient>
);

export default BusinessProFeatureCard;

const styles = StyleSheet.create({
  card: {
    minHeight: 210,
    overflow: "hidden",
    gap: theme.spacing.xl,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.card,
    borderCurve: "continuous",
  },
  emblem: {
    position: "absolute",
    top: 4,
    right: -8,
    width: 190,
    height: 160,
    opacity: 0.92,
  },
  copy: { maxWidth: "68%", gap: theme.spacing.sm },
  title: { color: theme.colors.white },
  message: { color: theme.colors.textOnDarkSecondary },
  action: { alignSelf: "flex-start", minHeight: 48, borderRadius: theme.radius.pill, paddingHorizontal: theme.spacing.xl },
});
