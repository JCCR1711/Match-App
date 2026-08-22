import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import AppBackground from "@/src/components/ui/AppBackground";
import VenueTextField from "@/src/features/venues/components/VenueTextField";
import WeeklyScheduleEditor from "@/src/features/venues/components/WeeklyScheduleEditor";
import { detectVenueLocation } from "@/src/features/venues/services/detectVenueLocation";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import {
  BusinessOnboardingDraft,
  VenueCoordinates,
  WeeklySchedule,
} from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { Location01Icon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type LocationField = "venueName" | "address" | "district" | "city";

const VenueLocationView = () => {
  const { accessToken } = useAuth();
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();
  const [draft, setDraft] = useState<BusinessOnboardingDraft | null>(null);
  const [venueName, setVenueName] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [coordinates, setCoordinates] = useState<VenueCoordinates | null>(null);
  const [locating, setLocating] = useState(false);
  const [configureSchedule, setConfigureSchedule] = useState(false);
  const [defaultSchedule, setDefaultSchedule] = useState<WeeklySchedule>({
    weekdays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    openingTime: "08:00",
    closingTime: "23:00",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<LocationField | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      router.replace("/");
      return;
    }

    let active = true;
    const loadDraft = async () => {
      try {
        const currentDraft =
          await venueOnboardingGateway.getBusinessDraft(accessToken);
        if (!active) {
          return;
        }

        if (!currentDraft) {
          router.replace("/business/setup");
          return;
        }

        setDraft(currentDraft);
      } catch (loadError) {
        if (active) {
          setErrorMessage(
            loadError instanceof Error
              ? loadError.message
              : "No pudimos cargar tu club.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadDraft();

    return () => {
      active = false;
    };
  }, [accessToken]);

  const clearError = () => {
    setFieldError(null);
    setErrorMessage(null);
  };

  const handleDetectLocation = async () => {
    setLocating(true);
    clearError();
    try {
      const detectedLocation = await detectVenueLocation();
      setAddress(detectedLocation.address);
      setDistrict(detectedLocation.district);
      setCity(detectedLocation.city);
      setCoordinates(detectedLocation.coordinates);
    } catch (locationError) {
      setErrorMessage(
        locationError instanceof Error
          ? locationError.message
          : "No pudimos detectar tu ubicación.",
      );
    } finally {
      setLocating(false);
    }
  };

  const validate = () => {
    const fields: [LocationField, string, string][] = [
      ["venueName", venueName, "Ingresa un nombre para la sede."],
      ["address", address, "Ingresa la dirección."],
      ["district", district, "Ingresa el distrito."],
      ["city", city, "Ingresa la ciudad."],
    ];

    const invalidField = fields.find(([, value]) => value.trim().length < 2);
    if (invalidField) {
      setFieldError(invalidField[0]);
      setErrorMessage(invalidField[2]);
      return false;
    }

    if (
      configureSchedule &&
      (defaultSchedule.weekdays.length === 0 ||
        defaultSchedule.openingTime >= defaultSchedule.closingTime)
    ) {
      setErrorMessage("Revisa los días y horas del horario general.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validate() || !draft || !accessToken) {
      return;
    }

    setSubmitting(true);
    clearError();

    try {
      await venueOnboardingGateway.saveVenueLocation(
        accessToken,
        draft.organizationId,
        {
          venueName: venueName.trim(),
          address: address.trim(),
          district: district.trim(),
          city: city.trim(),
          coordinates,
          status: "active",
          defaultSchedule: configureSchedule ? defaultSchedule : null,
        },
      );
      router.replace("/(tabs)/dashboard");
    } catch (saveError) {
      setErrorMessage(
        saveError instanceof Error
          ? saveError.message
          : "No pudimos guardar la sede.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppBackground />
      <AppScreenHeader title="Nueva sede" onBack={() => router.back()} backAccessibilityLabel="Volver al panel" scrollY={scrollY} />

      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <KeyboardAvoidingView
          style={styles.keyboardArea}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Animated.ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingTop: headerContentInset + theme.spacing.xl }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {loading ? (
              <CustomText
                text="Preparando la sede..."
                variant="body"
                style={styles.loadingText}
              />
            ) : (
              <View style={styles.content}>
                <CustomText
                  text="Ubica tu sede para empezar."
                  variant="body"
                  style={styles.description}
                />

                <View style={styles.form}>
                  <CustomButton
                    label={locating ? "Buscando ubicación..." : "Usar mi ubicación"}
                    leadingIcon={
                      <CustomIcon
                        icon={Location01Icon}
                        color={theme.colors.white}
                        size={27}
                        strokeWidth={2.2}
                      />
                    }
                    variant="inverse"
                    onPress={handleDetectLocation}
                    disabled={locating || submitting}
                    style={styles.locationButton}
                    accessibilityLabel="Detectar la ubicación de la sede"
                  />
                  <VenueTextField
                    label="Nombre de la sede"
                    value={venueName}
                    onChangeText={(value) => {
                      setVenueName(value);
                      clearError();
                    }}
                    placeholder="Ej. Sede San Miguel"
                    autoCapitalize="words"
                    editable={!submitting}
                    hasError={fieldError === "venueName"}
                    accessibilityLabel="Nombre de la sede"
                  />
                  <VenueTextField
                    label="Dirección"
                    value={address}
                    onChangeText={(value) => {
                      setAddress(value);
                      setCoordinates(null);
                      clearError();
                    }}
                    placeholder="Av. Principal 123"
                    autoCapitalize="words"
                    autoComplete="street-address"
                    editable={!submitting}
                    hasError={fieldError === "address"}
                    accessibilityLabel="Dirección de la sede"
                  />
                  <VenueTextField
                      label="Distrito"
                      value={district}
                      onChangeText={(value) => {
                        setDistrict(value);
                        setCoordinates(null);
                        clearError();
                      }}
                      placeholder="Distrito"
                      autoCapitalize="words"
                      editable={!submitting}
                      hasError={fieldError === "district"}
                      accessibilityLabel="Distrito de la sede"
                  />
                  <VenueTextField
                      label="Ciudad"
                      value={city}
                      onChangeText={(value) => {
                        setCity(value);
                        setCoordinates(null);
                        clearError();
                      }}
                      placeholder="Ciudad"
                      autoCapitalize="words"
                      autoComplete="postal-address-locality"
                      editable={!submitting}
                      hasError={fieldError === "city"}
                      accessibilityLabel="Ciudad de la sede"
                  />

                  <View style={styles.scheduleSection}>
                    <View style={styles.sectionHeading}>
                      <CustomText text="Horario general" variant="body" style={styles.sectionTitle} />
                      <CustomText
                        text="Las canchas podrán usar este horario automáticamente."
                        variant="caption"
                        style={styles.description}
                      />
                    </View>
                    <CustomButton
                      label={configureSchedule ? "Quitar horario general" : "Configurar horario"}
                      variant="inverse"
                      onPress={() => setConfigureSchedule((current) => !current)}
                      disabled={submitting}
                      style={styles.compactAction}
                    />
                    {configureSchedule ? (
                      <WeeklyScheduleEditor
                        value={defaultSchedule}
                        onChange={setDefaultSchedule}
                        disabled={submitting}
                      />
                    ) : null}
                  </View>

                  {errorMessage ? (
                    <CustomText
                      text={errorMessage}
                      variant="caption"
                      style={styles.errorText}
                      accessibilityRole="alert"
                    />
                  ) : null}

                  <CustomButton
                    label={submitting ? "Guardando..." : "Guardar sede"}
                    variant="primary"
                    onPress={handleSave}
                    disabled={submitting}
                    style={styles.saveButton}
                    labelStyle={styles.saveButtonLabel}
                  />
                </View>
              </View>
            )}
          </Animated.ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default VenueLocationView;

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
  loadingText: {
    marginTop: "auto",
    marginBottom: "auto",
    color: theme.colors.authTextSecondary,
    textAlign: "center",
  },
  content: {
    flex: 1,
    gap: theme.layout.sectionGap,
  },
  description: {
    color: theme.colors.authTextSecondary,
  },
  form: {
    gap: theme.layout.groupGap,
  },
  locationButton: {
    minHeight: 54,
    borderWidth: 0,
    backgroundColor: theme.colors.deepTeal,
  },
  scheduleSection: { gap: theme.spacing.lg, paddingTop: theme.spacing.md },
  sectionHeading: { gap: theme.spacing.xxs },
  sectionTitle: { color: theme.colors.authText, fontFamily: theme.fontFamilies.poppinsBold },
  compactAction: { minHeight: 50, borderColor: "transparent", backgroundColor: theme.colors.surface },
  errorText: {
    color: theme.colors.authTextSecondary,
    textAlign: "center",
  },
  saveButton: {
    minHeight: 62,
    borderRadius: theme.radius.pill,
  },
  saveButtonLabel: {
    ...theme.typography.action,
  },
});
