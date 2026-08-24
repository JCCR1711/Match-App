import CustomIcon from "@/src/components/ui/CustomIcon";
import AuthButton from "@/src/features/auth/components/AuthButton";
import { theme } from "@/src/theme";
import { AppleIcon, GoogleIcon } from "@hugeicons/core-free-icons";
import { StyleSheet, View } from "react-native";

interface AuthProviderButtonsProps {
  onGooglePress: () => void;
  onApplePress: () => void;
}

const AuthProviderButtons = ({
  onGooglePress,
  onApplePress,
}: AuthProviderButtonsProps) => (
  <View style={styles.container}>
    <AuthButton
        label="Google"
        leadingIcon={<CustomIcon icon={GoogleIcon} size={20} color={theme.colors.white} />}
        variant="inverse"
        onPress={onGooglePress}
        style={[styles.providerButton, styles.googleButton]}
        labelStyle={styles.googleLabel}
        accessibilityLabel="Continuar con Google"
      />
      <AuthButton
        label="Apple"
        leadingIcon={<CustomIcon icon={AppleIcon} size={22} color={theme.colors.white} />}
        variant="inverse"
        onPress={onApplePress}
        style={[styles.providerButton, styles.appleButton]}
        labelStyle={styles.appleLabel}
        accessibilityLabel="Continuar con Apple"
      />
  </View>
);

export default AuthProviderButtons;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  providerButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: theme.radius.extraLarge,
  },
  googleButton: {
    borderWidth: 1,
    borderColor: theme.colors.controlBorderOnDark,
    backgroundColor: theme.colors.authSurface,
    shadowOpacity: 0,
    elevation: 0,
  },
  appleButton: {
    borderWidth: 1,
    borderColor: theme.colors.dividerOnDark,
    backgroundColor: theme.colors.black,
    shadowOpacity: 0,
    elevation: 0,
  },
  googleLabel: {
    color: theme.colors.white,
    ...theme.typography.action,
  },
  appleLabel: {
    color: theme.colors.white,
    ...theme.typography.action,
  },
});
