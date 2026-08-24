import AuthButton from "@/src/features/auth/components/AuthButton";
import CustomText from "@/src/components/ui/CustomText";
import AppKeyboardAwareScrollView from "@/src/components/ui/AppKeyboardAwareScrollView";
import AuthBackButton from "@/src/features/auth/components/AuthBackButton";
import AuthFlowBackground from "@/src/features/auth/components/AuthFlowBackground";
import AuthTextField from "@/src/features/auth/components/AuthTextField";
import TermsAcceptance from "@/src/features/auth/components/TermsAcceptance";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CompleteProfileView = () => {
  const [displayName, setDisplayName] = useState("");
  const [displayNameValidated, setDisplayNameValidated] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const {
    pendingSignUp,
    error,
    loading,
    completeSignUp,
    clearAuthError,
  } = useAuth();
  const isDisplayNameValid =
    displayNameValidated &&
    displayName.trim().length >= 2 &&
    !fieldError &&
    !error;

  const handleSubmit = async () => {
    if (displayName.trim().length < 2) {
      setFieldError("Ingresa un nombre válido.");
      return;
    }

    setDisplayNameValidated(true);

    const completed = await completeSignUp(displayName);
    if (completed) {
      router.replace("/auth/select-mode");
    }
  };

  const clearErrors = () => {
    setFieldError(null);
    clearAuthError();
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AuthFlowBackground flowVariant="profile" />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <AuthBackButton accessibilityLabel="Volver a verificar correo" />
        </View>

        <AppKeyboardAwareScrollView
            style={styles.keyboardArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <View style={styles.message}>
                <Text style={styles.title}>
                  {pendingSignUp
                    ? "Crea tu perfil"
                    : "Verificación\nexpirada"}
                </Text>
                <CustomText
                  text={
                    pendingSignUp
                      ? "Elige cómo aparecerás en Match."
                      : "Solicita un código nuevo para continuar."
                  }
                  variant="body"
                  style={styles.description}
                />
              </View>

              {pendingSignUp ? (
                <View style={styles.form}>
                <AuthTextField
                    label="Nombre visible"
                    value={displayName}
                    onChangeText={(value) => {
                      setDisplayName(value);
                      setDisplayNameValidated(false);
                      clearErrors();
                    }}
                    placeholder="¿Cómo quieres que te llamemos?"
                    autoCapitalize="words"
                    autoComplete="name"
                    textContentType="name"
                    editable={!loading}
                    onBlur={() =>
                      setDisplayNameValidated(displayName.trim().length >= 2)
                    }
                    isValid={isDisplayNameValid}
                    errorMessage={fieldError ?? error}
                    accessibilityLabel="Nombre visible"
                  />

                <TermsAcceptance
                  onOpenTerms={() =>
                    router.push("/legal/terms-and-privacy")
                  }
                />

                <AuthButton
                  label={loading ? "Creando cuenta..." : "Crear cuenta"}
                  variant="primary"
                  onPress={handleSubmit}
                  disabled={loading}
                  style={styles.submitButton}
                />
                </View>
              ) : (
                <AuthButton
                  label="Solicitar un código nuevo"
                  variant="primary"
                  onPress={() => router.replace("/auth/email")}
                  style={styles.submitButton}
                  accessibilityLabel="Solicitar un nuevo código por correo"
                />
              )}
            </View>
        </AppKeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
};

export default CompleteProfileView;

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
  keyboardArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  message: {
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.authText,
    ...theme.typography.screenTitle,
  },
  description: {
    color: theme.colors.authTextSecondary,
  },
  form: {
    gap: theme.spacing.md,
  },
  submitButton: {
    height: 62,
    borderRadius: theme.radius.pill,
    borderCurve: "continuous",
  },
});
