import { msExplore } from "@material-symbols-react-native/rounded-400/msExplore";
import { MsIcon } from "material-symbols-react-native";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <MsIcon icon={msExplore} size={88} color="#FF5A5F" />
        <Text style={styles.title}>Explora Match</Text>
        <Text style={styles.description}>
          Usa la navegación inferior con Material Symbols para moverte entre las
          secciones.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#1C1C1E",
    fontFamily: "Outfit_800ExtraBold",
  },
  description: {
    marginTop: 8,
    fontSize: 16,
    color: "#3C3C43",
    textAlign: "center",
    lineHeight: 24,
    fontFamily: "Outfit_400Regular",
  },
});
