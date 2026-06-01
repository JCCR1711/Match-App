import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Este es un modal</Text>
      <Link href="/" dismissTo style={styles.link}>
        <Text style={styles.linkText}>Ir a inicio</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F7F7F7",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1C1C1E",
    textAlign: "center",
    fontFamily: "Outfit_700Bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "#FF5A5F",
    borderRadius: 14,
  },
  linkText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Outfit_700Bold",
  },
});
