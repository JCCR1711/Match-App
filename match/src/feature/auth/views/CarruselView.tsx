// import { msArrowRightAlt } from "@material-symbols-react-native/rounded-400/msArrowRightAlt";
import { router } from "expo-router";
// import { MsIcon } from "material-symbols-react-native";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Carrusel from "../components/Carrusel";
import SlideInformation from "../components/SlideInformation";
import SlideMatch from "../components/SlideMatch";


const slides = [
	{
		id: '1',
		title: 'Bienvenido',
		description: 'Encuentra personas con tus mismos intereses.',
		content: <SlideMatch/>
	},
	{
		id: '2',
		title: 'Haz Match',
		description: 'Conecta con personas cerca de ti.',
		content: <SlideInformation/>
	},
	{
		id: '3',
		title: 'Comienza a chatear',
		description: 'Inicia conversaciones de forma segura.',
		content: <SlideMatch/>
	},
];

const CarruselView = () => {

	const [currentIndex, setCurrentIndex] = useState(0);

	const next = () => {
		if (currentIndex < slides.length - 1)
			setCurrentIndex(currentIndex + 1);
		else
			router.push("/auth/register");
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				{currentIndex != 1 && <View style={{flex: 1, justifyContent: 'flex-end'}}>
					<Text style={{ paddingInline: 10, textAlign: 'left', color: '#ffffff', fontWeight: 'bold', fontSize: 20 }}>
						MATCH
					</Text>
				</View>}
			</View>
			<View style={styles.body}>
				<Carrusel
					items={slides}
					currentIndex={currentIndex}
					onIndexChange={setCurrentIndex}
				/>
			</View>
			<View style={styles.footer}>
				<View style={{ paddingInline: 10, alignContent: 'center', gap: 10 }}>
					<Button
						text={
							currentIndex === slides.length - 1
								? 'Empezar'
								: 'Siguiente'
						}
						onPress={next}>
							{/* <MsIcon icon={msArrowRightAlt} color="white" size={30}/> */}
						</Button>
					<View style={styles.dots}>
						{slides.map((_, index) => (
							<View
								key={index}
								style={[
									styles.dot,
									currentIndex === index && styles.activeDot,
								]}
							/>
						))}
					</View>
				</View>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000000',
		color: '#ffffff'
	},
	header: {
		flex: 1
	},
	body: {
		flex: 6,
		paddingVertical: 30
	},
	footer: {
		flex: 1
	},
	dots: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 5,
	},
	dot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: '#CCC',
		marginHorizontal: 5,
	},
	activeDot: {
		backgroundColor: '#94ED00',
		width: 10,
	}
});


export default CarruselView