import { theme } from "@/src/theme";
import { StyleSheet, Text } from "react-native";

interface TermsAcceptanceProps {
  onOpenTerms: () => void;
}

const TermsAcceptance = ({ onOpenTerms }: TermsAcceptanceProps) => (
  <Text style={styles.notice}>
    Al crear mi cuenta, acepto los{" "}
    <Text
      style={styles.link}
      onPress={onOpenTerms}
      accessibilityRole="link"
      accessibilityLabel="Leer los términos"
    >
      Términos
    </Text>{" "}
    y la{" "}
    <Text
      style={styles.link}
      onPress={onOpenTerms}
      accessibilityRole="link"
      accessibilityLabel="Leer la política de privacidad"
    >
      Política de privacidad
    </Text>
    .
  </Text>
);

export default TermsAcceptance;

const styles = StyleSheet.create({
  notice: {
    color: theme.colors.authTextSecondary,
    ...theme.typography.actionSecondary,
    textAlign: "center",
  },
  link: {
    color: theme.colors.accentSoft,
    textDecorationLine: "underline",
  },
});
