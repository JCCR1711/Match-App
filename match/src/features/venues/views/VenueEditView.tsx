import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppSection from "@/src/components/ui/AppSection";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import VenueChoiceGroup from "@/src/features/venues/components/VenueChoiceGroup";
import UnsavedChangesSheet from "@/src/features/venues/components/UnsavedChangesSheet";
import VenueLocationMapPicker from "@/src/features/venues/components/VenueLocationMapPicker";
import VenueTextField from "@/src/features/venues/components/VenueTextField";
import WeeklyScheduleEditor from "@/src/features/venues/components/WeeklyScheduleEditor";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import useUnsavedChangesGuard from "@/src/features/venues/hooks/useUnsavedChangesGuard";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import { detectVenueLocation } from "@/src/features/venues/services/detectVenueLocation";
import type { VenueCoordinates, WeeklySchedule } from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { backOrReplace } from "@/src/utils/routerNavigation";

const DEFAULT_SCHEDULE: WeeklySchedule = {
  weekdays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  openingTime: "08:00",
  closingTime: "23:00",
};

type VenueField = "venueName" | "address" | "district" | "city";
type LocationFeedback = { message: string; tone: "success" | "warning" | "error" };

const SCHEDULE_OPTIONS = [
  { value: "none", label: "Sin horario" },
  { value: "configured", label: "Configurar" },
] as const;

const VenueEditView = () => {
  const { venueId } = useLocalSearchParams<{ venueId: string }>();
  const { accessToken } = useAuth();
  const { draft, loading, error } = useBusinessDraft();
  const venue = draft?.venues.find((item) => item.venueId === venueId);
  const [venueName, setVenueName] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [coordinates, setCoordinates] = useState<VenueCoordinates | null>(null);
  const [usesSchedule, setUsesSchedule] = useState(false);
  const [schedule, setSchedule] = useState<WeeklySchedule>(DEFAULT_SCHEDULE);
  const [invalidField, setInvalidField] = useState<VenueField | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationFeedback, setLocationFeedback] = useState<LocationFeedback | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formInitialized, setFormInitialized] = useState(false);
  const hasUnsavedChanges = Boolean(formInitialized && venue && (
    venueName.trim() !== venue.venueName
    || address.trim() !== venue.address
    || district.trim() !== venue.district
    || city.trim() !== venue.city
    || coordinates?.latitude !== venue.coordinates?.latitude
    || coordinates?.longitude !== venue.coordinates?.longitude
    || usesSchedule !== Boolean(venue.defaultSchedule)
    || (usesSchedule && JSON.stringify(schedule) !== JSON.stringify(venue.defaultSchedule))
  ));
  const unsavedChanges = useUnsavedChangesGuard(hasUnsavedChanges && !saving);
  const returnToVenue = () => backOrReplace({ pathname: "/business/venues/[venueId]", params: { venueId } });

  useEffect(() => {
    if (!venue) return;
    setVenueName(venue.venueName);
    setAddress(venue.address);
    setDistrict(venue.district);
    setCity(venue.city);
    setCoordinates(venue.coordinates);
    setUsesSchedule(Boolean(venue.defaultSchedule));
    setSchedule(venue.defaultSchedule ?? DEFAULT_SCHEDULE);
    setFormInitialized(true);
  }, [venue]);

  const clearError = () => {
    setInvalidField(null);
    setMessage(null);
  };

  const detectLocation = async () => {
    if (locating || saving) return;
    setLocating(true);
    clearError();
    setLocationFeedback(null);
    try {
      const location = await detectVenueLocation();
      setAddress((current) => location.address || current);
      setDistrict((current) => location.district || current);
      setCity((current) => location.city || current);
      setCoordinates(location.coordinates);
      const complete = Boolean(location.address && location.district && location.city);
      setLocationFeedback({
        message: complete ? "Ubicación aplicada" : "Ubicación encontrada. Revisa los datos.",
        tone: complete ? "success" : "warning",
      });
    } catch (locationError) {
      setLocationFeedback({
        message: locationError instanceof Error ? locationError.message : "No pudimos detectar tu ubicación.",
        tone: "error",
      });
    } finally {
      setLocating(false);
    }
  };

  const save = async () => {
    if (!venue || !draft || !accessToken) return;
    const required: [VenueField, string][] = [
      ["venueName", venueName],
      ["address", address],
      ["district", district],
      ["city", city],
    ];
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

    setSaving(true);
    clearError();
    try {
      await venueOnboardingGateway.updateVenueLocation(accessToken, draft.organizationId, venue.venueId, {
        venueName: venueName.trim(),
        address: address.trim(),
        district: district.trim(),
        city: city.trim(),
        coordinates,
        defaultSchedule: usesSchedule ? schedule : null,
      });
      unsavedChanges.leaveWithoutPrompt(returnToVenue);
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : "No pudimos guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <AppScreenLayout
      title="Editar sede"
      headerTitleAlign="center"
      headerTitleSize="compact"
      backgroundVariant="solid"
      keyboardAware
      onBack={returnToVenue}
      backAccessibilityLabel="Volver a la sede"
      backIconVariant="dismiss"
      footer={venue ? (
        <CustomButton label={saving ? "Guardando..." : "Guardar cambios"} variant="primary" onPress={save} disabled={saving || loading || locating} style={styles.saveButton} />
      ) : undefined}
    >
      {loading ? (
        <CustomText text="Cargando" variant="body" style={styles.muted} />
      ) : !venue ? (
        <CustomText text={error ?? "No encontramos la sede."} variant="body" style={styles.muted} />
      ) : (
        <View style={styles.content}>
          <VenueTextField label="Nombre" value={venueName} onChangeText={(value) => { setVenueName(value); clearError(); }} autoCapitalize="words" editable={!saving} hasError={invalidField === "venueName"} accessibilityLabel="Nombre de la sede" />

          <AppSection title="Ubicación" actionLabel={locating ? "Buscando..." : locationFeedback?.tone === "success" ? "Actualizar" : locationFeedback ? "Reintentar" : "Usar mi ubicación"} actionVariant="reserved" actionDisabled={locating} onAction={() => void detectLocation()}>
            <View style={styles.locationFields}>
              <VenueLocationMapPicker coordinates={coordinates} address={address} district={district} city={city} disabled={saving || locating} onSelect={(location) => { setAddress(location.address); setDistrict(location.district); setCity(location.city); setCoordinates(location.coordinates); setLocationFeedback({ message: "Ubicación aplicada", tone: location.district && location.city ? "success" : "warning" }); clearError(); }} />
              {locationFeedback ? <CustomText text={locationFeedback.message} variant="caption" style={locationFeedback.tone === "success" ? styles.locationSuccess : locationFeedback.tone === "warning" ? styles.locationWarning : styles.locationError} accessibilityLiveRegion="polite" /> : null}
              <VenueTextField label="Dirección" value={address} onChangeText={(value) => { setAddress(value); setCoordinates(null); setLocationFeedback(null); clearError(); }} autoCapitalize="words" autoComplete="street-address" editable={!saving} hasError={invalidField === "address"} accessibilityLabel="Dirección de la sede" />
              <VenueTextField label="Distrito" value={district} onChangeText={(value) => { setDistrict(value); setCoordinates(null); setLocationFeedback(null); clearError(); }} autoCapitalize="words" editable={!saving} hasError={invalidField === "district"} accessibilityLabel="Distrito de la sede" />
              <VenueTextField label="Ciudad" value={city} onChangeText={(value) => { setCity(value); setCoordinates(null); setLocationFeedback(null); clearError(); }} autoCapitalize="words" autoComplete="postal-address-locality" editable={!saving} hasError={invalidField === "city"} accessibilityLabel="Ciudad de la sede" />
            </View>
          </AppSection>

          <AppSection title="Horario general">
            <VenueChoiceGroup
              options={SCHEDULE_OPTIONS}
              value={usesSchedule ? "configured" : "none"}
              disabled={saving}
              onChange={(value) => { setUsesSchedule(value === "configured"); clearError(); }}
            />
            {usesSchedule ? <WeeklyScheduleEditor value={schedule} onChange={(value) => { setSchedule(value); clearError(); }} disabled={saving} /> : null}
          </AppSection>

          {message ? <CustomText text={message} variant="caption" style={styles.error} accessibilityRole="alert" /> : null}
        </View>
      )}
    </AppScreenLayout>
    <UnsavedChangesSheet visible={unsavedChanges.confirmationVisible} onKeepEditing={unsavedChanges.keepEditing} onDiscard={unsavedChanges.discardChanges} />
    </>
  );
};

export default VenueEditView;

const styles = StyleSheet.create({
  content: { gap: theme.layout.sectionGap },
  locationFields: { gap: theme.layout.groupGap },
  locationSuccess: { color: theme.colors.success },
  locationWarning: { color: theme.colors.warning },
  locationError: { color: theme.colors.errorSoft },
  muted: { color: theme.colors.authTextSecondary },
  error: { color: theme.colors.errorSoft, textAlign: "center" },
  saveButton: { minHeight: 56, borderRadius: theme.radius.pill },
});
