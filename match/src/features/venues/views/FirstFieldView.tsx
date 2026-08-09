import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import VenueSetupBackground from "@/src/features/venues/components/VenueSetupBackground";
import VenueCardOption from "@/src/features/venues/components/VenueCardOption";
import VenueChoicePill from "@/src/features/venues/components/VenueChoicePill";
import VenueTextField from "@/src/features/venues/components/VenueTextField";
import WeeklyScheduleEditor from "@/src/features/venues/components/WeeklyScheduleEditor";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import {
  BusinessOnboardingDraft,
  FieldScheduleMode,
  FieldFormat,
  WeeklySchedule,
} from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { router, useLocalSearchParams } from "expo-router";
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

const FIELD_FORMATS: { value: FieldFormat; label: string }[] = [
  { value: "5v5", label: "Fútbol 5" },
  { value: "7v7", label: "Fútbol 7" },
  { value: "11v11", label: "Fútbol 11" },
];

const FirstFieldView = () => {
  const { venueId } = useLocalSearchParams<{ venueId?: string }>();
  const { accessToken } = useAuth();
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();
  const [draft, setDraft] = useState<BusinessOnboardingDraft | null>(null);
  const [fieldName, setFieldName] = useState("");
  const [format, setFormat] = useState<FieldFormat | null>(null);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [scheduleMode, setScheduleMode] = useState<FieldScheduleMode>("inherit");
  const [scheduleOverride, setScheduleOverride] = useState<WeeklySchedule>({
    weekdays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    openingTime: "08:00",
    closingTime: "23:00",
  });
  const [hourlyPrice, setHourlyPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fieldNameError, setFieldNameError] = useState(false);
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

        if (!currentDraft?.location) {
          router.replace("/(tabs)/dashboard");
          return;
        }

        setDraft(currentDraft);
        const venues = currentDraft.venues;
        setSelectedVenueId(
          venues.some((venue) => venue.venueId === venueId)
            ? venueId ?? null
            : venues.length === 1
              ? venues[0].venueId
              : null,
        );
      } catch (loadError) {
        if (active) {
          setErrorMessage(
            loadError instanceof Error
              ? loadError.message
              : "No pudimos cargar tu sede.",
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
  }, [accessToken, venueId]);

  const clearError = () => {
    setFieldNameError(false);
    setErrorMessage(null);
  };

  const selectedVenue = draft?.venues.find((venue) => venue.venueId === selectedVenueId);

  const handleSave = async () => {
    const parsedPrice = Number(hourlyPrice.replace(",", "."));
    if (fieldName.trim().length < 2) {
      setFieldNameError(true);
      setErrorMessage("Ingresa el nombre de la cancha.");
      return;
    }

    if (!format) {
      setErrorMessage("Selecciona el formato de juego.");
      return;
    }
    if (
      scheduleMode === "custom" &&
      (scheduleOverride.weekdays.length === 0 ||
        scheduleOverride.openingTime >= scheduleOverride.closingTime)
    ) {
      setErrorMessage("Revisa los días y horas de la cancha.");
      return;
    }
    if (scheduleMode === "inherit" && !selectedVenue?.defaultSchedule) {
      setErrorMessage("Esta sede no tiene horario general. Personaliza el horario de la cancha.");
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setErrorMessage("Ingresa un precio válido por hora.");
      return;
    }

    if (!selectedVenueId) {
      setErrorMessage("Selecciona la sede de la cancha.");
      return;
    }

    if (!draft || !accessToken) {
      return;
    }

    setSubmitting(true);
    clearError();

    try {
      await venueOnboardingGateway.saveSportsField(
        accessToken,
        draft.organizationId,
        {
          venueId: selectedVenueId,
          fieldName: fieldName.trim(),
          format,
          status: "active",
          scheduleMode,
          scheduleOverride: scheduleMode === "custom" ? scheduleOverride : null,
          hourlyPrice: parsedPrice,
          currency: "PEN",
        },
      );
      router.replace("/(tabs)/dashboard");
    } catch (saveError) {
      setErrorMessage(
        saveError instanceof Error
          ? saveError.message
          : "No pudimos guardar la cancha.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const venues = draft?.venues?.length
    ? draft.venues
    : draft?.location
      ? [draft.location]
      : [];

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <VenueSetupBackground variant="field" />
      <AppScreenHeader title="Nueva cancha" onBack={() => router.back()} backAccessibilityLabel="Volver al panel" scrollY={scrollY} />

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
                text="Preparando la cancha..."
                variant="body"
                style={styles.loadingText}
              />
            ) : (
              <View style={styles.content}>
                <CustomText
                  text="Configura lo necesario para recibir reservas."
                  variant="body"
                  style={styles.description}
                />

                <View style={styles.form}>
                  <View style={styles.venueGroup}>
                    <CustomText text="Sede" variant="body" />
                    <View style={styles.venues}>
                      {venues.map((venue) => {
                        const selected = venue.venueId === selectedVenueId;
                        return (
                          <VenueCardOption
                            key={venue.venueId}
                            name={venue.venueName}
                            location={`${venue.district}, ${venue.city}`}
                            selected={selected}
                            onPress={() => {
                              setSelectedVenueId(venue.venueId);
                              clearError();
                            }}
                            disabled={submitting}
                          />
                        );
                      })}
                    </View>
                  </View>

                  <VenueTextField
                    label="Nombre de la cancha"
                    value={fieldName}
                    onChangeText={(value) => {
                      setFieldName(value);
                      clearError();
                    }}
                    placeholder="Ej. Cancha principal"
                    autoCapitalize="words"
                    editable={!submitting}
                    hasError={fieldNameError}
                    accessibilityLabel="Nombre de la cancha"
                  />

                  <View style={styles.formatGroup}>
                    <CustomText text="Formato" variant="body" />
                    <View style={styles.formats}>
                      {FIELD_FORMATS.map((option) => {
                        const selected = option.value === format;
                        return (
                          <VenueChoicePill
                            key={option.value}
                            label={option.label}
                            selected={selected}
                            onPress={() => {
                              setFormat(option.value);
                              clearError();
                            }}
                            disabled={submitting}
                          />
                        );
                      })}
                    </View>
                  </View>

                  <View style={styles.scheduleSection}>
                    <View style={styles.sectionHeading}>
                      <CustomText text="Horario" variant="body" style={styles.sectionTitle} />
                      <CustomText
                        text={selectedVenue?.defaultSchedule ? "Usa el horario de la sede o personalízalo." : "Esta sede aún no tiene horario general."}
                        variant="caption"
                        style={styles.description}
                      />
                    </View>
                    <View style={styles.scheduleModes}>
                      {(["inherit", "custom"] as const).map((mode) => {
                        const selected = scheduleMode === mode;
                        const disabled = mode === "inherit" && !selectedVenue?.defaultSchedule;
                        return (
                          <VenueChoicePill
                            key={mode}
                            label={mode === "inherit" ? "Usar sede" : "Personalizar"}
                            selected={selected}
                            disabled={disabled || submitting}
                            onPress={() => {
                              setScheduleMode(mode);
                              clearError();
                            }}
                          />
                        );
                      })}
                    </View>
                    {scheduleMode === "custom" ? (
                      <WeeklyScheduleEditor value={scheduleOverride} onChange={setScheduleOverride} disabled={submitting} />
                    ) : null}
                  </View>

                  <VenueTextField
                    label="Precio por hora"
                    value={hourlyPrice}
                    onChangeText={(value) => {
                      setHourlyPrice(value.replace(/[^0-9.,]/g, ""));
                      clearError();
                    }}
                    placeholder="S/ 120"
                    keyboardType="decimal-pad"
                    editable={!submitting}
                    accessibilityLabel="Precio por hora en soles"
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
                    label={submitting ? "Guardando..." : "Guardar cancha"}
                    variant="secondary"
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

export default FirstFieldView;

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
    gap: theme.spacing.huge,
  },
  description: {
    color: theme.colors.authTextSecondary,
  },
  form: {
    gap: theme.spacing.xxl,
  },
  venueGroup: { gap: theme.spacing.md },
  venues: { gap: theme.spacing.md },
  formatGroup: {
    gap: theme.spacing.md,
  },
  formats: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  scheduleSection: { gap: theme.spacing.lg, paddingTop: theme.spacing.sm },
  sectionHeading: { gap: theme.spacing.xxs },
  sectionTitle: { color: theme.colors.authText, fontFamily: theme.fontFamilies.poppinsBold },
  scheduleModes: { flexDirection: "row", gap: theme.spacing.sm },
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
