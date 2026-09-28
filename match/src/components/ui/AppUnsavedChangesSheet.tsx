import AppBottomSheet from "@/src/components/ui/AppBottomSheet";
import AppSheetActionButton from "@/src/components/ui/AppSheetActionButton";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

interface AppUnsavedChangesSheetProps {
  visible: boolean;
  onKeepEditing: () => void;
  onDiscard: () => void;
}

const AppUnsavedChangesSheet = ({ visible, onKeepEditing, onDiscard }: AppUnsavedChangesSheetProps) => (
  <AppBottomSheet
    visible={visible}
    title="Cambios sin guardar"
    collapsedHeight={260}
    onClose={onKeepEditing}
    footer={(
      <View style={styles.actions}>
        <AppSheetActionButton label="Continuar editando" tone="light" onPress={onKeepEditing} />
        <AppSheetActionButton label="Descartar" tone="text" onPress={onDiscard} />
      </View>
    )}
  >
    <View />
  </AppBottomSheet>
);

export default AppUnsavedChangesSheet;

const styles = StyleSheet.create({
  actions: { gap: theme.spacing.sm, paddingBottom: theme.spacing.sm },
});
