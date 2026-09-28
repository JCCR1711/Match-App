import AppBottomSheet from "@/src/components/ui/AppBottomSheet";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { Building03Icon } from "@hugeicons/core-free-icons";
import { memo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export interface BusinessVenueAgendaOption {
  id: string;
  name: string;
}

interface BusinessVenueAgendaMenuProps {
  venues: BusinessVenueAgendaOption[];
  selectedVenueId: string | null;
  onSelect: (venueId: string) => void;
}

const BusinessVenueAgendaMenu = ({ venues, selectedVenueId, onSelect }: BusinessVenueAgendaMenuProps) => {
  const [visible, setVisible] = useState(false);
  const selectedVenue = venues.find((venue) => venue.id === selectedVenueId) ?? venues[0];
  if (!selectedVenue) return null;

  return (
    <>
      <Pressable
        onPress={() => venues.length > 1 && setVisible(true)}
        disabled={venues.length <= 1}
        accessibilityRole={venues.length > 1 ? "button" : "text"}
        accessibilityLabel={venues.length > 1 ? `Cambiar sede. Actual: ${selectedVenue.name}` : `Sede actual: ${selectedVenue.name}`}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
      >
        <CustomText text={selectedVenue.name} variant="caption" style={styles.triggerText} numberOfLines={1} />
        <CustomIcon icon={Building03Icon} color={theme.colors.white} size={22} strokeWidth={2.75} />
      </Pressable>
      <AppBottomSheet visible={visible} title="Cambiar sede" collapsedHeight={Math.min(560, 150 + venues.length * 72)} onClose={() => setVisible(false)}>
        <View style={styles.list} accessibilityRole="radiogroup">
          {venues.map((venue) => {
            const selected = venue.id === selectedVenue.id;
            return (
              <Pressable
                key={venue.id}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => {
                  onSelect(venue.id);
                  setVisible(false);
                }}
                style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.pressed]}
              >
                <CustomText text={venue.name} variant="bodyStrong" style={styles.optionText} numberOfLines={1} />
                {selected ? <CustomText text="Actual" variant="caption" style={styles.current} /> : null}
              </Pressable>
            );
          })}
        </View>
      </AppBottomSheet>
    </>
  );
};

export default memo(BusinessVenueAgendaMenu);

const styles = StyleSheet.create({
  trigger: { minWidth: 44, maxWidth: 152, height: 44, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: theme.spacing.xs, backgroundColor: "transparent" },
  triggerText: { flexShrink: 1, color: theme.colors.authTextSecondary, textAlign: "right" },
  list: { gap: theme.spacing.xs },
  option: { minHeight: 64, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, borderRadius: theme.radius.extraLarge },
  optionSelected: { backgroundColor: theme.colors.businessBlueSurface },
  optionText: { flex: 1, minWidth: 0, color: theme.colors.white },
  current: { color: theme.colors.textOnDarkSecondary },
  pressed: { opacity: 0.72 },
});
