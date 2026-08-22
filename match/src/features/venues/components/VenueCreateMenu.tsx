import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { FootballIcon, Location01Icon } from "@hugeicons/core-free-icons";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface VenueCreateMenuProps {
  visible: boolean;
  onClose: () => void;
  onCreateVenue: () => void;
  onCreateField: () => void;
}

const VenueCreateMenu = ({ visible, onClose, onCreateVenue, onCreateField }: VenueCreateMenuProps) => (
  <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
    <View style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Cerrar menú" />
      <SafeAreaView style={styles.sheet} edges={["bottom"]}>
        <CustomText text="Añadir" variant="body" style={styles.title} />
        <View style={styles.actions}>
          <CustomButton label="Nueva sede" leadingIcon={<CustomIcon icon={Location01Icon} size={28} color={theme.colors.white} />} variant="primary" onPress={onCreateVenue} style={styles.action} />
          <CustomButton label="Nueva cancha" leadingIcon={<CustomIcon icon={FootballIcon} size={28} color={theme.colors.black} />} variant="light" onPress={onCreateField} style={styles.action} />
        </View>
      </SafeAreaView>
    </View>
  </Modal>
);

export default VenueCreateMenu;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.68)" },
  sheet: { gap: theme.spacing.lg, padding: theme.spacing.lg, borderTopLeftRadius: theme.radius.sheet, borderTopRightRadius: theme.radius.sheet, borderCurve: "continuous", backgroundColor: theme.colors.backgroundAlt },
  title: { color: theme.colors.white, fontSize: 20, fontFamily: theme.fontFamilies.poppinsBold },
  actions: { gap: theme.spacing.md },
  action: { minHeight: 62, borderWidth: 0 },
});
