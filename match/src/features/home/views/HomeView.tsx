import CustomButton from "@/src/components/ui/CustomButton";
import { useAuth } from "@/src/hooks/useAuth";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/onboarding");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>
          Bienvenido a Match{user ? user.email : null}
        </Text>
        {user ? <Text>con usuario</Text> : <Text>Sin USUARIO</Text>}
        <Text style={styles.subtitle}>
          Esta es la pantalla principal. Usa la navegación inferior para
          moverte.
        </Text>
        <CustomButton label="Cerrar sesión" onPress={handleLogout} />
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
    fontWeight: "700",
    textAlign: "center",
    color: "#1C1C1E",
    fontFamily: "Poppins_700Bold",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#5E5E62",
    textAlign: "center",
    maxWidth: 300,
    fontFamily: "Outfit_600SemiBold",
    fontWeight: "600",
  },
});
