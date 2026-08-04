import CustomText from "@/src/components/CustomText";
import TextSubTitle from "@/src/components/TextSubTitle";
import { msKeyboardArrowRight } from "@material-symbols-react-native/rounded-400/msKeyboardArrowRight";
import { router } from "expo-router";
import { MsIcon } from "material-symbols-react-native";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RegisterUserView = () => {

    const handlerLogIn = () => {
        router.push("/auth");
    };

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
            </View>
            <View style={styles.body}>
                <View style={{flex: 1, justifyContent: 'flex-end', margin: 10, gap: 20, paddingVertical: 40}}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{color: '#ffffff'}}>Para que usaras</Text>
                        <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 28}}>Match?</Text>
                    </View>
                    <View style={[styles.userType, {backgroundColor: '#ffffff'}]}>
                        <View style={{flex: 6}}>
                            <TextSubTitle text="Soy una persona" style={{color: '#000000', fontSize: 15}}/>
                            <CustomText text="Quiero reservar para jugar con mis amigos" style={{color: '#000000', fontSize: 15}}/>
                        </View>
                        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                            <MsIcon icon={msKeyboardArrowRight} color="black" size={30}></MsIcon>
                        </View>
                    </View>
                    <View style={[styles.userType, {backgroundColor: '#1E1E1E'}]}>
                        <View style={{flex: 6}}>
                            <TextSubTitle text="Gestionar mi club" style={{fontSize: 15}}/>
                            <CustomText text="Quiero administrar mis clubs y mis canchas" style={{fontSize: 15}}/>
                        </View>
                        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                            <MsIcon icon={msKeyboardArrowRight} color="white" size={30}></MsIcon>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.footer}>
                <View style={{flex: 1, marginTop: 15, gap: 10, alignItems: 'center'}}>
                    <TextSubTitle text="Ya tienes una cuenta?"/>
                    <TextSubTitle text="Iniciar sesión" onPress={handlerLogIn}/>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default RegisterUserView

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
		flex: 3
	},
	footer: {
		flex: 1
	},
    userType: {
        //flex: 1,
        borderRadius: 12,
        flexDirection: 'row',
        padding: 18
    }
})