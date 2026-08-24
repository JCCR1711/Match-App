import AppBackground from "@/src/components/ui/AppBackground";
import AuthButton from "@/src/features/auth/components/AuthButton";
import { useOnboarding } from "@/src/features/auth/context/OnboardingProvider";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnboardingSlide from "../components/OnboardingSlide";

const heroImage = require("../../../assets/Omboarding/onboarding-players-v3.png");

const OnboardingView = () => {
  const { completeOnboarding } = useOnboarding();

  const openWelcome = async () => {
    await completeOnboarding();
    router.replace("/auth/welcome");
  };

  const openSignIn = async () => {
    await completeOnboarding();
    router.replace("/auth/email");
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppBackground variant="dashboard" />

      <SafeAreaView style={styles.container}>
        <OnboardingSlide
          image={heroImage}
          imageAccessibilityLabel="Dos jugadores de fútbol caminando juntos"
          title="Tu próximo partido empieza aquí"
          description="Reserva una cancha, invita a tu equipo y juega."
        />

        <View style={styles.footer}>
          <AuthButton
            label="Empezar"
            variant="light"
            onPress={() => void openWelcome()}
            style={styles.primaryButton}
            labelStyle={styles.primaryButtonLabel}
            accessibilityLabel="Continuar con Match"
          />
          <AuthButton
            label="Iniciar sesión"
            textSize="secondary"
            variant="inverse"
            onPress={() => void openSignIn()}
            style={styles.signInButton}
            labelStyle={styles.signInButtonLabel}
            accessibilityLabel="Iniciar sesión con una cuenta existente"
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.black,
    overflow: "hidden",
  },
  container: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
    zIndex: 2,
  },
  primaryButton: {
    minHeight: 56,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.pill,
    borderWidth: 0,
    backgroundColor: theme.colors.white,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonLabel: {
    ...theme.typography.action,
  },
  signInButton: {
    minHeight: 48,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  signInButtonLabel: {
    color: theme.colors.textOnMediaSecondary,
    ...theme.typography.actionSecondary,
  },
});

export default OnboardingView;
