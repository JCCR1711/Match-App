import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppSection from "@/src/components/ui/AppSection";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import VenueChoiceGroup from "@/src/features/venues/components/VenueChoiceGroup";
import VenueTextField from "@/src/features/venues/components/VenueTextField";
import VenueLocationMapPicker from "@/src/features/venues/components/VenueLocationMapPicker";
import UnsavedChangesSheet from "@/src/features/venues/components/UnsavedChangesSheet";
import WeeklyScheduleEditor from "@/src/features/venues/components/WeeklyScheduleEditor";
import useUnsavedChangesGuard from "@/src/features/venues/hooks/useUnsavedChangesGuard";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import { detectVenueLocation } from "@/src/features/venues/services/detectVenueLocation";
import type { BusinessOnboardingDraft, VenueCoordinates, WeeklySchedule } from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

const DEFAULT_SCHEDULE: WeeklySchedule = {
  weekdays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  openingTime: "08:00",
  closingTime: "23:00",
};

const SCHEDULE_OPTIONS = [
  { value: "none", label: "Sin horario" },
  { value: "configured", label: "Configurar" },
] as const;

type VenueField = "venueName" | "address" | "district" | "city";
type LocationFeedback = { message: string; tone: "success" | "warning" | "error" };

const VenueLocationView = () => {
  const { accessToken } = useAuth();
  const [draft, setDraft] = useState<BusinessOnboardingDraft | null>(null);
  const [venueName, setVenueName] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [coordinates, setCoordinates] = useState<VenueCoordinates | null>(null);
  const [usesSchedule, setUsesSchedule] = useState(false);
  const [schedule, setSchedule] = useState<WeeklySchedule>(DEFAULT_SCHEDULE);
  const [invalidField, setInvalidField] = useState<VenueField | null>(null);
  const [locationFeedback, setLocationFeedback] = useState<LocationFeedback | null>(null);
  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const hasUnsavedChanges = Boolean(venueName.trim() || address.trim() || district.trim() || city.trim() || coordinates || usesSchedule);
  const unsavedChanges = useUnsavedChangesGuard(hasUnsavedChanges && !submitting);

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
        if (!currentDraft) {
          router.replace("/business/setup");
          return;
        }
        setDraft(currentDraft);
      } catch (loadError) {
        if (active) setMessage(loadError instanceof Error ? loadError.message : "No pudimos cargar tu club.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadDraft();
    return () => { active = false; };
  }, [accessToken]);

  const clearError = () => {
    setInvalidField(null);
    setMessage(null);
  };

  const detectLocation = async () => {
    if (locating || submitting) return;
    setLocating(true);
    setLocationFeedback(null);
    clearError();
    try {
      const location = await detectVenueLocation();
      setAddress((current) => location.address || current);
      setDistrict((current) => location.district || current);
      setCity((current) => location.city || current);
      setCoordinates(location.coordinates);
      const complete = Boolean(location.address && location.district && location.city);
      setLocationFeedback({ message: complete ? "Ubicación aplicada" : "Ubicación encontrada. Revisa los datos.", tone: complete ? "success" : "warning" });
    } catch (locationError) {
      setLocationFeedback({ message: locationError instanceof Error ? locationError.message : "No pudimos detectar tu ubicación.", tone: "error" });
    } finally {
      setLocating(false);
    }
  };

  const save = async () => {
    if (!draft || !accessToken) return;
    const required: [VenueField, string][] = [["venueName", venueName], ["address", address], ["district", district], ["city", city]];
    const invalid = required.find(([, value]) => value.trim().length < 2);
    if (invalid) {
      setInvalidField(invalid[0]);
      setMessage("Completa los datos de la sede.");
      return;
    }
    if (usesSchedule && (schedule.weekdays.length === 0 || schedule.openingTime >= schedule.closingTime)) {
      setMessage("Revisa los días y las horas.");
      return;
    }

    setSubmitting(true);
    clearError();
    try {
      await venueOnboardingGateway.saveVenueLocation(accessToken, draft.organizationId, {
        venueName: venueName.trim(),
        address: address.trim(),
        district: district.trim(),
        city: city.trim(),
        coordinates,
        status: "active",
        defaultSchedule: usesSchedule ? schedule : null,
      });
      unsavedChanges.leaveWithoutPrompt(() => router.replace("/(tabs)/dashboard"));
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : "No pudimos crear la sede.");
    } finally {
      setSubmitting(false);
    }
  };

  const clearDetectedLocation = () => {
    setCoordinates(null);
    setLocationFeedback(null);
    clearError();
  };

  return (
    <>
    <AppScreenLayout
      title="Nueva sede"
      headerTitleAlign="center"
      headerTitleSize="compact"
      backgroundVariant="solid"
      keyboardAware
      onBack={() => router.back()}
      backAccessibilityLabel="Volver"
      footer={!loading && draft ? <CustomButton label={submitting ? "Creando..." : "Crear sede"} variant="primary" onPress={save} disabled={submitting || locating} style={styles.saveButton} /> : undefined}
    >
      {loading ? <CustomText text="Cargando" variant="body" style={styles.muted} /> : !draft ? (
        <CustomText text={message ?? "No encontramos tu club."} variant="body" style={styles.muted} />
      ) : (
        <View style={styles.content}>
          <VenueTextField label="Nombre" value={venueName} onChangeText={(value) => { setVenueName(value); clearError(); }} placeholder="Sede principal" autoCapitalize="words" editable={!submitting} hasError={invalidField === "venueName"} accessibilityLabel="Nombre de la sede" />

          <AppSection title="Ubicación" actionLabel={locating ? "Buscando..." : locationFeedback?.tone === "success" ? "Actualizar" : locationFeedback ? "Reintentar" : "Usar mi ubicación"} actionVariant="reserved" actionDisabled={locating} onAction={() => void detectLocation()}>
            <View style={styles.locationFields}>
              <VenueLocationMapPicker coordinates={coordinates} address={address} district={district} city={city} disabled={submitting || locating} onSelect={(location) => { setAddress(location.address); setDistrict(location.district); setCity(location.city); setCoordinates(location.coordinates); setLocationFeedback({ message: "Ubicación aplicada", tone: location.district && location.city ? "success" : "warning" }); clearError(); }} />
              {locationFeedback ? <CustomText text={locationFeedback.message} variant="caption" style={locationFeedback.tone === "success" ? styles.locationSuccess : locationFeedback.tone === "warning" ? styles.locationWarning : styles.locationError} accessibilityLiveRegion="polite" /> : null}
              <VenueTextField label="Dirección" value={address} onChangeText={(value) => { setAddress(value); clearDetectedLocation(); }} placeholder="Av. Principal 123" autoCapitalize="words" autoComplete="street-address" editable={!submitting} hasError={invalidField === "address"} accessibilityLabel="Dirección de la sede" />
              <VenueTextField label="Distrito" value={district} onChangeText={(value) => { setDistrict(value); clearDetectedLocation(); }} placeholder="Ej. Miraflores" autoCapitalize="words" editable={!submitting} hasError={invalidField === "district"} accessibilityLabel="Distrito de la sede" />
              <VenueTextField label="Ciudad" value={city} onChangeText={(value) => { setCity(value); clearDetectedLocation(); }} placeholder="Ej. Lima" autoCapitalize="words" autoComplete="postal-address-locality" editable={!submitting} hasError={invalidField === "city"} accessibilityLabel="Ciudad de la sede" />
            </View>
          </AppSection>

          <AppSection title="Horario general">
            <VenueChoiceGroup options={SCHEDULE_OPTIONS} value={usesSchedule ? "configured" : "none"} disabled={submitting} onChange={(value) => { setUsesSchedule(value === "configured"); clearError(); }} />
            {usesSchedule ? <WeeklyScheduleEditor value={schedule} onChange={(value) => { setSchedule(value); clearError(); }} disabled={submitting} /> : null}
          </AppSection>

          {message ? <CustomText text={message} variant="caption" style={styles.error} accessibilityRole="alert" /> : null}
        </View>
      )}
    </AppScreenLayout>
    <UnsavedChangesSheet visible={unsavedChanges.confirmationVisible} onKeepEditing={unsavedChanges.keepEditing} onDiscard={unsavedChanges.discardChanges} />
    </>
  );
};

export default VenueLocationView;

const styles = StyleSheet.create({
  content: { gap: theme.layout.sectionGap },
  locationFields: { gap: theme.layout.groupGap },
  locationSuccess: { color: theme.colors.success },
  locationWarning: { color: theme.colors.warning },
  locationError: { color: theme.colors.errorSoft },
  muted: { color: theme.colors.authTextSecondary, textAlign: "center" },
  error: { color: theme.colors.errorSoft, textAlign: "center" },
  saveButton: { minHeight: 56, borderRadius: theme.radius.pill },
});
