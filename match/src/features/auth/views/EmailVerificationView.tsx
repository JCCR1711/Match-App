import AppFormIntro from "@/src/components/ui/AppFormIntro";
import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AuthButton from "@/src/features/auth/components/AuthButton";
import CustomText from "@/src/components/ui/CustomText";
import OtpCodeInput from "@/src/features/auth/components/OtpCodeInput";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { backOrReplace } from "@/src/utils/routerNavigation";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

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
    <AppScreenLayout
      title=""
      headerTitleAlign="center"
      headerTitleSize="compact"
      backgroundVariant="solid"
      keyboardAware
      onBack={() => backOrReplace("/auth/email")}
      backAccessibilityLabel="Cambiar correo"
    >
      <View style={styles.content}>
        <AppFormIntro
          title="Revisa tu"
          accentText="correo"
          description={`Enviado a ${userEmail}`}
        />
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
    </AppScreenLayout>
  );
};

export default EmailVerificationView;

const styles = StyleSheet.create({
  content: { gap: theme.layout.sectionGap },
  verification: {
    alignItems: "center",
    gap: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.errorSoft,
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
