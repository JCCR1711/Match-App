import AppBottomSheet from "@/src/components/ui/AppBottomSheet";
import VenueCardOption from "@/src/features/venues/components/VenueCardOption";
import VenuePickerTriggerCard from "@/src/features/venues/components/VenuePickerTriggerCard";
import type { VenueLocation } from "@/src/features/venues/types/businessOnboarding";
import { theme } from "@/src/theme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

interface VenuePickerFieldProps {
  venues: VenueLocation[];
  value: string | null;
  disabled?: boolean;
  onChange: (venueId: string) => void;
}

const VenuePickerField = ({ venues, value, disabled = false, onChange }: VenuePickerFieldProps) => {
  const [visible, setVisible] = useState(false);
  const selectedVenue = venues.find((venue) => venue.venueId === value);

  return (
    <>
      <VenuePickerTriggerCard
        name={selectedVenue?.venueName ?? "Selecciona una sede"}
        location={selectedVenue ? `${selectedVenue.district}, ${selectedVenue.city}` : "Sede para la nueva cancha"}
        disabled={disabled}
        onPress={() => setVisible(true)}
      />

      <AppBottomSheet visible={visible} title="Elegir sede" collapsedHeight={Math.min(620, 205 + venues.length * 80)} onClose={() => setVisible(false)}>
        <View style={styles.options}>
          {venues.map((venue) => (
            <VenueCardOption
              key={venue.venueId}
              name={venue.venueName}
              selected={venue.venueId === value}
              onPress={() => { onChange(venue.venueId); setVisible(false); }}
            />
          ))}
        </View>
      </AppBottomSheet>
    </>
  );
};

export default VenuePickerField;

const styles = StyleSheet.create({
  options: { gap: theme.spacing.sm },
});
