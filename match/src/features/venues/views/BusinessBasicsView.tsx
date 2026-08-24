import AppFormIntro from "@/src/components/ui/AppFormIntro";
import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import VenueTextField from "@/src/features/venues/components/VenueTextField";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import { formatNationalPhone, isValidNationalPhone, PERU_PHONE_FORMAT, toInternationalPhone } from "@/src/features/venues/utils/phoneNumber";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import { backOrReplace } from "@/src/utils/routerNavigation";

type BusinessField = "businessName" | "contactPhone";

const BusinessBasicsView = () => {
  const { user, accessToken, initialized } = useAuth();
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
    <AppScreenLayout
      title=""
      headerTitleAlign="center"
      headerTitleSize="compact"
      backgroundVariant="solid"
      keyboardAware
      onBack={() => backOrReplace("/auth/select-mode")}
      backAccessibilityLabel="Volver a elegir modo"
      footer={!checkingDraft ? (
        <CustomButton
          label={submitting ? "Guardando..." : "Continuar"}
          variant="primary"
          onPress={handleContinue}
          disabled={submitting}
          style={styles.continueButton}
          labelStyle={styles.continueLabel}
          accessibilityLabel="Guardar datos del negocio y continuar"
        />
      ) : undefined}
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
                  <AppFormIntro
                    title="Configura tu"
                    accentText="club"
                    description="Configura los datos básicos para comenzar."
                  />

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
                    errorMessage={fieldError === "businessName" ? errorMessage : null}
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
                    errorMessage={fieldError === "contactPhone" ? errorMessage : null}
                    accessibilityLabel="Teléfono de contacto"
                  />

                {errorMessage && !fieldError ? (
                  <CustomText
                    text={errorMessage}
                    variant="caption"
                    style={styles.errorText}
                    accessibilityRole="alert"
                  />
                ) : null}

                  </View>
                </>
              )}
            </View>
    </AppScreenLayout>
  );
};

export default BusinessBasicsView;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: theme.layout.sectionGap,
  },
  contentLoading: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: theme.colors.textOnDarkSecondary,
  },
  form: {
    gap: theme.layout.groupGap,
  },
  errorText: {
    color: theme.colors.errorSoft,
    textAlign: "center",
  },
  continueButton: {
    minHeight: 62,
    borderRadius: theme.radius.pill,
    marginTop: theme.spacing.sm,
  },
  continueLabel: {
    ...theme.typography.action,
  },
});
