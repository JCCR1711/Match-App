import AuthButton from "@/src/features/auth/components/AuthButton";
import CustomText from "@/src/components/ui/CustomText";
import AuthBackButton from "@/src/features/auth/components/AuthBackButton";
import AuthFlowBackground from "@/src/features/auth/components/AuthFlowBackground";
import AuthTextField from "@/src/features/auth/components/AuthTextField";
import { isValidEmail } from "@/src/features/auth/utils/isValidEmail";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <View style={styles.root}>
      <StatusBar style="light" />
      <AuthFlowBackground flowVariant="email" />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <AuthBackButton />
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardArea}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <View style={styles.message}>
                <Text style={styles.title}>¿Cuál es tu{"\n"}correo?</Text>
                <CustomText
                  text="Lo usaremos para enviarte un código de acceso de seis dígitos"
                  variant="body"
                  style={styles.description}
                />
              </View>

              <View style={styles.form}>
                <AuthTextField
                    label="Correo electrónico"
                    value={email}
                    onChangeText={handleEmailChange}
                    placeholder="tu@correo.com"
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

                <AuthButton
                  label={loading ? "Enviando código..." : "Continuar"}
                  variant="secondary"
                  onPress={handleContinue}
                  disabled={loading}
                  style={styles.continueButton}
                  accessibilityLabel="Enviar código de acceso"
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default EmailEntryView;

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
    maxWidth: 320,
    color: theme.colors.authTextSecondary,
  },
  form: {
    gap: theme.spacing.lg,
  },
  continueButton: {
    height: 62,
    borderRadius: theme.radius.pill,
    borderCurve: "continuous",
  },
});
