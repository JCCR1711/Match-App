import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import type { IconSvgElement } from "@hugeicons/react-native";
import { ArrowRight01Icon, Delete02Icon, Settings02Icon } from "@hugeicons/core-free-icons";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SecondaryResourceAction {
  label: string;
  icon: IconSvgElement;
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
  <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
    <View style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Cerrar opciones" />
      <SafeAreaView style={styles.sheet} edges={["bottom"]}>
        <CustomText text={title} variant="body" style={styles.title} numberOfLines={1} />
        <View style={styles.actions}>
          <MenuAction label={active ? "Desactivar" : "Activar"} icon={Settings02Icon} onPress={onToggleStatus} disabled={disabled} />
          {secondaryAction ? <MenuAction label={secondaryAction.label} icon={secondaryAction.icon} onPress={secondaryAction.onPress} disabled={disabled} /> : null}
          <MenuAction label="Eliminar" icon={Delete02Icon} onPress={onDelete} disabled={disabled} destructive />
        </View>
      </SafeAreaView>
    </View>
  </Modal>
);

interface MenuActionProps { label: string; icon: IconSvgElement; onPress: () => void; disabled?: boolean; destructive?: boolean }

const MenuAction = ({ label, icon, onPress, disabled, destructive }: MenuActionProps) => (
  <Pressable disabled={disabled} onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.action, disabled && styles.disabled, pressed && styles.pressed]}>
    <CustomIcon icon={icon} color={destructive ? theme.colors.error : theme.colors.white} size={27} strokeWidth={2.2} />
    <CustomText text={label} variant="body" style={[styles.actionLabel, destructive && styles.deleteLabel]} />
    {!destructive ? <CustomIcon icon={ArrowRight01Icon} color={theme.colors.authTextSecondary} size={23} strokeWidth={2.4} /> : null}
  </Pressable>
);

export default ResourceActionsMenu;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.68)" },
  sheet: { gap: theme.spacing.xl, paddingHorizontal: theme.spacing.xl, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.lg, borderTopLeftRadius: theme.radius.sheet, borderTopRightRadius: theme.radius.sheet, borderCurve: "continuous", backgroundColor: theme.colors.backgroundAlt },
  title: { color: theme.colors.white, fontSize: 22, lineHeight: 28, fontFamily: theme.fontFamilies.poppinsBold },
  actions: { gap: theme.spacing.xxs },
  action: { minHeight: 66, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, paddingHorizontal: theme.spacing.xs },
  actionLabel: { flex: 1, color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold },
  deleteLabel: { color: theme.colors.error },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.68 },
});
