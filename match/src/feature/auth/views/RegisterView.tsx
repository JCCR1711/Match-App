import CustomText from "@/src/components/CustomText";
import CustomTextTitle from "@/src/components/CustomTextTitle";
import TextSubTitle from "@/src/components/TextSubTitle";
import { msArrowLeftAlt } from "@material-symbols-react-native/rounded-400/msArrowLeftAlt";
import { router } from "expo-router";
import { MsIcon } from "material-symbols-react-native";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";


const RegisterView = () => {

    const continuar = () => {
		router.push('/auth/registerUser');
	};

    const volver = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                    <Text style={{ textAlign: 'left', color: '#ffffff', paddingStart: 10 }} onPress={(e) => { volver(); }}>
                        <MsIcon icon={msArrowLeftAlt} color="white" size={30}></MsIcon>
                    </Text>
                </View>
            </View>
            <View style={styles.body}>
                <View style={{flex: 1, justifyContent: 'flex-end', margin: 10, gap: 15}}>
                    <CustomTextTitle text="Bienvenido" style={{color: '#ffffff'}}/>
                    <CustomText text="Reserva tu proxima cancha en segundos con match" style={{textAlign: 'center', paddingHorizontal: 30}}/>
                    <Button
                        text="Continuar con Google"
                        onPress={continuar}
                    />
                    <Button
                        text="Continuar con Apple"
                        style={{backgroundColor: '#1E1E1E'}}
                        colorText="#ffffff"
                        onPress={continuar}
                    />
                </View>
            </View>
            <View style={styles.footer}>
                <TextSubTitle text="continuar con email"/>
                <CustomText text={`Al pulsar en "continuar con..." Aceptas nuestros terminos y condiciones`} style={{paddingHorizontal: 40, textAlign: 'center'}}/>
            </View>
        </SafeAreaView>
    )
}

export default RegisterView;

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
		flex: 1,
        alignItems: 'center',
        gap: 20
	}
})