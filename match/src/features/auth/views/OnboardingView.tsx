import AuthButton from "@/src/features/auth/components/AuthButton";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnboardingBackground from "../components/OnboardingBackground";
import OnboardingSlide from "../components/OnboardingSlide";

const heroImage = require("../../../assets/Omboarding/match3.png");

const OnboardingView = () => {
  const openWelcome = () => {
    router.push("/auth/welcome");
  };

  const openSignIn = () => {
    router.push("/auth/email");
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <OnboardingBackground />

      <SafeAreaView style={styles.container}>
        <View style={styles.hero}>
          <OnboardingSlide
            image={heroImage}
            imageAccessibilityLabel="Jugador de fútbol y gestor deportivo"
            title={"Tu partido\nempieza aquí"}
            description="Encuentra cancha, reúne a tu equipo y juega."
          />
        </View>

        <View style={styles.footer}>
          <AuthButton
            label="Continuar"
            variant="secondary"
            onPress={openWelcome}
            style={styles.primaryButton}
            labelStyle={styles.primaryButtonLabel}
            accessibilityLabel="Continuar con Match"
          />
          <AuthButton
            label="Ya tengo una cuenta"
            textSize="secondary"
            variant="inverse"
            onPress={openSignIn}
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
  hero: {
    ...StyleSheet.absoluteFillObject,
  },
  footer: {
    marginTop: "auto",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
    zIndex: 2,
  },
  primaryButton: {
    height: 60,
    borderRadius: theme.radius.pill,
    borderWidth: 0,
    backgroundColor: theme.colors.authPrimary,
    shadowColor: theme.colors.white,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 6,
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
    color: "rgba(255, 255, 255, 0.76)",
    ...theme.typography.actionSecondary,
  },
});

export default OnboardingView;
