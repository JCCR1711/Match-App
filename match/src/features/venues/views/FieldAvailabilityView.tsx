import AppScreenHeader from "@/src/components/ui/AppScreenHeader";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import VenueSetupBackground from "@/src/features/venues/components/VenueSetupBackground";
import VenueTextField from "@/src/features/venues/components/VenueTextField";
import WeeklyScheduleEditor from "@/src/features/venues/components/WeeklyScheduleEditor";
import { venueOnboardingGateway } from "@/src/features/venues/services";
import type { BusinessOnboardingDraft, WeeklySchedule } from "@/src/features/venues/types/businessOnboarding";
import { useAuth } from "@/src/hooks/useAuth";
import { useCollapsibleHeader } from "@/src/hooks/useCollapsibleHeader";
import { theme } from "@/src/theme";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const INITIAL_SCHEDULE: WeeklySchedule = {
  weekdays: [],
  openingTime: "08:00",
  closingTime: "23:00",
};

const FieldAvailabilityView = () => {
  const { accessToken } = useAuth();
  const { scrollY, onScroll, headerContentInset } = useCollapsibleHeader();
  const { fieldId } = useLocalSearchParams<{ fieldId?: string }>();
  const [draft, setDraft] = useState<BusinessOnboardingDraft | null>(null);
  const [schedule, setSchedule] = useState<WeeklySchedule>(INITIAL_SCHEDULE);
  const [hourlyPrice, setHourlyPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const selectedField = draft?.fields.find((field) => field.fieldId === fieldId) ?? draft?.field;

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
        const currentField = fieldId
          ? currentDraft?.fields.find((field) => field.fieldId === fieldId)
          : currentDraft?.fields[0];

        if (!currentDraft || !currentField) {
          router.replace("/(tabs)/dashboard");
          return;
        }

        setDraft(currentDraft);
        const currentSchedule = currentField.availability ?? currentField.scheduleOverride;
        if (currentSchedule) {
          setSchedule({
            weekdays: currentSchedule.weekdays,
            openingTime: currentSchedule.openingTime,
            closingTime: currentSchedule.closingTime,
          });
        }
        const price = currentField.availability?.hourlyPrice ?? currentField.hourlyPrice;
        if (price > 0) setHourlyPrice(price.toString());
      } catch (loadError) {
        if (active) {
          setErrorMessage(loadError instanceof Error ? loadError.message : "No pudimos cargar el horario.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadDraft();
    return () => { active = false; };
  }, [accessToken, fieldId]);

  const handleSave = async () => {
    const parsedPrice = Number(hourlyPrice.replace(",", "."));
    if (schedule.weekdays.length === 0) {
      setErrorMessage("Selecciona al menos un día.");
      return;
    }
    if (schedule.openingTime >= schedule.closingTime) {
      setErrorMessage("La hora de cierre debe ser posterior a la apertura.");
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setErrorMessage("Ingresa un precio válido.");
      return;
    }
    if (!draft || !selectedField || !accessToken) return;

    setSubmitting(true);
    setErrorMessage(null);
    try {
      await venueOnboardingGateway.saveFieldAvailability(
        accessToken,
        draft.organizationId,
        selectedField.fieldId,
        { ...schedule, hourlyPrice: parsedPrice, currency: "PEN" },
      );
      if (fieldId) router.back();
      else router.replace("/(tabs)/dashboard");
    } catch (saveError) {
      setErrorMessage(saveError instanceof Error ? saveError.message : "No pudimos guardar el horario.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <VenueSetupBackground variant="field" />
      <AppScreenHeader
        title={selectedField?.fieldName ?? "Horario"}
        onBack={() => router.back()}
        backAccessibilityLabel="Volver a la cancha"
        scrollY={scrollY}
      />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <KeyboardAvoidingView style={styles.keyboardArea} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <Animated.ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingTop: headerContentInset + theme.spacing.xl }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {loading ? (
              <CustomText text="Cargando..." variant="body" style={styles.centeredText} />
            ) : (
              <View style={styles.content}>
                <WeeklyScheduleEditor
                  value={schedule}
                  disabled={submitting}
                  onChange={(nextSchedule) => {
                    setSchedule(nextSchedule);
                    setErrorMessage(null);
                  }}
                />

                <VenueTextField
                  label="Precio por hora"
                  value={hourlyPrice}
                  onChangeText={(value) => {
                    setHourlyPrice(value.replace(/[^0-9.,]/g, ""));
                    setErrorMessage(null);
                  }}
                  placeholder="S/ 120"
                  keyboardType="decimal-pad"
                  editable={!submitting}
                  accessibilityLabel="Precio por hora en soles"
                />

                <View style={styles.footer}>
                  {errorMessage ? <CustomText text={errorMessage} variant="caption" style={styles.errorText} accessibilityRole="alert" /> : null}
                  <CustomButton
                    label={submitting ? "Guardando..." : "Guardar horario"}
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

export default FieldAvailabilityView;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.authCanvas },
  safeArea: { flex: 1 },
  keyboardArea: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xxl },
  centeredText: { marginVertical: "auto", color: theme.colors.authTextSecondary, textAlign: "center" },
  content: { flex: 1, gap: theme.spacing.huge },
  footer: { marginTop: "auto", gap: theme.spacing.md, paddingTop: theme.spacing.md },
  errorText: { color: theme.colors.errorSoft, textAlign: "center" },
  saveButton: { minHeight: 62, borderRadius: theme.radius.pill },
  saveButtonLabel: { ...theme.typography.action },
});
