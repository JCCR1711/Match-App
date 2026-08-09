import CustomIcon from "@/src/components/ui/CustomIcon";
import AuthButton from "@/src/features/auth/components/AuthButton";
import { theme } from "@/src/theme";
import { AppleIcon, GoogleIcon } from "@hugeicons/core-free-icons";
import { StyleSheet, Text, View } from "react-native";

interface AuthProviderButtonsProps {
  onGooglePress: () => void;
  onApplePress: () => void;
}

const AuthProviderButtons = ({
  onGooglePress,
  onApplePress,
}: AuthProviderButtonsProps) => (
  <View style={styles.container}>
    <View style={styles.separator} accessibilityElementsHidden>
      <View style={styles.separatorLine} />
      <Text style={styles.separatorText}>o continúa con</Text>
      <View style={styles.separatorLine} />
    </View>

    <AuthButton
      label="Google"
      leadingIcon={
        <CustomIcon icon={GoogleIcon} size={20} color={theme.colors.white} />
      }
      variant="inverse"
      onPress={onGooglePress}
      style={[styles.providerButton, styles.googleButton]}
      labelStyle={styles.googleLabel}
      accessibilityLabel="Continuar con Google"
    />
    <AuthButton
      label="Apple"
      leadingIcon={
        <CustomIcon icon={AppleIcon} size={22} color={theme.colors.white} />
      }
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
    gap: theme.spacing.sm,
  },
  separator: {
    minHeight: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  separatorText: {
    color: theme.colors.authTextSecondary,
    ...theme.typography.caption,
  },
  providerButton: {
    minHeight: 56,
    borderRadius: theme.radius.pill,
  },
  googleButton: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
    backgroundColor: theme.colors.authSurface,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 4,
  },
  appleButton: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
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
