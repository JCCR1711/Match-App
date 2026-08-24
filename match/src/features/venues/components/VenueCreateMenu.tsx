import AppBottomSheet from "@/src/components/ui/AppBottomSheet";
import AppSheetActionButton from "@/src/components/ui/AppSheetActionButton";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

interface VenueCreateMenuProps {
  visible: boolean;
  onClose: () => void;
  onCreateVenue: () => void;
  onCreateField: () => void;
}

const VenueCreateMenu = ({ visible, onClose, onCreateVenue, onCreateField }: VenueCreateMenuProps) => (
  <AppBottomSheet
    visible={visible}
    title="Añadir"
    collapsedHeight={300}
    onClose={onClose}
  >
    <View style={styles.actions}>
      <AppSheetActionButton label="Nueva sede" onPress={onCreateVenue} />
      <AppSheetActionButton label="Nueva cancha" tone="text" onPress={onCreateField} />
    </View>
  </AppBottomSheet>
);

export default VenueCreateMenu;

const styles = StyleSheet.create({
  actions: { gap: theme.spacing.sm, paddingTop: theme.spacing.xs },
});
