import AppBottomSheet from "@/src/components/ui/AppBottomSheet";
import AppSheetActionButton from "@/src/components/ui/AppSheetActionButton";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TimePickerSheetProps {
  visible: boolean;
  title: string;
  value: string;
  onSelect: (time: string) => void;
  onClose: () => void;
}

const timeToDate = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const dateToTime = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hours = Math.floor(index / 2);
  const minutes = index % 2 === 0 ? "00" : "30";
  return `${String(hours).padStart(2, "0")}:${minutes}`;
});

const TimePickerSheet = ({ visible, title, value, onSelect, onClose }: TimePickerSheetProps) => {
  const [draftTime, setDraftTime] = useState(() => timeToDate(value));

  useEffect(() => {
    if (!visible) return;
    setDraftTime(timeToDate(value));
  }, [value, visible]);

  if (Platform.OS !== "ios") {
    const selectedTime = dateToTime(draftTime);
    return (
      <AppBottomSheet
        visible={visible}
        title={title}
        collapsedHeight={590}
        onClose={onClose}
        footer={(
          <AppSheetActionButton
            label="Confirmar hora"
            onPress={() => onSelect(selectedTime)}
          />
        )}
      >
        <CustomText text="Elige una hora" variant="caption" style={styles.androidHint} />
        <View style={styles.timeGrid}>
          {TIME_OPTIONS.map((time) => {
            const selected = time === selectedTime;
            return (
              <Pressable
                key={time}
                onPress={() => setDraftTime(timeToDate(time))}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={`${time}${selected ? ", seleccionada" : ""}`}
                style={({ pressed }) => [styles.timeOption, selected && styles.timeOptionSelected, pressed && styles.timeOptionPressed]}
              >
                <CustomText text={time} variant="caption" style={[styles.timeOptionText, selected && styles.timeOptionTextSelected]} />
              </Pressable>
            );
          })}
        </View>
      </AppBottomSheet>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" presentationStyle="overFullScreen" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Cerrar selector" />
        <SafeAreaView style={styles.sheet} edges={["bottom"]}>
          <View style={styles.handle} />
          <View style={styles.heading}>
            <CustomText text={title} variant="body" style={styles.title} />
            <CustomText text="Desliza para elegir la hora" variant="caption" style={styles.subtitle} />
          </View>
          <DateTimePicker
            value={draftTime}
            mode="time"
            display="spinner"
            locale="es-PE"
            minuteInterval={30}
            textColor={theme.colors.white}
            themeVariant="dark"
            onChange={(_, date) => date && setDraftTime(date)}
            style={styles.picker}
          />
          <AppSheetActionButton
            label="Confirmar hora"
            onPress={() => onSelect(dateToTime(draftTime))}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default TimePickerSheet;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.72)" },
  sheet: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    borderTopLeftRadius: theme.radius.sheet,
    borderTopRightRadius: theme.radius.sheet,
    borderCurve: "continuous",
    backgroundColor: theme.colors.backgroundAlt,
  },
  handle: {
    width: 38,
    height: 5,
    alignSelf: "center",
    marginTop: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceMuted,
  },
  heading: { alignItems: "center", gap: theme.spacing.xxs, paddingTop: theme.spacing.xl },
  title: { color: theme.colors.white, fontSize: 18, fontFamily: theme.fontFamilies.poppinsBold },
  subtitle: { color: theme.colors.authTextSecondary },
  picker: { alignSelf: "stretch", height: 216, marginVertical: theme.spacing.lg },
  androidHint: { color: theme.colors.authTextSecondary },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  timeOption: {
    width: "22%",
    minWidth: 68,
    minHeight: 48,
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.standard,
    backgroundColor: theme.colors.authSurface,
  },
  timeOptionSelected: { backgroundColor: theme.colors.businessBlueSurface },
  timeOptionPressed: { opacity: 0.76 },
  timeOptionText: { color: theme.colors.authText },
  timeOptionTextSelected: { color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold },
});
