import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import { theme } from "@/src/theme";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

interface AuthBackButtonProps {
  accessibilityLabel?: string;
}

const AuthBackButton = ({
  accessibilityLabel = "Volver",
}: AuthBackButtonProps) => (
  <CustomButton
    icon={
      <CustomIcon
        icon={ArrowLeft01Icon}
        color={theme.colors.authText}
        sizeToken="medium"
      />
    }
    size="icon"
    variant="inverse"
    onPress={() => router.back()}
    style={styles.button}
    accessibilityLabel={accessibilityLabel}
  />
);

export default AuthBackButton;

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    minHeight: 44,
    backgroundColor: "transparent",
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
});
