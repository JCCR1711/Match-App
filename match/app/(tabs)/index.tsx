import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/src/hooks/useAuth";
import { router } from "expo-router";
import { CustomButton } from "../../src/components/CustomButton";

export default function HomeScreen() {

	const {user, logout} = useAuth();
	
	const ContinuarLogIn = () => {
		logout();
		router.replace('/auth/slides');
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.main}>
				<Text style={styles.title}>Bienvenido a Match{user?user.email : null}</Text>
				{user ?
					<Text>con usuario</Text>
					:<Text>Sin USUARIO</Text>
				}
				<Text style={styles.subtitle}>
					Esta es la pantalla principal. Usa la navegación inferior para
					moverte.
				</Text>
				<CustomButton
					label="Bienvenido a Match"
					onPress={ContinuarLogIn}
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
