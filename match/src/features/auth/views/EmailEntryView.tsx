import AppFormIntro from "@/src/components/ui/AppFormIntro";
import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppTextField from "@/src/components/ui/AppTextField";
import AuthButton from "@/src/features/auth/components/AuthButton";
import { isValidEmail } from "@/src/features/auth/utils/isValidEmail";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { backOrReplace } from "@/src/utils/routerNavigation";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const EmailEntryView = () => {
  const [email, setEmail] = useState("");
  const [emailValidated, setEmailValidated] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const { error, loading, requestEmailCode, clearAuthError } = useAuth();

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailValidated(false);
    setFieldError(null);
    clearAuthError();
  };

  const handleContinue = async () => {
    if (!isValidEmail(email)) {
      setFieldError("Ingresa un correo válido.");
      return;
    }

    setEmailValidated(true);

    const sent = await requestEmailCode(email);
    if (sent) {
      router.push("/auth/verify-email");
    }
  };

  const visibleError = fieldError ?? error;
  const isEmailValid =
    emailValidated && isValidEmail(email) && !visibleError;

  return (
    <AppScreenLayout
      title=""
      headerTitleAlign="center"
      headerTitleSize="compact"
      backgroundVariant="solid"
      keyboardAware
      onBack={() => backOrReplace("/auth/welcome")}
      backAccessibilityLabel="Volver"
      footer={(
        <AuthButton
          label={loading ? "Enviando código..." : "Continuar"}
          variant="primary"
          onPress={handleContinue}
          disabled={loading}
          style={styles.continueButton}
          accessibilityLabel="Enviar código de acceso"
        />
      )}
    >
      <View style={styles.content}>
        <AppFormIntro
          title="Ingresa tu"
          accentText="correo"
          description="Te enviaremos un código de acceso de seis dígitos."
        />
        <AppTextField
                    label="Correo electrónico"
                    value={email}
                    onChangeText={handleEmailChange}
                    placeholder="nombre@correo.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="send"
                    onBlur={() => setEmailValidated(isValidEmail(email))}
                    onSubmitEditing={handleContinue}
                    editable={!loading}
                    isValid={isEmailValid}
                    errorMessage={visibleError}
                    accessibilityLabel="Correo electrónico"
        />
      </View>
    </AppScreenLayout>
  );
};

export default EmailEntryView;

const styles = StyleSheet.create({
  content: { gap: theme.layout.sectionGap },
  continueButton: {
    minHeight: 60,
    borderRadius: theme.radius.pill,
    borderCurve: "continuous",
  },
});
