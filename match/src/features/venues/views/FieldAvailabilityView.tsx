import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppScreenState from "@/src/components/ui/AppScreenState";
import AppAccessRestrictedState from "@/src/components/ui/AppAccessRestrictedState";
import AppFeedbackNotice from "@/src/components/ui/AppFeedbackNotice";
import CustomButton from "@/src/components/ui/CustomButton";
import FieldContextHeader from "@/src/features/venues/components/FieldContextHeader";
import AppUnsavedChangesSheet from "@/src/components/ui/AppUnsavedChangesSheet";
import AppChoiceGroup from "@/src/components/ui/AppChoiceGroup";
import WeeklyScheduleEditor from "@/src/features/venues/components/WeeklyScheduleEditor";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import useUnsavedChangesGuard from "@/src/hooks/useUnsavedChangesGuard";
import { getEffectiveFieldSchedule } from "@/src/features/venues/utils/getEffectiveFieldSchedule";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import type { FieldScheduleMode, WeeklySchedule } from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { backOrReplace } from "@/src/utils/routerNavigation";
import { getBusinessResourceAccess } from "@/src/features/venues/utils/businessResourceAccess";
import { useEffectiveBusinessMembership } from "@/src/features/subscriptions/hooks/useEffectiveBusinessMembership";

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
  const { draft, loading, error, updateDraft } = useBusinessDraft();
  const { effectiveRole } = useEffectiveBusinessMembership(draft?.membership);
  const field = draft?.fields.find((item) => item.fieldId === fieldId);
  const venue = draft?.venues.find((item) => item.venueId === field?.venueId);
  const canConfigureResources = getBusinessResourceAccess(
    effectiveRole,
  ).canConfigureResources;
  const [scheduleMode, setScheduleMode] = useState<FieldScheduleMode>("custom");
  const [schedule, setSchedule] = useState<WeeklySchedule>(EMPTY_SCHEDULE);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [initializedFieldId, setInitializedFieldId] = useState<string | null>(null);
  const formInitialized = initializedFieldId === field?.fieldId;
  const initialSchedule = field ? getEffectiveFieldSchedule(field, venue) ?? EMPTY_SCHEDULE : EMPTY_SCHEDULE;
  const hasUnsavedChanges = Boolean(formInitialized && field && (
    scheduleMode !== field.scheduleMode
    || (scheduleMode === "custom" && JSON.stringify(schedule) !== JSON.stringify(initialSchedule))
  ));
  const unsavedChanges = useUnsavedChangesGuard(hasUnsavedChanges && !saving);
  const returnToField = () => backOrReplace({ pathname: "/business/fields/[fieldId]", params: { fieldId } });

  if (field && initializedFieldId !== field.fieldId) {
    const effectiveSchedule = getEffectiveFieldSchedule(field, venue);
    setScheduleMode(field.scheduleMode);
    setSchedule(effectiveSchedule ? {
      weekdays: effectiveSchedule.weekdays,
      openingTime: effectiveSchedule.openingTime,
      closingTime: effectiveSchedule.closingTime,
    } : EMPTY_SCHEDULE);
    setInitializedFieldId(field.fieldId);
  }

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
      const updatedDraft = await venueOnboardingGateway.updateSportsField(accessToken, draft.organizationId, field.fieldId, {
        fieldName: field.fieldName,
        format: field.format,
        scheduleMode,
        scheduleOverride: scheduleMode === "custom" ? schedule : null,
        hourlyPrice: field.hourlyPrice,
        nightHourlyPrice: field.nightHourlyPrice,
        nightStartsAt: field.nightStartsAt,
      });
      updateDraft(updatedDraft);
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
      footer={field && canConfigureResources ? (
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
        <AppScreenState kind="loading" title="Cargando disponibilidad" style={styles.screenState} />
      ) : !field ? (
        <AppScreenState
          kind={error ? "error" : "empty"}
          title="No encontramos la cancha"
          message={error ?? undefined}
          actionLabel="Volver"
          onAction={returnToField}
          style={styles.screenState}
        />
      ) : !canConfigureResources ? (
        <AppAccessRestrictedState
          title="Disponibilidad en solo lectura"
          message="Los cambios están disponibles para propietarios y gestores."
          onBack={returnToField}
          style={styles.screenState}
        />
      ) : (
        <View style={styles.content}>
          <FieldContextHeader fieldName={field.fieldName} venueName={venue?.venueName ?? "Sede"} />
          <AppChoiceGroup
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

          {message ? <AppFeedbackNotice message={message} /> : null}
        </View>
      )}
    </AppScreenLayout>
    <AppUnsavedChangesSheet visible={unsavedChanges.confirmationVisible} onKeepEditing={unsavedChanges.keepEditing} onDiscard={unsavedChanges.discardChanges} />
    </>
  );
};

export default FieldAvailabilityView;

const styles = StyleSheet.create({
  content: { gap: theme.layout.groupGap },
  muted: { color: theme.colors.authTextSecondary },
  screenState: { minHeight: 420, paddingHorizontal: 0 },
  button: { minHeight: 56, borderRadius: theme.radius.pill },
});
