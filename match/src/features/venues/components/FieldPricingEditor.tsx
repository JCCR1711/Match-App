import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import TimePickerSheet from "@/src/features/venues/components/TimePickerSheet";
import VenueTextField from "@/src/features/venues/components/VenueTextField";
import { theme } from "@/src/theme";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Keyboard, Pressable, StyleSheet, View } from "react-native";

interface FieldPricingEditorProps {
  dayHourlyPrice: string;
  nightHourlyPrice: string;
  nightStartsAt: string;
  disabled?: boolean;
  showTitle?: boolean;
  onChange: (pricing: { dayHourlyPrice: string; nightHourlyPrice: string; nightStartsAt: string }) => void;
}

/** Shared business pricing controls for new and existing sports fields. */
const FieldPricingEditor = ({ dayHourlyPrice, nightHourlyPrice, nightStartsAt, disabled = false, showTitle = true, onChange }: FieldPricingEditorProps) => {
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const update = (next: Partial<{ dayHourlyPrice: string; nightHourlyPrice: string; nightStartsAt: string }>) => {
    onChange({ dayHourlyPrice, nightHourlyPrice, nightStartsAt, ...next });
  };

  return (
    <View style={styles.container}>
      {showTitle ? <CustomText text="Tarifas" variant="body" style={styles.title} /> : null}
      <VenueTextField
        label="Tarifa diurna por hora"
        prefix="S/"
        value={dayHourlyPrice}
        onChangeText={(value) => update({ dayHourlyPrice: value.replace(/[^0-9.,]/g, "") })}
        placeholder="0.00"
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
        editable={!disabled}
        accessibilityLabel="Tarifa diurna por hora en soles"
      />
      <View style={styles.row}>
        <VenueTextField
          label="Tarifa nocturna"
          prefix="S/"
          value={nightHourlyPrice}
          onChangeText={(value) => update({ nightHourlyPrice: value.replace(/[^0-9.,]/g, "") })}
          placeholder="0.00"
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          editable={!disabled}
          containerStyle={styles.priceField}
          accessibilityLabel="Tarifa nocturna por hora en soles"
        />
        <View style={styles.timeField}>
          <CustomText text="Desde" variant="body" />
          <Pressable
            disabled={disabled}
            onPress={() => setTimePickerVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={`Inicio de tarifa nocturna: ${nightStartsAt}`}
            style={({ pressed }) => [styles.timeButton, disabled && styles.disabled, pressed && styles.pressed]}
          >
            <CustomText text={nightStartsAt} variant="body" style={styles.timeValue} />
            <CustomIcon icon={ArrowRight01Icon} color={theme.colors.authTextSecondary} size={18} />
          </Pressable>
        </View>
      </View>
      <TimePickerSheet
        visible={timePickerVisible}
        title="Inicio de tarifa nocturna"
        value={nightStartsAt}
        onSelect={(time) => {
          update({ nightStartsAt: time });
          setTimePickerVisible(false);
        }}
        onClose={() => setTimePickerVisible(false)}
      />
    </View>
  );
};

export default FieldPricingEditor;

const styles = StyleSheet.create({
  container: { gap: theme.spacing.md },
  title: { color: theme.colors.authText, fontFamily: theme.fontFamilies.poppinsBold },
  row: { flexDirection: "row", gap: theme.spacing.md },
  priceField: { flex: 1 },
  timeField: { width: 112, gap: theme.spacing.sm },
  timeButton: { minHeight: 62, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.xs, paddingHorizontal: theme.spacing.md, borderRadius: theme.radius.extraLarge, backgroundColor: "rgba(255, 255, 255, 0.08)" },
  timeValue: { color: theme.colors.white },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.72 },
});
