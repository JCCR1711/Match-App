import AppBackground from "@/src/components/ui/AppBackground";
import AppFormIntro from "@/src/components/ui/AppFormIntro";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import AuthBackButton from "@/src/features/auth/components/AuthBackButton";
import AuthButton from "@/src/features/auth/components/AuthButton";
import AuthProviderButtons from "@/src/features/auth/components/AuthProviderButtons";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { Building03Icon, Mail01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AuthWelcomeView = () => {
  const { signInDemo, loading } = useAuth();

  const openDemo = async (mode: "player" | "venue_manager") => {
    const authenticated = await signInDemo(mode);
    if (!authenticated) return;
    router.replace(mode === "player" ? "/(tabs)" : "/(tabs)/dashboard");
  };

  const showPendingProvider = (provider: "Google" | "Apple") => {
    Alert.alert(
      `${provider} estará disponible pronto`,
      "El diseño está listo. Falta conectar y validar el proveedor con el servidor.",
    );
  };

  return (
    <View style={styles.root}>
    <StatusBar style="light" />
    <AppBackground variant="dashboard" />

    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <AuthBackButton accessibilityLabel="Volver a las diapositivas" />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.content}>
          <AppFormIntro
            title="Bienvenido a"
            accentText="Match"
            description="Juega o administra tus canchas desde una sola cuenta."
          />

          <View style={styles.actions}>
            {__DEV__ ? (
              <View style={styles.demoSection}>
                <CustomText text="Acceso rápido" variant="caption" style={styles.demoLabel} />
                <View style={styles.demoActions}>
                  <AuthButton
                    label="Jugador"
                    leadingIcon={<CustomIcon icon={UserIcon} sizeToken="small" color={theme.colors.black} />}
                    variant="light"
                    accessibilityLabel="Entrar con el usuario de prueba jugador"
                    onPress={() => void openDemo("player")}
                    disabled={loading}
                    style={styles.demoButton}
                    textSize="secondary"
                  />
                  <AuthButton
                    label="Negocio"
                    leadingIcon={<CustomIcon icon={Building03Icon} sizeToken="small" color={theme.colors.black} />}
                    variant="light"
                    accessibilityLabel="Entrar con el usuario de prueba negocio"
                    onPress={() => void openDemo("venue_manager")}
                    disabled={loading}
                    style={styles.demoButton}
                    textSize="secondary"
                  />
                </View>
              </View>
            ) : null}
            <AuthButton
              label="Continuar con correo"
              leadingIcon={
                <CustomIcon
                  icon={Mail01Icon}
                  sizeToken="small"
                  color={theme.colors.white}
                />
              }
              variant="primary"
              accessibilityLabel="Continuar con correo"
              onPress={() => router.push("/auth/email")}
              style={styles.primaryButton}
              labelStyle={styles.buttonLabel}
            />
            <AuthProviderButtons
              onGooglePress={() => showPendingProvider("Google")}
              onApplePress={() => showPendingProvider("Apple")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </View>
  );
};

export default AuthWelcomeView;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.authCanvas,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    minHeight: 56,
    paddingHorizontal: theme.layout.screenGutter,
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.layout.screenGutter,
    paddingBottom: theme.spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    gap: theme.layout.sectionGap,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  actions: {
    width: "100%",
    gap: theme.spacing.md,
  },
  demoSection: {
    gap: theme.spacing.sm,
  },
  demoLabel: {
    color: theme.colors.authTextSecondary,
    textAlign: "center",
  },
  demoActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  demoButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: theme.radius.large,
  },
  primaryButton: {
    minHeight: 60,
    borderRadius: theme.radius.pill,
    borderCurve: "continuous",
  },
  buttonLabel: {
    ...theme.typography.action,
    textAlign: "center",
  },
});
