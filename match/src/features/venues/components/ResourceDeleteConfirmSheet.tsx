import AppBottomSheet from "@/src/components/ui/AppBottomSheet";
import AppSheetActionButton from "@/src/components/ui/AppSheetActionButton";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

interface ResourceDeleteConfirmSheetProps {
  visible: boolean;
  resourceName: string;
  detail: string;
  disabled?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResourceDeleteConfirmSheet = ({ visible, resourceName, detail, disabled = false, onClose, onConfirm }: ResourceDeleteConfirmSheetProps) => (
  <AppBottomSheet
    visible={visible}
    title="Eliminar"
    collapsedHeight={390}
    onClose={onClose}
    footer={(
      <View style={styles.actions}>
        <AppSheetActionButton label="Eliminar" tone="light" onPress={onConfirm} disabled={disabled} />
        <AppSheetActionButton label="Volver" tone="text" onPress={onClose} disabled={disabled} />
      </View>
    )}
  >
    <View style={styles.copy}>
      <CustomText text={resourceName} variant="subtitle" style={styles.name} numberOfLines={2} />
      <CustomText text={detail} variant="body" style={styles.detail} />
    </View>
  </AppBottomSheet>
);

export default ResourceDeleteConfirmSheet;

const styles = StyleSheet.create({
  copy: { gap: theme.spacing.sm },
  name: { color: theme.colors.white },
  detail: { color: theme.colors.authTextSecondary },
  actions: { gap: theme.spacing.sm, paddingBottom: theme.spacing.sm },
});
