import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import AppScreenState from "@/src/components/ui/AppScreenState";
import AppSection from "@/src/components/ui/AppSection";
import AppSheetActionButton from "@/src/components/ui/AppSheetActionButton";
import AppSkeleton from "@/src/components/ui/AppSkeleton";
import AppTextField from "@/src/components/ui/AppTextField";
import AppTopSheet from "@/src/components/ui/AppTopSheet";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import ScheduleStatusLabel from "@/src/features/reservations/components/ScheduleStatusLabel";
import useAppToast from "@/src/hooks/useAppToast";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";

const FeedbackPreviewView = () => {
  const { showToast } = useAppToast();
  const [topSheetVisible, setTopSheetVisible] = useState(false);
  const [screenErrorVisible, setScreenErrorVisible] = useState(false);
  const [persistentState, setPersistentState] = useState<"error" | "loading">("error");
  const [screenErrorState, setScreenErrorState] = useState<"error" | "loading">("error");
  const [accountValue, setAccountValue] = useState("1234");
  const accountHasError = accountValue.trim().length < 8;

  useEffect(() => {
    if (persistentState !== "loading") return;
    const timeout = setTimeout(() => setPersistentState("error"), 1500);
    return () => clearTimeout(timeout);
  }, [persistentState]);

  useEffect(() => {
    if (screenErrorState !== "loading") return;
    const timeout = setTimeout(() => setScreenErrorState("error"), 1500);
    return () => clearTimeout(timeout);
  }, [screenErrorState]);

  return (
    <AppScreenLayout
      title="Estados de interfaz"
      headerTitleAlign="center"
      headerTitleSize="compact"
      backgroundVariant="dashboard"
      onBack={() => router.back()}
      backAccessibilityLabel="Volver al perfil"
    >
      <AppSection title="Avisos temporales">
        <View style={styles.actions}>
          <CustomButton label="Operación completada" variant="light" onPress={() => showToast({ message: "Reserva confirmada.", tone: "success" })} />
          <CustomButton label="Información" variant="secondary" onPress={() => showToast({ message: "La agenda se actualizó con los últimos cambios.", tone: "info" })} />
          <CustomButton label="Operación fallida" variant="secondary" onPress={() => showToast({ message: "No pudimos actualizar la cancha." })} />
        </View>
      </AppSection>

      <AppSection title="Avisos globales">
        <View style={styles.actions}>
          <CustomButton
            label="Banner compacto"
            variant="light"
            onPress={() => showToast({
              title: "No pudimos conectar",
              message: "Comprueba tu conexión e inténtalo otra vez.",
              placement: "top",
              presentation: "compactBanner",
              actionLabel: "Reintentar",
              onAction: () => showToast({
                message: "Conexión restablecida.",
                tone: "success",
              }),
            })}
          />
          <CustomButton
            label="Sin conexión"
            variant="secondary"
            onPress={() => showToast({
              title: "Sin conexión",
              message: "Revisa tu red para continuar.",
              placement: "top",
            })}
          />
          <CustomButton
            label="Error con acción"
            variant="secondary"
            onPress={() => showToast({
              title: "No pudimos sincronizar",
              message: "Los cambios siguen guardados en este dispositivo.",
              placement: "top",
              actionLabel: "Reintentar",
              onAction: () => showToast({ message: "Sincronizando cambios...", tone: "info" }),
            })}
          />
          <CustomButton
            label="Estado de la cuenta"
            variant="secondary"
            onPress={() => showToast({
              title: "Sesión actualizada",
              message: "Tu cuenta ya está sincronizada.",
              tone: "info",
              placement: "top",
            })}
          />
        </View>
      </AppSection>

      <AppSection title="Estados que requieren atención">
        <View style={styles.actions}>
          <CustomButton
            label="Abrir panel superior"
            variant="light"
            onPress={() => setTopSheetVisible(true)}
          />
          <CustomButton
            label="Ver error de pantalla"
            variant="secondary"
            onPress={() => {
              setScreenErrorState("error");
              setScreenErrorVisible(true);
            }}
          />
        </View>
      </AppSection>

      <AppSection title="Errores persistentes">
        <AppScreenState
          presentation="section"
          kind={persistentState}
          title={persistentState === "loading" ? "Cargando información" : "No pudimos cargar la información"}
          message={persistentState === "error" ? "Comprueba tu conexión e inténtalo nuevamente." : undefined}
          actionLabel={persistentState === "error" ? "Intentarlo de nuevo" : undefined}
          onAction={persistentState === "error" ? () => setPersistentState("loading") : undefined}
        />
      </AppSection>

      <AppSection title="Estado vacío">
        <AppScreenState
          presentation="section"
          kind="empty"
          title="Todo está al día"
          message="Las nuevas solicitudes aparecerán aquí."
        />
      </AppSection>

      <AppSection title="Validación de campo">
        <AppTextField
          label="Cuenta o CCI"
          value={accountValue}
          onChangeText={setAccountValue}
          keyboardType="number-pad"
          hasError={accountHasError}
          errorMessage={accountHasError ? "Ingresa al menos 8 dígitos." : null}
          accessibilityLabel="Cuenta o CCI de prueba"
        />
      </AppSection>

      <AppSection title="Estados de agenda">
        <View style={styles.statuses}>
          <ScheduleStatusLabel status="available" variant="badge" />
          <ScheduleStatusLabel status="confirmed" variant="badge" />
          <ScheduleStatusLabel status="pending" variant="badge" />
          <ScheduleStatusLabel status="blocked" variant="badge" />
          <ScheduleStatusLabel status="maintenance" variant="badge" />
          <ScheduleStatusLabel status="canceled" variant="badge" />
        </View>
      </AppSection>

      <AppSection title="Carga">
        <View style={styles.skeletonGroup} accessibilityRole="progressbar" accessibilityLabel="Cargando contenido">
          <AppSkeleton height={154} radius={theme.radius.extraLarge} />
          <AppSkeleton height={22} width="62%" radius={theme.radius.small} />
          <AppSkeleton height={16} width="86%" radius={theme.radius.small} />
          <View style={styles.skeletonRow}>
            <AppSkeleton height={88} width="auto" style={styles.skeletonItem} radius={theme.radius.large} />
            <AppSkeleton height={88} width="auto" style={styles.skeletonItem} radius={theme.radius.large} />
          </View>
        </View>
      </AppSection>

      <AppTopSheet
        visible={topSheetVisible}
        title="No pudimos sincronizar"
        height={330}
        onClose={() => setTopSheetVisible(false)}
        footer={(
          <View style={styles.sheetActions}>
            <AppSheetActionButton
              label="Intentarlo de nuevo"
              tone="light"
              onPress={() => {
                setTopSheetVisible(false);
                showToast({ message: "Sincronizando cambios...", tone: "info" });
              }}
            />
            <AppSheetActionButton label="Ahora no" tone="text" onPress={() => setTopSheetVisible(false)} />
          </View>
        )}
      >
        <CustomText
          text="Tus cambios siguen guardados en este dispositivo. Comprueba la conexión para enviarlos."
          variant="body"
          style={styles.sheetMessage}
        />
      </AppTopSheet>

      <Modal
        visible={screenErrorVisible}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={() => setScreenErrorVisible(false)}
      >
        <AppScreenState
          kind={screenErrorState}
          title={screenErrorState === "loading" ? "Cargando información" : "Algo salió mal."}
          message={screenErrorState === "error" ? "¿Quieres volver a intentarlo?" : undefined}
          actionLabel={screenErrorState === "error" ? "Intentarlo de nuevo" : undefined}
          onAction={screenErrorState === "error" ? () => setScreenErrorState("loading") : undefined}
        />
      </Modal>
    </AppScreenLayout>
  );
};

export default FeedbackPreviewView;

const styles = StyleSheet.create({
  actions: { gap: theme.spacing.sm },
  sheetActions: { gap: theme.spacing.xs, paddingBottom: theme.spacing.xs },
  sheetMessage: { color: theme.colors.textOnDarkSecondary },
  statuses: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  skeletonGroup: { gap: theme.spacing.md },
  skeletonRow: { flexDirection: "row", gap: theme.spacing.md },
  skeletonItem: { flex: 1 },
});
