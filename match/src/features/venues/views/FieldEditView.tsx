import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import FieldPricingEditor from "@/src/features/venues/components/FieldPricingEditor";
import VenueChoicePill from "@/src/features/venues/components/VenueChoicePill";
import VenueTextField from "@/src/features/venues/components/VenueTextField";
import WeeklyScheduleEditor from "@/src/features/venues/components/WeeklyScheduleEditor";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import type {
  FieldFormat,
  FieldScheduleMode,
  WeeklySchedule,
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

const initialSchedule: WeeklySchedule = {
  weekdays: [],
  openingTime: "08:00",
  closingTime: "23:00",
};

const FieldEditView = () => {
  const { fieldId } = useLocalSearchParams<{ fieldId: string }>();
  const { accessToken } = useAuth();
  const { draft, loading, error } = useBusinessDraft();
  const field = draft?.fields.find((item) => item.fieldId === fieldId);
  const venue = draft?.venues.find((item) => item.venueId === field?.venueId);
  const [name, setName] = useState("");
  const [format, setFormat] = useState<FieldFormat>("5v5");
  const [scheduleMode, setScheduleMode] =
    useState<FieldScheduleMode>("custom");
  const [schedule, setSchedule] = useState<WeeklySchedule>(initialSchedule);
  const [dayPrice, setDayPrice] = useState("");
  const [nightPrice, setNightPrice] = useState("");
  const [nightStartsAt, setNightStartsAt] = useState("18:00");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!field) return;

    const currentSchedule =
      field.scheduleOverride ?? field.availability ?? venue?.defaultSchedule;

    setName(field.fieldName);
    setFormat(field.format);
    setScheduleMode(field.scheduleMode);
    setSchedule(
      currentSchedule
        ? {
            weekdays: currentSchedule.weekdays,
            openingTime: currentSchedule.openingTime,
            closingTime: currentSchedule.closingTime,
          }
        : initialSchedule,
    );
    setDayPrice(String(field.hourlyPrice));
    setNightPrice(String(field.nightHourlyPrice ?? field.hourlyPrice));
    setNightStartsAt(field.nightStartsAt ?? "18:00");
  }, [field, venue?.defaultSchedule]);

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

    if (scheduleMode === "inherit" && !venue?.defaultSchedule) {
      setMessage("Esta sede no tiene horario general.");
      return;
    }

    if (
      scheduleMode === "custom" &&
      (schedule.weekdays.length === 0 ||
        schedule.openingTime >= schedule.closingTime)
    ) {
      setMessage("Revisa los días y las horas de la cancha.");
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
          scheduleMode,
          scheduleOverride: scheduleMode === "custom" ? schedule : null,
          hourlyPrice: dayHourlyPrice,
          nightHourlyPrice,
          nightStartsAt,
        },
      );
      router.back();
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
    <AppScreenLayout
      title="Editar cancha"
      backgroundVariant="dashboard"
      onBack={() => router.back()}
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
          <VenueTextField
            label="Nombre de la cancha"
            value={name}
            onChangeText={(value) => {
              setName(value);
              clearMessage();
            }}
            editable={!saving}
          />

          <View style={styles.group}>
            <CustomText text="Formato" variant="body" style={styles.title} />
            <View style={styles.pills}>
              {formats.map((item) => (
                <VenueChoicePill
                  key={item.value}
                  label={item.label}
                  selected={format === item.value}
                  onPress={() => {
                    setFormat(item.value);
                    clearMessage();
                  }}
                  disabled={saving}
                />
              ))}
            </View>
          </View>

          <View style={styles.group}>
            <CustomText text="Horario" variant="body" style={styles.title} />
            <View style={styles.pills}>
              <VenueChoicePill
                label="Usar sede"
                selected={scheduleMode === "inherit"}
                onPress={() => {
                  setScheduleMode("inherit");
                  clearMessage();
                }}
                disabled={saving || !venue?.defaultSchedule}
              />
              <VenueChoicePill
                label="Personalizar"
                selected={scheduleMode === "custom"}
                onPress={() => {
                  setScheduleMode("custom");
                  clearMessage();
                }}
                disabled={saving}
              />
            </View>
            {scheduleMode === "custom" ? (
              <WeeklyScheduleEditor
                value={schedule}
                onChange={(nextSchedule) => {
                  setSchedule(nextSchedule);
                  clearMessage();
                }}
                disabled={saving}
              />
            ) : (
              <CustomText
                text={`Usa el horario general de ${venue?.venueName ?? "la sede"}.`}
                variant="caption"
                style={styles.muted}
              />
            )}
          </View>

          <FieldPricingEditor
            dayHourlyPrice={dayPrice}
            nightHourlyPrice={nightPrice}
            nightStartsAt={nightStartsAt}
            disabled={saving}
            onChange={(pricing) => {
              setDayPrice(pricing.dayHourlyPrice);
              setNightPrice(pricing.nightHourlyPrice);
              setNightStartsAt(pricing.nightStartsAt);
              clearMessage();
            }}
          />

          {message ? (
            <CustomText
              text={message}
              variant="caption"
              style={styles.error}
              accessibilityRole="alert"
            />
          ) : null}

          <CustomButton
            label={saving ? "Guardando..." : "Guardar cambios"}
            variant="primary"
            onPress={save}
            disabled={saving}
            style={styles.button}
          />
        </View>
      )}
    </AppScreenLayout>
  );
};

export default FieldEditView;

const styles = StyleSheet.create({
  content: { gap: theme.layout.groupGap },
  group: { gap: theme.spacing.md },
  title: {
    color: theme.colors.white,
    fontFamily: theme.fontFamilies.poppinsBold,
  },
  pills: { flexDirection: "row", gap: theme.spacing.sm },
  muted: { color: theme.colors.authTextSecondary },
  error: { color: theme.colors.errorSoft, textAlign: "center" },
  button: { minHeight: 56, borderRadius: theme.radius.pill },
});
