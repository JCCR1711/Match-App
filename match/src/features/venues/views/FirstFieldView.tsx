import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppSection from "@/src/components/ui/AppSection";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import FieldPricingEditor from "@/src/features/venues/components/FieldPricingEditor";
import VenueChoiceGroup from "@/src/features/venues/components/VenueChoiceGroup";
import VenuePickerField from "@/src/features/venues/components/VenuePickerField";
import VenueTextField from "@/src/features/venues/components/VenueTextField";
import UnsavedChangesSheet from "@/src/features/venues/components/UnsavedChangesSheet";
import WeeklyScheduleEditor from "@/src/features/venues/components/WeeklyScheduleEditor";
import useUnsavedChangesGuard from "@/src/features/venues/hooks/useUnsavedChangesGuard";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import type { BusinessOnboardingDraft, FieldFormat, FieldScheduleMode, WeeklySchedule } from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

const FIELD_FORMATS: { value: FieldFormat; label: string }[] = [
  { value: "5v5", label: "Fútbol 5" },
  { value: "7v7", label: "Fútbol 7" },
  { value: "11v11", label: "Fútbol 11" },
];

const SCHEDULE_MODE_OPTIONS = [
  { value: "inherit", label: "Horario de sede" },
  { value: "custom", label: "Personalizado" },
] as const;

const DEFAULT_SCHEDULE: WeeklySchedule = {
  weekdays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  openingTime: "08:00",
  closingTime: "23:00",
};

const FirstFieldView = () => {
  const { venueId } = useLocalSearchParams<{ venueId?: string }>();
  const { accessToken } = useAuth();
  const [draft, setDraft] = useState<BusinessOnboardingDraft | null>(null);
  const [fieldName, setFieldName] = useState("");
  const [format, setFormat] = useState<FieldFormat>("5v5");
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [scheduleMode, setScheduleMode] = useState<FieldScheduleMode>("inherit");
  const [scheduleOverride, setScheduleOverride] = useState<WeeklySchedule>(DEFAULT_SCHEDULE);
  const [hourlyPrice, setHourlyPrice] = useState("");
  const [nightHourlyPrice, setNightHourlyPrice] = useState("");
  const [nightStartsAt, setNightStartsAt] = useState("18:00");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fieldNameError, setFieldNameError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const initialVenueId = useRef<string | null>(null);
  const initialScheduleMode = useRef<FieldScheduleMode>("inherit");

  useEffect(() => {
    if (!accessToken) {
      router.replace("/");
      return;
    }
    let active = true;
    const loadDraft = async () => {
      try {
        const currentDraft = await venueOnboardingGateway.getBusinessDraft(accessToken);
        if (!active) return;
        if (!currentDraft?.venues.length) {
          router.replace("/(tabs)/business-fields");
          return;
        }
        setDraft(currentDraft);
        const initialVenue = currentDraft.venues.find((venue) => venue.venueId === venueId) ?? currentDraft.venues[0];
        initialVenueId.current = initialVenue.venueId;
        initialScheduleMode.current = initialVenue.defaultSchedule ? "inherit" : "custom";
        setSelectedVenueId(initialVenue.venueId);
        setScheduleMode(initialScheduleMode.current);
      } catch (loadError) {
        if (active) setErrorMessage(loadError instanceof Error ? loadError.message : "No pudimos cargar tus sedes.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadDraft();
    return () => { active = false; };
  }, [accessToken, venueId]);

  const clearError = () => {
    setFieldNameError(false);
    setErrorMessage(null);
  };

  const finishCreation = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(tabs)/business-fields");
  };

  const venues = draft?.venues ?? [];
  const selectedVenue = venues.find((venue) => venue.venueId === selectedVenueId);
  const customScheduleChanged = scheduleMode === "custom" && (
    scheduleOverride.openingTime !== DEFAULT_SCHEDULE.openingTime
    || scheduleOverride.closingTime !== DEFAULT_SCHEDULE.closingTime
    || scheduleOverride.weekdays.join(",") !== DEFAULT_SCHEDULE.weekdays.join(",")
  );
  const hasUnsavedChanges = Boolean(
    fieldName.trim()
    || hourlyPrice.trim()
    || nightHourlyPrice.trim()
    || format !== "5v5"
    || selectedVenueId !== initialVenueId.current
    || scheduleMode !== initialScheduleMode.current
    || customScheduleChanged
    || nightStartsAt !== "18:00"
  );
  const unsavedChanges = useUnsavedChangesGuard(hasUnsavedChanges && !submitting);

  const save = async () => {
    const dayPrice = Number(hourlyPrice.replace(",", "."));
    const nightPrice = Number(nightHourlyPrice.replace(",", "."));
    if (fieldName.trim().length < 2) {
      setFieldNameError(true);
      setErrorMessage("Ingresa el nombre de la cancha.");
      return;
    }
    if (!selectedVenueId || !selectedVenue) {
      setErrorMessage("Selecciona una sede.");
      return;
    }
    if (scheduleMode === "inherit" && !selectedVenue.defaultSchedule) {
      setErrorMessage("Esta sede no tiene horario general. Usa un horario personalizado.");
      return;
    }
    if (scheduleMode === "custom" && (scheduleOverride.weekdays.length === 0 || scheduleOverride.openingTime >= scheduleOverride.closingTime)) {
      setErrorMessage("Revisa los días y las horas.");
      return;
    }
    if (!Number.isFinite(dayPrice) || dayPrice <= 0 || !Number.isFinite(nightPrice) || nightPrice <= 0) {
      setErrorMessage("Revisa las tarifas.");
      return;
    }
    if (!draft || !accessToken) return;

    setSubmitting(true);
    clearError();
    try {
      await venueOnboardingGateway.saveSportsField(accessToken, draft.organizationId, {
        venueId: selectedVenueId,
        fieldName: fieldName.trim(),
        format,
        status: "active",
        scheduleMode,
        scheduleOverride: scheduleMode === "custom" ? scheduleOverride : null,
        hourlyPrice: dayPrice,
        nightHourlyPrice: nightPrice,
        nightStartsAt,
        currency: "PEN",
      });
      unsavedChanges.leaveWithoutPrompt(finishCreation);
    } catch (saveError) {
      setErrorMessage(saveError instanceof Error ? saveError.message : "No pudimos crear la cancha.");
    } finally {
      setSubmitting(false);
    }
  };

  const scheduleOptions = SCHEDULE_MODE_OPTIONS.map((option) => ({
    ...option,
    disabled: option.value === "inherit" && !selectedVenue?.defaultSchedule,
  }));

  return (
    <>
    <AppScreenLayout
      title="Nueva cancha"
      keyboardAware
      headerTitleAlign="center"
      headerTitleSize="compact"
      backgroundVariant="solid"
      onBack={() => router.back()}
      backAccessibilityLabel="Volver"
      footer={!loading && draft ? <CustomButton label={submitting ? "Creando..." : "Crear cancha"} variant="primary" onPress={save} disabled={submitting} style={styles.saveButton} /> : undefined}
    >
      {loading ? <CustomText text="Cargando" variant="body" style={styles.muted} /> : !draft ? (
        <CustomText text={errorMessage ?? "No encontramos tu club."} variant="body" style={styles.muted} />
      ) : (
        <View style={styles.content}>
          {venues.length > 1 ? (
            <AppSection title="Sede">
              <VenuePickerField venues={venues} value={selectedVenueId} disabled={submitting} onChange={(nextVenueId) => { const nextVenue = venues.find((venue) => venue.venueId === nextVenueId); setSelectedVenueId(nextVenueId); if (!nextVenue?.defaultSchedule) setScheduleMode("custom"); clearError(); }} />
            </AppSection>
          ) : selectedVenue ? <CustomText text={selectedVenue.venueName} variant="caption" style={styles.venueContext} numberOfLines={1} /> : null}

          <VenueTextField label="Nombre" value={fieldName} onChangeText={(value) => { setFieldName(value); clearError(); }} placeholder="Cancha principal" autoCapitalize="words" editable={!submitting} hasError={fieldNameError} accessibilityLabel="Nombre de la cancha" />

          <View style={styles.controlGroup}>
            <CustomText text="Formato" variant="body" style={styles.controlLabel} />
            <VenueChoiceGroup options={FIELD_FORMATS} value={format} disabled={submitting} onChange={(value) => { setFormat(value); clearError(); }} />
          </View>

          <AppSection title="Horario">
            <VenueChoiceGroup options={scheduleOptions} value={scheduleMode} disabled={submitting} onChange={(value) => { setScheduleMode(value); clearError(); }} />
            {scheduleMode === "custom" ? <WeeklyScheduleEditor value={scheduleOverride} onChange={(value) => { setScheduleOverride(value); clearError(); }} disabled={submitting} /> : null}
          </AppSection>

          <AppSection title="Tarifas">
            <FieldPricingEditor showTitle={false} dayHourlyPrice={hourlyPrice} nightHourlyPrice={nightHourlyPrice} nightStartsAt={nightStartsAt} disabled={submitting} onChange={(pricing) => { setHourlyPrice(pricing.dayHourlyPrice); setNightHourlyPrice(pricing.nightHourlyPrice); setNightStartsAt(pricing.nightStartsAt); clearError(); }} />
          </AppSection>

          {errorMessage ? <CustomText text={errorMessage} variant="caption" style={styles.error} accessibilityRole="alert" /> : null}
        </View>
      )}
    </AppScreenLayout>
    <UnsavedChangesSheet visible={unsavedChanges.confirmationVisible} onKeepEditing={unsavedChanges.keepEditing} onDiscard={unsavedChanges.discardChanges} />
    </>
  );
};

export default FirstFieldView;

const styles = StyleSheet.create({
  content: { gap: theme.layout.sectionGap },
  venueContext: { color: theme.colors.authTextSecondary },
  controlGroup: { gap: theme.spacing.md },
  controlLabel: { color: theme.colors.white },
  muted: { color: theme.colors.authTextSecondary, textAlign: "center" },
  error: { color: theme.colors.errorSoft, textAlign: "center" },
  saveButton: { minHeight: 56, borderRadius: theme.radius.pill },
});
