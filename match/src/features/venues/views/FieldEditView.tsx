import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppScreenState from "@/src/components/ui/AppScreenState";
import AppAccessRestrictedState from "@/src/components/ui/AppAccessRestrictedState";
import AppFeedbackNotice from "@/src/components/ui/AppFeedbackNotice";
import AppSection from "@/src/components/ui/AppSection";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import FieldContextHeader from "@/src/features/venues/components/FieldContextHeader";
import FieldPricingEditor from "@/src/features/venues/components/FieldPricingEditor";
import AppUnsavedChangesSheet from "@/src/components/ui/AppUnsavedChangesSheet";
import AppChoiceGroup from "@/src/components/ui/AppChoiceGroup";
import VenueTextField from "@/src/features/venues/components/VenueTextField";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import useUnsavedChangesGuard from "@/src/hooks/useUnsavedChangesGuard";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import type {
  FieldFormat,
} from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { backOrReplace } from "@/src/utils/routerNavigation";
import { getBusinessResourceAccess } from "@/src/features/venues/utils/businessResourceAccess";
import { useEffectiveBusinessMembership } from "@/src/features/subscriptions/hooks/useEffectiveBusinessMembership";

const formats: { value: FieldFormat; label: string }[] = [
  { value: "5v5", label: "Fútbol 5" },
  { value: "7v7", label: "Fútbol 7" },
  { value: "11v11", label: "Fútbol 11" },
];

const FieldEditView = () => {
  const { fieldId } = useLocalSearchParams<{ fieldId: string }>();
  const { accessToken } = useAuth();
  const { draft, loading, error, updateDraft } = useBusinessDraft();
  const { effectiveRole } = useEffectiveBusinessMembership(draft?.membership);
  const field = draft?.fields.find((item) => item.fieldId === fieldId);
  const venue = draft?.venues.find((item) => item.venueId === field?.venueId);
  const canConfigureResources = getBusinessResourceAccess(
    effectiveRole,
  ).canConfigureResources;
  const [name, setName] = useState("");
  const [format, setFormat] = useState<FieldFormat>("5v5");
  const [dayPrice, setDayPrice] = useState("");
  const [nightPrice, setNightPrice] = useState("");
  const [nightStartsAt, setNightStartsAt] = useState("18:00");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [initializedFieldId, setInitializedFieldId] = useState<string | null>(null);
  const formInitialized = initializedFieldId === field?.fieldId;
  const hasUnsavedChanges = Boolean(formInitialized && field && (
    name.trim() !== field.fieldName
    || format !== field.format
    || dayPrice !== String(field.hourlyPrice)
    || nightPrice !== String(field.nightHourlyPrice ?? field.hourlyPrice)
    || nightStartsAt !== (field.nightStartsAt ?? "18:00")
  ));
  const unsavedChanges = useUnsavedChangesGuard(hasUnsavedChanges && !saving);
  const returnToField = () => backOrReplace({ pathname: "/business/fields/[fieldId]", params: { fieldId } });

  if (field && initializedFieldId !== field.fieldId) {
    setName(field.fieldName);
    setFormat(field.format);
    setDayPrice(String(field.hourlyPrice));
    setNightPrice(String(field.nightHourlyPrice ?? field.hourlyPrice));
    setNightStartsAt(field.nightStartsAt ?? "18:00");
    setInitializedFieldId(field.fieldId);
  }

  const clearMessage = () => setMessage(null);

  const save = async () => {
    if (!field || !draft || !accessToken) return;

    const dayHourlyPrice = Number(dayPrice.replace(",", "."));
    const nightHourlyPrice = Number(nightPrice.replace(",", "."));

    if (
      name.trim().length < 2 ||
      !Number.isFinite(dayHourlyPrice) ||
      dayHourlyPrice <= 0 ||
      !Number.isFinite(nightHourlyPrice) ||
      nightHourlyPrice <= 0
    ) {
      setMessage("Revisa el nombre y las tarifas.");
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const updatedDraft = await venueOnboardingGateway.updateSportsField(
        accessToken,
        draft.organizationId,
        field.fieldId,
        {
          fieldName: name,
          format,
          scheduleMode: field.scheduleMode,
          scheduleOverride: field.scheduleOverride,
          hourlyPrice: dayHourlyPrice,
          nightHourlyPrice,
          nightStartsAt,
        },
      );
      updateDraft(updatedDraft);
      unsavedChanges.leaveWithoutPrompt(returnToField);
    } catch (saveError) {
      setMessage(
        saveError instanceof Error
          ? saveError.message
          : "No pudimos guardar los cambios.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <AppScreenLayout
      title="Editar cancha"
      headerTitleAlign="center"
      headerTitleSize="compact"
      backgroundVariant="solid"
      keyboardAware
      onBack={returnToField}
      backAccessibilityLabel="Volver a detalles de cancha"
      backIconVariant="dismiss"
      footer={field && canConfigureResources ? (
        <CustomButton
          label={saving ? "Guardando..." : "Guardar cambios"}
          variant="primary"
          onPress={save}
          disabled={saving || loading}
          style={styles.button}
        />
      ) : undefined}
    >
      {loading ? (
        <AppScreenState kind="loading" title="Cargando cancha" style={styles.screenState} />
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
          title="Edición no disponible"
          message="Esta acción está disponible para propietarios y gestores."
          onBack={returnToField}
          style={styles.screenState}
        />
      ) : (
        <View style={styles.content}>
          <FieldContextHeader fieldName={field.fieldName} venueName={venue?.venueName ?? "Sede"} />

          <View style={styles.sectionContent}>
            <VenueTextField
              label="Nombre"
              value={name}
              onChangeText={(value) => {
                setName(value);
                clearMessage();
              }}
              autoCapitalize="words"
              editable={!saving}
              accessibilityLabel="Nombre de la cancha"
            />

            <View style={styles.group}>
              <CustomText text="Formato" variant="body" style={styles.title} />
              <AppChoiceGroup options={formats} value={format} disabled={saving} onChange={(value) => { setFormat(value); clearMessage(); }} />
            </View>
          </View>

          <AppSection title="Tarifas">
            <FieldPricingEditor
              dayHourlyPrice={dayPrice}
              nightHourlyPrice={nightPrice}
              nightStartsAt={nightStartsAt}
              disabled={saving}
              showTitle={false}
              onChange={(pricing) => {
                setDayPrice(pricing.dayHourlyPrice);
                setNightPrice(pricing.nightHourlyPrice);
                setNightStartsAt(pricing.nightStartsAt);
                clearMessage();
              }}
            />
          </AppSection>

          {message ? <AppFeedbackNotice message={message} /> : null}

        </View>
      )}
    </AppScreenLayout>
    <AppUnsavedChangesSheet visible={unsavedChanges.confirmationVisible} onKeepEditing={unsavedChanges.keepEditing} onDiscard={unsavedChanges.discardChanges} />
    </>
  );
};

export default FieldEditView;

const styles = StyleSheet.create({
  content: { gap: theme.layout.sectionGap },
  sectionContent: { gap: theme.layout.groupGap },
  group: { gap: theme.spacing.md },
  title: {
    color: theme.colors.white,
    fontFamily: theme.fontFamilies.poppinsBold,
  },
  muted: { color: theme.colors.authTextSecondary },
  screenState: { minHeight: 420, paddingHorizontal: 0 },
  button: { minHeight: 56, borderRadius: theme.radius.pill },
});
