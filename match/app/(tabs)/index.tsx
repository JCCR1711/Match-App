import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "../../src/components/CustomButton";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Bienvenido a Match</Text>
        <Text style={styles.subtitle}>
          Esta es la pantalla principal. Usa la navegación inferior para
          moverte.
        </Text>
        <CustomButton
          label="Bienvenido a Match"
          onPress={() =>
            Alert.alert("¡Bienvenido!", "Has abierto Match correctamente.")
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    rowGap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#1C1C1E",
    fontFamily: "Outfit_800ExtraBold",
  },
  subtitle: {
    fontSize: 16,
    color: "#5E5E62",
    textAlign: "center",
    maxWidth: 300,
    fontFamily: "Outfit_400Regular",
  },
});
