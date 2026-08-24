import AppBottomSheet from "@/src/components/ui/AppBottomSheet";
import AppSheetActionButton from "@/src/components/ui/AppSheetActionButton";
import CustomText from "@/src/components/ui/CustomText";
import ResourceStatusLabel from "@/src/features/venues/components/ResourceStatusLabel";
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
    collapsedHeight={secondaryAction ? 470 : 390}
    onClose={onClose}
    footer={(
      <View style={styles.actions}>
        {secondaryAction ? <AppSheetActionButton label={secondaryAction.label} onPress={secondaryAction.onPress} disabled={disabled} /> : null}
        <AppSheetActionButton label={active ? "Desactivar" : "Activar"} tone="light" onPress={onToggleStatus} disabled={disabled} />
        <AppSheetActionButton label="Eliminar" tone="text" onPress={onDelete} disabled={disabled} />
      </View>
    )}
  >
    <View style={styles.summary}>
      <CustomText text={title} variant="subtitle" style={styles.name} numberOfLines={2} />
      <ResourceStatusLabel status={active ? "active" : "inactive"} />
    </View>
  </AppBottomSheet>
);

export default ResourceActionsMenu;

const styles = StyleSheet.create({
  summary: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: theme.spacing.md, paddingBottom: theme.spacing.md },
  name: { flex: 1, minWidth: 0, color: theme.colors.white },
  actions: { gap: theme.spacing.sm, paddingBottom: theme.spacing.sm },
});
