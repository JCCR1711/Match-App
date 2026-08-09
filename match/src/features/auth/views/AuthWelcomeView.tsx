import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import AuthBackButton from "@/src/features/auth/components/AuthBackButton";
import AuthButton from "@/src/features/auth/components/AuthButton";
import AuthFlowBackground from "@/src/features/auth/components/AuthFlowBackground";
import AuthProviderButtons from "@/src/features/auth/components/AuthProviderButtons";
import { theme } from "@/src/theme";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AuthWelcomeView = () => {
  const showPendingProvider = (provider: "Google" | "Apple") => {
    Alert.alert(
      `${provider} estará disponible pronto`,
      "El diseño está listo. Falta conectar y validar el proveedor con el servidor.",
    );
  };

  return (
    <View style={styles.root}>
    <StatusBar style="light" />
    <AuthFlowBackground />

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
          <View style={styles.message}>
            <Text style={styles.title}>Haz que el{"\n"}partido suceda</Text>
            <CustomText
              text="Entra con tu correo y encuentra tu próximo partido en minutos"
              variant="body"
              style={styles.description}
            />
          </View>

          <View style={styles.actions}>
            <AuthButton
              label="Continuar con correo"
              leadingIcon={
                <CustomIcon
                  icon={Mail01Icon}
                  sizeToken="small"
                  color={theme.colors.black}
                />
              }
              variant="secondary"
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
    paddingHorizontal: theme.spacing.lg,
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  message: {
    flex: 1,
    minHeight: 280,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.authText,
    ...theme.typography.screenTitle,
    textAlign: "center",
    paddingVertical: 2,
    includeFontPadding: true,
  },
  description: {
    maxWidth: 310,
    color: theme.colors.authText,
    opacity: 0.64,
    textAlign: "center",
  },
  actions: {
    width: "100%",
    gap: theme.spacing.md,
  },
  primaryButton: {
    height: 64,
    borderRadius: theme.radius.pill,
    borderCurve: "continuous",
  },
  buttonLabel: {
    ...theme.typography.action,
    textAlign: "center",
  },
});
