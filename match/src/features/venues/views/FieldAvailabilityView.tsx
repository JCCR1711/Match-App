import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import FieldContextHeader from "@/src/features/venues/components/FieldContextHeader";
import UnsavedChangesSheet from "@/src/features/venues/components/UnsavedChangesSheet";
import VenueChoiceGroup from "@/src/features/venues/components/VenueChoiceGroup";
import WeeklyScheduleEditor from "@/src/features/venues/components/WeeklyScheduleEditor";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import useUnsavedChangesGuard from "@/src/features/venues/hooks/useUnsavedChangesGuard";
import { getEffectiveFieldSchedule } from "@/src/features/venues/utils/getEffectiveFieldSchedule";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import type { FieldScheduleMode, WeeklySchedule } from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { backOrReplace } from "@/src/utils/routerNavigation";

const EMPTY_SCHEDULE: WeeklySchedule = {
  weekdays: [],
  openingTime: "08:00",
  closingTime: "23:00",
};

const SCHEDULE_MODE_OPTIONS = [
  { value: "inherit", label: "Horario de sede" },
  { value: "custom", label: "Personalizado" },
] as const;

const FieldAvailabilityView = () => {
  const { fieldId } = useLocalSearchParams<{ fieldId: string }>();
  const { accessToken } = useAuth();
  const { draft, loading, error } = useBusinessDraft();
  const field = draft?.fields.find((item) => item.fieldId === fieldId);
  const venue = draft?.venues.find((item) => item.venueId === field?.venueId);
  const [scheduleMode, setScheduleMode] = useState<FieldScheduleMode>("custom");
  const [schedule, setSchedule] = useState<WeeklySchedule>(EMPTY_SCHEDULE);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formInitialized, setFormInitialized] = useState(false);
  const initialSchedule = field ? getEffectiveFieldSchedule(field, venue) ?? EMPTY_SCHEDULE : EMPTY_SCHEDULE;
  const hasUnsavedChanges = Boolean(formInitialized && field && (
    scheduleMode !== field.scheduleMode
    || (scheduleMode === "custom" && JSON.stringify(schedule) !== JSON.stringify(initialSchedule))
  ));
  const unsavedChanges = useUnsavedChangesGuard(hasUnsavedChanges && !saving);
  const returnToField = () => backOrReplace({ pathname: "/business/fields/[fieldId]", params: { fieldId } });

  useEffect(() => {
    if (!field) return;
    const effectiveSchedule = getEffectiveFieldSchedule(field, venue);
    setScheduleMode(field.scheduleMode);
    setSchedule(effectiveSchedule ? {
      weekdays: effectiveSchedule.weekdays,
      openingTime: effectiveSchedule.openingTime,
      closingTime: effectiveSchedule.closingTime,
    } : EMPTY_SCHEDULE);
    setFormInitialized(true);
  }, [field, venue]);

  const save = async () => {
    if (!field || !draft || !accessToken) return;
    if (scheduleMode === "inherit" && !venue?.defaultSchedule) {
      setMessage("Esta sede no tiene un horario general.");
      return;
    }
    if (scheduleMode === "custom" && (schedule.weekdays.length === 0 || schedule.openingTime >= schedule.closingTime)) {
      setMessage("Revisa los días y las horas de la cancha.");
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      await venueOnboardingGateway.updateSportsField(accessToken, draft.organizationId, field.fieldId, {
        fieldName: field.fieldName,
        format: field.format,
        scheduleMode,
        scheduleOverride: scheduleMode === "custom" ? schedule : null,
        hourlyPrice: field.hourlyPrice,
        nightHourlyPrice: field.nightHourlyPrice,
        nightStartsAt: field.nightStartsAt,
      });
      unsavedChanges.leaveWithoutPrompt(returnToField);
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : "No pudimos guardar la disponibilidad.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <AppScreenLayout
      title="Disponibilidad"
      headerTitleAlign="center"
      headerTitleSize="compact"
      backgroundVariant="solid"
      onBack={returnToField}
      backAccessibilityLabel="Volver a detalles de cancha"
      backIconVariant="dismiss"
      footer={field ? (
        <CustomButton
          label={saving ? "Guardando..." : "Guardar disponibilidad"}
          variant="primary"
          onPress={save}
          disabled={saving || loading}
          style={styles.button}
        />
      ) : undefined}
    >
      {loading ? (
        <CustomText text="Cargando..." variant="body" style={styles.muted} />
      ) : !field ? (
        <CustomText text={error ?? "No encontramos la cancha."} variant="body" style={styles.muted} />
      ) : (
        <View style={styles.content}>
          <FieldContextHeader fieldName={field.fieldName} venueName={venue?.venueName ?? "Sede"} />
          <VenueChoiceGroup
            options={SCHEDULE_MODE_OPTIONS.map((option) => ({ ...option, disabled: option.value === "inherit" && !venue?.defaultSchedule }))}
            value={scheduleMode}
            disabled={saving}
            onChange={(value) => { setScheduleMode(value); setMessage(null); }}
          />

          <WeeklyScheduleEditor
            value={scheduleMode === "inherit" ? venue?.defaultSchedule ?? schedule : schedule}
            onChange={(nextSchedule) => { setSchedule(nextSchedule); setMessage(null); }}
            disabled={saving}
            readOnly={scheduleMode === "inherit"}
          />

          {message ? <CustomText text={message} variant="caption" style={styles.error} accessibilityRole="alert" /> : null}
        </View>
      )}
    </AppScreenLayout>
    <UnsavedChangesSheet visible={unsavedChanges.confirmationVisible} onKeepEditing={unsavedChanges.keepEditing} onDiscard={unsavedChanges.discardChanges} />
    </>
  );
};

export default FieldAvailabilityView;

const styles = StyleSheet.create({
  content: { gap: theme.layout.groupGap },
  muted: { color: theme.colors.authTextSecondary },
  error: { color: theme.colors.errorSoft, textAlign: "center" },
  button: { minHeight: 56, borderRadius: theme.radius.pill },
});
