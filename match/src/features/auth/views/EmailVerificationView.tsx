import AuthButton from "@/src/features/auth/components/AuthButton";
import CustomText from "@/src/components/ui/CustomText";
import AuthBackButton from "@/src/features/auth/components/AuthBackButton";
import AuthFlowBackground from "@/src/features/auth/components/AuthFlowBackground";
import OtpCodeInput from "@/src/features/auth/components/OtpCodeInput";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EmailVerificationView = () => {
  const {
    userEmail,
    error,
    loading,
    codeExpiresInSeconds,
    pendingSignUp,
    isAuthenticated,
    verifyEmailCode,
    resendEmailCode,
    clearAuthError,
  } = useAuth();
  const [code, setCode] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(
    codeExpiresInSeconds,
  );
  const lastSubmittedCode = useRef("");

  useEffect(() => {
    if (!userEmail) {
      router.replace("/auth/email");
    }
  }, [userEmail]);

  useEffect(() => {
    if (pendingSignUp) {
      router.replace("/auth/complete-profile");
      return;
    }

    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, pendingSignUp]);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setSecondsRemaining((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsRemaining]);

  useEffect(() => {
    if (code.length !== 6 || code === lastSubmittedCode.current || loading) {
      return;
    }

    lastSubmittedCode.current = code;
    void verifyEmailCode(code);
  }, [code, loading, verifyEmailCode]);

  useEffect(() => {
    if (!error) {
      return;
    }

    setCode("");
    lastSubmittedCode.current = "";
  }, [error]);

  const handleCodeChange = (nextCode: string) => {
    setCode(nextCode);
    clearAuthError();
  };

  const handleResend = async () => {
    const resent = await resendEmailCode();
    if (resent) {
      setCode("");
      lastSubmittedCode.current = "";
      setSecondsRemaining(codeExpiresInSeconds);
    }
  };

  const countdown = `00:${secondsRemaining.toString().padStart(2, "0")}`;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AuthFlowBackground flowVariant="verification" />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <AuthBackButton accessibilityLabel="Cambiar correo" />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.message}>
              <Text style={styles.title}>Tu código</Text>
              <CustomText
                text={`Enviado a ${userEmail}`}
                variant="body"
                style={styles.description}
              />
            </View>

            <View style={styles.verification}>
              <OtpCodeInput
                value={code}
                onChange={handleCodeChange}
                disabled={loading}
                hasError={Boolean(error)}
                isValid={Boolean(pendingSignUp) || isAuthenticated}
              />

              {error ? (
                <CustomText
                  text={error}
                  variant="caption"
                  style={styles.errorText}
                  accessibilityRole="alert"
                />
              ) : (
                <CustomText
                  text={loading ? "Verificando..." : "Se verifica automáticamente"}
                  variant="caption"
                  style={styles.statusText}
                />
              )}

              <AuthButton
                label={
                  secondsRemaining > 0
                    ? `Reenviar en ${countdown}`
                    : "Reenviar código"
                }
                variant="inverse"
                textSize="secondary"
                onPress={handleResend}
                disabled={secondsRemaining > 0 || loading}
                style={styles.resendButton}
                labelStyle={styles.resendLabel}
                accessibilityLabel="Reenviar código de acceso"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default EmailVerificationView;

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
    paddingTop: theme.spacing.xl,
    gap: 72,
  },
  message: {
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.authText,
    ...theme.typography.screenTitle,
  },
  description: {
    maxWidth: 330,
    color: theme.colors.authTextSecondary,
  },
  verification: {
    alignItems: "center",
    gap: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.authTextSecondary,
    textAlign: "center",
  },
  statusText: {
    color: theme.colors.authTextSecondary,
    textAlign: "center",
  },
  resendButton: {
    minHeight: 48,
    marginTop: theme.spacing.sm,
    backgroundColor: "transparent",
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  resendLabel: {
    color: theme.colors.authText,
  },
});
