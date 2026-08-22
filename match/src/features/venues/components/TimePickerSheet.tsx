import CustomButton from "@/src/components/ui/CustomButton";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useEffect, useRef, useState } from "react";
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

const TimePickerSheet = ({ visible, title, value, onSelect, onClose }: TimePickerSheetProps) => {
  const [draftTime, setDraftTime] = useState(() => timeToDate(value));
  const onSelectRef = useRef(onSelect);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onSelectRef.current = onSelect;
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!visible) return;

    const selectedTime = timeToDate(value);
    setDraftTime(selectedTime);

    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: selectedTime,
        mode: "time",
        is24Hour: true,
        minuteInterval: 30,
        onChange: (event, date) => {
          if (event.type === "set" && date) {
            onSelectRef.current(dateToTime(date));
            return;
          }
          onCloseRef.current();
        },
      });
    }
  }, [value, visible]);

  if (Platform.OS === "android" || Platform.OS === "web") return null;

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
          <CustomButton
            label="Confirmar hora"
            variant="light"
            onPress={() => onSelect(dateToTime(draftTime))}
            style={styles.confirmButton}
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
  confirmButton: { minHeight: 58, borderRadius: theme.radius.pill },
});
