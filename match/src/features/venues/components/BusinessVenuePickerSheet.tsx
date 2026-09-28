import AppBottomSheet from "@/src/components/ui/AppBottomSheet";
import CustomText from "@/src/components/ui/CustomText";
import type { VenueLocation } from "@/src/features/venues/types/businessOnboarding";
import { theme } from "@/src/theme";
import { Pressable, StyleSheet, View } from "react-native";

interface BusinessVenuePickerSheetProps {
  venues: VenueLocation[];
  selectedVenueId: string | null;
  visible: boolean;
  onClose: () => void;
  onSelect: (venueId: string) => void;
}

const BusinessVenuePickerSheet = ({ venues, selectedVenueId, visible, onClose, onSelect }: BusinessVenuePickerSheetProps) => (
  <AppBottomSheet visible={visible} title="Seleccionar sede" collapsedHeight={Math.min(560, 150 + venues.length * 72)} onClose={onClose}>
    <View style={styles.list} accessibilityRole="radiogroup">
      {venues.map((venue) => {
        const selected = venue.venueId === selectedVenueId;

        return (
          <Pressable
            key={venue.venueId}
            accessibilityRole="radio"
            accessibilityLabel={venue.venueName}
            accessibilityState={{ selected }}
            onPress={() => onSelect(venue.venueId)}
            style={({ pressed }) => [styles.item, selected && styles.itemSelected, pressed && styles.pressed]}
          >
            <CustomText text={venue.venueName} variant="bodyStrong" style={styles.name} numberOfLines={1} />
            {selected ? <CustomText text="Actual" variant="caption" style={styles.current} /> : null}
          </Pressable>
        );
      })}
    </View>
  </AppBottomSheet>
);

export default BusinessVenuePickerSheet;

const styles = StyleSheet.create({
  list: { gap: theme.spacing.xs },
  item: { minHeight: 64, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, borderRadius: theme.radius.extraLarge, borderCurve: "continuous" },
  itemSelected: { backgroundColor: theme.colors.businessBlueSurface },
  name: { flex: 1, minWidth: 0, color: theme.colors.white },
  current: { color: theme.colors.textOnDarkSecondary },
  pressed: { opacity: 0.76 },
});
