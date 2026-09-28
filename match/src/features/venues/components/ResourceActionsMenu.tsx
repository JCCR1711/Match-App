import AppBottomSheet from "@/src/components/ui/AppBottomSheet";
import AppSheetActionButton from "@/src/components/ui/AppSheetActionButton";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

interface SecondaryResourceAction {
  label: string;
  onPress: () => void;
}

interface ResourceActionsMenuProps {
  visible: boolean;
  title: string;
  active: boolean;
  onClose: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  secondaryAction?: SecondaryResourceAction;
  disabled?: boolean;
}

const ResourceActionsMenu = ({ visible, title, active, onClose, onToggleStatus, onDelete, secondaryAction, disabled }: ResourceActionsMenuProps) => (
  <AppBottomSheet
    visible={visible}
    title="Opciones"
    collapsedHeight={secondaryAction ? 356 : 284}
    onClose={onClose}
  >
    <View style={styles.actions} accessible accessibilityLabel={`Opciones de ${title}`}>
      {secondaryAction ? <AppSheetActionButton label={secondaryAction.label} onPress={secondaryAction.onPress} disabled={disabled} /> : null}
      <AppSheetActionButton label={active ? "Desactivar" : "Activar"} tone="light" onPress={onToggleStatus} disabled={disabled} />
      <AppSheetActionButton label="Eliminar" tone="text" onPress={onDelete} disabled={disabled} />
    </View>
  </AppBottomSheet>
);

export default ResourceActionsMenu;

const styles = StyleSheet.create({
  actions: { gap: theme.spacing.sm },
});
