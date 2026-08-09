import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { StyleSheet, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
}

const ScreenHeader = ({ title, onBack }: ScreenHeaderProps) => (
  <View style={styles.container}>
    <CustomButton
      icon={<CustomIcon icon={ArrowLeft01Icon} color={theme.colors.white} size={24} />}
      size="icon"
      variant="inverse"
      onPress={onBack}
      style={styles.backButton}
      accessibilityLabel="Volver"
    />
    <CustomText text={title} variant="body" style={styles.title} />
    <View style={styles.spacer} />
  </View>
);

export default ScreenHeader;

const styles = StyleSheet.create({
  container: {
    minHeight: 58,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 44,
    minHeight: 44,
    height: 44,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  title: {
    color: theme.colors.authText,
    fontSize: 17,
  },
  spacer: { width: 44 },
});
