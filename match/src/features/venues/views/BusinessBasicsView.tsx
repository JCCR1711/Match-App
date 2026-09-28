import AppFormIntro from "@/src/components/ui/AppFormIntro";
import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppFeedbackNotice from "@/src/components/ui/AppFeedbackNotice";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import VenueTextField from "@/src/features/venues/components/VenueTextField";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
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
  const canCheckDraft = initialized && Boolean(user?.activeMode === "venue_manager" && accessToken);
  const { draft, loading: checkingDraft, error: draftError, updateDraft } = useBusinessDraft({
    redirectWhenMissing: false,
    enabled: canCheckDraft,
  });
  const [businessName, setBusinessName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<BusinessField | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const preparingDraft = !initialized || (canCheckDraft && checkingDraft);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (!user || user.activeMode !== "venue_manager" || !accessToken) {
      router.replace("/");
      return;
    }

    if (draft) router.replace("/(tabs)/dashboard");
  }, [accessToken, draft, initialized, user]);

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
      const updatedDraft = await venueOnboardingGateway.saveBusinessBasics(accessToken, {
        businessName: normalizedName,
        contactPhone: internationalPhone,
      });
      updateDraft(updatedDraft);
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
      footer={!preparingDraft ? (
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
              style={[styles.content, preparingDraft && styles.contentLoading]}
            >
              {preparingDraft ? (
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

                {(errorMessage || draftError) && !fieldError ? (
                  <AppFeedbackNotice message={errorMessage ?? draftError ?? ""} />
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
  continueButton: {
    minHeight: 62,
    borderRadius: theme.radius.pill,
    marginTop: theme.spacing.sm,
  },
  continueLabel: {
    ...theme.typography.action,
  },
});
