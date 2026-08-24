import AppFormIntro from "@/src/components/ui/AppFormIntro";
import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppTextField from "@/src/components/ui/AppTextField";
import CustomText from "@/src/components/ui/CustomText";
import AuthButton from "@/src/features/auth/components/AuthButton";
import TermsAcceptance from "@/src/features/auth/components/TermsAcceptance";
import { isValidUsername, normalizeUsername } from "@/src/features/auth/utils/username";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { backOrReplace } from "@/src/utils/routerNavigation";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const CompleteProfileView = () => {
  const [displayName, setDisplayName] = useState("");
  const [displayNameValidated, setDisplayNameValidated] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
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

    if (!isValidUsername(username)) {
      setUsernameError("Usa entre 3 y 20 letras, números o guiones bajos.");
      return;
    }

    setDisplayNameValidated(true);

    const completed = await completeSignUp(displayName, username);
    if (completed) {
      router.replace("/auth/select-mode");
    }
  };

  const clearErrors = () => {
    setFieldError(null);
    clearAuthError();
  };

  return (
    <AppScreenLayout
      title=""
      headerTitleAlign="center"
      headerTitleSize="compact"
      backgroundVariant="solid"
      keyboardAware
      onBack={() => backOrReplace("/auth/verify-email")}
      backAccessibilityLabel="Volver a verificar correo"
      footer={pendingSignUp ? (
        <AuthButton
          label={loading ? "Creando cuenta..." : "Crear cuenta"}
          variant="primary"
          onPress={handleSubmit}
          disabled={loading}
          style={styles.submitButton}
        />
      ) : (
        <AuthButton
          label="Solicitar un código nuevo"
          variant="primary"
          onPress={() => router.replace("/auth/email")}
          style={styles.submitButton}
          accessibilityLabel="Solicitar un nuevo código por correo"
        />
      )}
    >
      <View style={styles.content}>
        <AppFormIntro
          title={pendingSignUp ? "Crea tu" : "Verificación"}
          accentText={pendingSignUp ? "perfil" : "expirada"}
          description={pendingSignUp ? "Elige cómo aparecerás en Match." : "Solicita un código nuevo para continuar."}
        />
        {pendingSignUp ? (
                <View style={styles.fields}>
                <AppTextField
                    label="Nombre"
                    value={displayName}
                    onChangeText={(value) => {
                      setDisplayName(value);
                      setDisplayNameValidated(false);
                      clearErrors();
                    }}
                    placeholder="Nombre y apellido"
                    autoCapitalize="words"
                    autoComplete="name"
                    textContentType="name"
                    editable={!loading}
                    onBlur={() =>
                      setDisplayNameValidated(displayName.trim().length >= 2)
                    }
                    isValid={isDisplayNameValid}
                    errorMessage={fieldError}
                  accessibilityLabel="Nombre visible"
                />

                <AppTextField
                  label="Usuario"
                  prefix="@"
                  value={username}
                  onChangeText={(value) => {
                    setUsername(normalizeUsername(value));
                    setUsernameError(null);
                    clearAuthError();
                  }}
                  placeholder="tu_usuario"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="username-new"
                  textContentType="username"
                  maxLength={20}
                  editable={!loading}
                  isValid={isValidUsername(username) && !usernameError && !error}
                  errorMessage={usernameError}
                  accessibilityLabel="Nombre de usuario"
                />

                {error ? (
                  <CustomText
                    text={error}
                    variant="caption"
                    style={styles.formError}
                    accessibilityRole="alert"
                  />
                ) : null}

                <TermsAcceptance
                  onOpenTerms={() =>
                    router.push("/legal/terms-and-privacy")
                  }
                />
                </View>
        ) : null}
      </View>
    </AppScreenLayout>
  );
};

export default CompleteProfileView;

const styles = StyleSheet.create({
  content: { gap: theme.layout.sectionGap },
  fields: {
    gap: theme.spacing.lg,
  },
  formError: { color: theme.colors.errorSoft },
  submitButton: {
    minHeight: 60,
    borderRadius: theme.radius.pill,
    borderCurve: "continuous",
  },
});
