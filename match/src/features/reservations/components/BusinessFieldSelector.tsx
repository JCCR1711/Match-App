import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { memo } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

export interface BusinessFieldOption {
  id: string;
  name: string;
}

interface BusinessFieldSelectorProps {
  fields: BusinessFieldOption[];
  selectedFieldId: string | null;
  onSelectField: (fieldId: string) => void;
}

const BusinessFieldSelector = ({ fields, selectedFieldId, onSelectField }: BusinessFieldSelectorProps) => {
  if (fields.length <= 1) return null;

  return (
    <View style={styles.section}>
      <CustomText text="Cancha" variant="label" style={styles.label} />
      <ScrollView style={styles.optionsScroll} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.options} accessibilityRole="tablist">
        {fields.map((field) => {
          const selected = field.id === selectedFieldId;

          return (
            <Pressable
              key={field.id}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={`Mostrar agenda de ${field.name}`}
              onPress={() => onSelectField(field.id)}
              style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.pressed]}
            >
              <CustomText text={field.name} variant="actionSecondary" style={[styles.optionText, selected && styles.optionTextSelected]} numberOfLines={1} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default memo(BusinessFieldSelector);

const styles = StyleSheet.create({
  section: { gap: theme.spacing.sm },
  label: { color: theme.colors.authTextSecondary, textTransform: "uppercase", letterSpacing: 1.2 },
  optionsScroll: { marginHorizontal: -theme.layout.screenGutter },
  options: { gap: theme.spacing.sm, paddingHorizontal: theme.layout.screenGutter },
  option: { minHeight: 48, justifyContent: "center", paddingHorizontal: theme.spacing.lg, borderRadius: theme.radius.pill, backgroundColor: theme.colors.authSurface },
  optionSelected: { backgroundColor: theme.colors.authPrimary },
  optionText: { color: theme.colors.authTextSecondary },
  optionTextSelected: { color: theme.colors.black },
  pressed: { opacity: 0.72 },
});
