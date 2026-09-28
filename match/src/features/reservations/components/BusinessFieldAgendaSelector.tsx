import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { memo } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

export interface BusinessFieldAgendaOption {
  id: string;
  name: string;
}

interface BusinessFieldAgendaSelectorProps {
  fields: BusinessFieldAgendaOption[];
  selectedFieldId: string | null;
  onSelect: (fieldId: string) => void;
}

const BusinessFieldAgendaSelector = ({ fields, selectedFieldId, onSelect }: BusinessFieldAgendaSelectorProps) => {
  if (fields.length === 0) return null;
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <CustomText text="Cancha" variant="sectionHeading" style={styles.headingText} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.content} accessibilityRole="tablist" accessibilityLabel="Canchas de la sede">
      {fields.map((field) => {
        const selected = field.id === selectedFieldId;
        return (
          <Pressable
            key={field.id}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onSelect(field.id)}
            style={({ pressed }) => [styles.option, selected && styles.selected, pressed && styles.pressed]}
          >
            <CustomText text={field.name} variant="bodyStrong" style={[styles.text, selected && styles.selectedText]} numberOfLines={1} />
          </Pressable>
        );
      })}
      </ScrollView>
    </View>
  );
};

export default memo(BusinessFieldAgendaSelector);

const styles = StyleSheet.create({
  scroll: { marginHorizontal: -theme.layout.screenGutter },
  content: { gap: theme.spacing.sm, paddingHorizontal: theme.layout.screenGutter },
  section: { gap: theme.spacing.sm },
  heading: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  headingText: { color: theme.colors.white },
  option: { minHeight: 64, justifyContent: "center", gap: theme.spacing.xxs, paddingHorizontal: theme.spacing.lg, borderRadius: theme.radius.extraLarge, borderCurve: "continuous", backgroundColor: theme.colors.authSurface },
  selected: { backgroundColor: theme.colors.businessBlueSurface },
  text: { color: theme.colors.authTextSecondary },
  selectedText: { color: theme.colors.white },
  pressed: { opacity: 0.72 },
});
