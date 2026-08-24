import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppSection from "@/src/components/ui/AppSection";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import FieldContextHeader from "@/src/features/venues/components/FieldContextHeader";
import FieldPricingEditor from "@/src/features/venues/components/FieldPricingEditor";
import UnsavedChangesSheet from "@/src/features/venues/components/UnsavedChangesSheet";
import VenueChoiceGroup from "@/src/features/venues/components/VenueChoiceGroup";
import VenueTextField from "@/src/features/venues/components/VenueTextField";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import useUnsavedChangesGuard from "@/src/features/venues/hooks/useUnsavedChangesGuard";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import type {
  FieldFormat,
} from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

const formats: { value: FieldFormat; label: string }[] = [
  { value: "5v5", label: "Fútbol 5" },
  { value: "7v7", label: "Fútbol 7" },
  { value: "11v11", label: "Fútbol 11" },
];

const FieldEditView = () => {
  const { fieldId } = useLocalSearchParams<{ fieldId: string }>();
  const { accessToken } = useAuth();
  const { draft, loading, error } = useBusinessDraft();
  const field = draft?.fields.find((item) => item.fieldId === fieldId);
  const venue = draft?.venues.find((item) => item.venueId === field?.venueId);
  const [name, setName] = useState("");
  const [format, setFormat] = useState<FieldFormat>("5v5");
  const [dayPrice, setDayPrice] = useState("");
  const [nightPrice, setNightPrice] = useState("");
  const [nightStartsAt, setNightStartsAt] = useState("18:00");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formInitialized, setFormInitialized] = useState(false);
  const hasUnsavedChanges = Boolean(formInitialized && field && (
    name.trim() !== field.fieldName
    || format !== field.format
    || dayPrice !== String(field.hourlyPrice)
    || nightPrice !== String(field.nightHourlyPrice ?? field.hourlyPrice)
    || nightStartsAt !== (field.nightStartsAt ?? "18:00")
  ));
  const unsavedChanges = useUnsavedChangesGuard(hasUnsavedChanges && !saving);

  useEffect(() => {
    if (!field) return;

    setName(field.fieldName);
    setFormat(field.format);
    setDayPrice(String(field.hourlyPrice));
    setNightPrice(String(field.nightHourlyPrice ?? field.hourlyPrice));
    setNightStartsAt(field.nightStartsAt ?? "18:00");
    setFormInitialized(true);
  }, [field]);

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
      await venueOnboardingGateway.updateSportsField(
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
      unsavedChanges.leaveWithoutPrompt(() => router.back());
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
      onBack={() => router.back()}
      backAccessibilityLabel="Volver a detalles de cancha"
      footer={field ? (
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
        <CustomText text="Cargando..." variant="body" style={styles.muted} />
      ) : !field ? (
        <CustomText
          text={error ?? "No encontramos la cancha."}
          variant="body"
          style={styles.muted}
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
              <VenueChoiceGroup options={formats} value={format} disabled={saving} onChange={(value) => { setFormat(value); clearMessage(); }} />
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

          {message ? (
            <CustomText
              text={message}
              variant="caption"
              style={styles.error}
              accessibilityRole="alert"
            />
          ) : null}

        </View>
      )}
    </AppScreenLayout>
    <UnsavedChangesSheet visible={unsavedChanges.confirmationVisible} onKeepEditing={unsavedChanges.keepEditing} onDiscard={unsavedChanges.discardChanges} />
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
  error: { color: theme.colors.errorSoft, textAlign: "center" },
  button: { minHeight: 56, borderRadius: theme.radius.pill },
});
