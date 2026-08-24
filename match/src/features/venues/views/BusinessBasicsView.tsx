import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import AppKeyboardAwareScrollView from "@/src/components/ui/AppKeyboardAwareScrollView";
import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import AppBackground from "@/src/components/ui/AppBackground";
import VenueTextField from "@/src/features/venues/components/VenueTextField";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import { formatNationalPhone, isValidNationalPhone, PERU_PHONE_FORMAT, toInternationalPhone } from "@/src/features/venues/utils/phoneNumber";
import { useAuth } from "@/src/hooks/useAuth";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type BusinessField = "businessName" | "contactPhone";

const BusinessBasicsView = () => {
  const { user, accessToken, initialized } = useAuth();
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();
  const [businessName, setBusinessName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [checkingDraft, setCheckingDraft] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<BusinessField | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (!user || user.activeMode !== "venue_manager" || !accessToken) {
      router.replace("/");
      return;
    }

    let active = true;
    const restoreDraft = async () => {
      try {
        const draft = await venueOnboardingGateway.getBusinessDraft(accessToken);
        if (active && draft) {
          router.replace("/(tabs)/dashboard");
        }
      } catch (restoreError) {
        if (active) {
          setErrorMessage(
            restoreError instanceof Error
              ? restoreError.message
              : "No pudimos recuperar tu club.",
          );
        }
      } finally {
        if (active) {
          setCheckingDraft(false);
        }
      }
    };

    void restoreDraft();

    return () => {
      active = false;
    };
  }, [accessToken, initialized, user]);

  const handleContinue = async () => {
    const normalizedName = businessName.trim();
    const internationalPhone = toInternationalPhone(contactPhone, PERU_PHONE_FORMAT);

    if (normalizedName.length < 2) {
      setFieldError("businessName");
      setErrorMessage("Ingresa el nombre del club.");
      return;
    }

    if (!isValidNationalPhone(contactPhone, PERU_PHONE_FORMAT)) {
      setFieldError("contactPhone");
      setErrorMessage("Ingresa un teléfono válido.");
      return;
    }

    if (!accessToken) {
      setFieldError(null);
      setErrorMessage("Tu sesión expiró. Ingresa nuevamente.");
      return;
    }

    setSubmitting(true);
    setFieldError(null);
    setErrorMessage(null);

    try {
      await venueOnboardingGateway.saveBusinessBasics(accessToken, {
        businessName: normalizedName,
        contactPhone: internationalPhone,
      });
      router.replace("/(tabs)/dashboard");
    } catch (submissionError) {
      setErrorMessage(
        submissionError instanceof Error
          ? submissionError.message
          : "No pudimos guardar el negocio.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppBackground />
      <AppScreenHeader title="Tu club" onBack={() => router.back()} backAccessibilityLabel="Volver" scrollY={scrollY} />

      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <AppKeyboardAwareScrollView
            style={styles.keyboardArea}
            contentContainerStyle={[styles.scrollContent, { paddingTop: headerContentInset + theme.spacing.xl }]}
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            <View
              style={[styles.content, checkingDraft && styles.contentLoading]}
            >
              {checkingDraft ? (
                <CustomText
                  text="Preparando tu club..."
                  variant="body"
                  style={styles.loadingText}
                />
              ) : (
                <>
                  <View style={styles.message}>
                    <CustomText
                      text="Empecemos con los datos principales."
                      variant="body"
                      style={styles.description}
                    />
                  </View>

                  <View style={styles.form}>
                    <VenueTextField
                    label="Nombre del club"
                    value={businessName}
                    onChangeText={(value) => {
                      setBusinessName(value);
                      setFieldError(null);
                      setErrorMessage(null);
                    }}
                    placeholder="Ej. Match Arena"
                    autoCapitalize="words"
                    autoComplete="organization"
                    editable={!submitting}
                    returnKeyType="next"
                    hasError={fieldError === "businessName"}
                    accessibilityLabel="Nombre del club"
                  />
                    <VenueTextField
                    label="Teléfono de contacto"
                    prefix={PERU_PHONE_FORMAT.callingCode}
                    value={contactPhone}
                    onChangeText={(value) => {
                      setContactPhone(formatNationalPhone(value, PERU_PHONE_FORMAT));
                      setFieldError(null);
                      setErrorMessage(null);
                    }}
                    placeholder="987 654 321"
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    editable={!submitting}
                    returnKeyType="done"
                    onSubmitEditing={handleContinue}
                    hasError={fieldError === "contactPhone"}
                    accessibilityLabel="Teléfono de contacto"
                  />

                {errorMessage ? (
                  <CustomText
                    text={errorMessage}
                    variant="caption"
                    style={styles.errorText}
                    accessibilityRole="alert"
                  />
                ) : null}

                <CustomButton
                  label={submitting ? "Guardando..." : "Continuar"}
                  variant="primary"
                  onPress={handleContinue}
                  disabled={submitting}
                  style={styles.continueButton}
                  labelStyle={styles.continueLabel}
                  accessibilityLabel="Guardar datos del negocio y continuar"
                />
                  </View>
                </>
              )}
            </View>
        </AppKeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
};

export default BusinessBasicsView;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.authCanvas,
  },
  safeArea: {
    flex: 1,
  },
  keyboardArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.huge,
  },
  content: {
    flex: 1,
    gap: theme.layout.sectionGap,
  },
  contentLoading: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: theme.colors.authTextSecondary,
  },
  message: {
    gap: theme.spacing.sm,
  },
  description: {
    color: theme.colors.authTextSecondary,
  },
  form: {
    gap: theme.layout.groupGap,
  },
  errorText: {
    color: theme.colors.authTextSecondary,
    textAlign: "center",
  },
  continueButton: {
    minHeight: 62,
    borderRadius: theme.radius.pill,
  },
  continueLabel: {
    ...theme.typography.action,
  },
});
