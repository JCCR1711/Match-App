import CustomText from "@/src/components/CustomText";
import CustomTextTitle from "@/src/components/CustomTextTitle";
import { useAuth } from "@/src/hooks/useAuth";
import { msClose } from "@material-symbols-react-native/rounded-400/msClose";
import { router } from 'expo-router';
import { MsIcon } from 'material-symbols-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';


const VerifyUserView = () => {
    
    const [code, setCode] = useState(["", "", "", "", "", ""]);

    const {isAuthenticated, userEmail, login, loading} = useAuth();

    const [segundo, setSegundo] = useState<number>(30);
    const [esperando, setesperando] = useState<boolean>(true);

    const { width, height } = useWindowDimensions();
    const size = Math.min(width, height) * 0.12;

    const volver = () => {
        router.back();
    };

    const handlerCode = (index: number, value: string) => {
        const newCode = [...code];
        newCode[index] = value;setCode(newCode);
        setCode(newCode);
    };

    const logInUser = () => {
        let autenticado : boolean;
        autenticado = login(userEmail, code.join(""));
        if(autenticado)
        {
            alert("Usuario autenticado");
            router.replace("/");
        }
        else
        {
            alert("Usuario no autenticado");
        }
    };

    useEffect(() => {

        if (!esperando || segundo <= 0) {
            setesperando(false);
            return;
        }

        const intervalo = setInterval(() => {
            setSegundo(prev => prev - 1);
        }, 1000);

        return (() => clearInterval(intervalo));

    }, [esperando, segundo]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={{ textAlign: 'left', color: '#ffffff', paddingHorizontal: 10 }} onPress={volver}>
                        <MsIcon icon={msClose} color="white" size={20}></MsIcon>
                    </Text>
                </View>
            </View>
            <View style={styles.body}>
                <View style={styles.content}>
                    <View>
                        <CustomTextTitle text="Match" style={{color: '#ffffff'}}/>
                        <CustomText text={`Te enviamos un código a: \n ${userEmail}`}></CustomText>
                    </View>
                    <View style={ styles.validation }>
                        {
                           [...Array(6)].map((_, i) => (
                                <View key={i} style={[styles.validationInput, {width: size, height: size}]}>
                                    <TextInput
                                        onChangeText={(val) => handlerCode(i, val)}
                                        style={[styles.validationInputFiel, {borderRadius: size/5}]}
                                        autoComplete='off' 
                                        maxLength={1}
                                        keyboardType="numeric"
                                    />
                                </View>    
                           ))
                        }
                    </View>
                    <View style={{flex: 1}}>
                        <CustomText text="Reenviar código"/>
                        { segundo == 0 ?
                            <Text
                                style={{textAlign: 'center', color: '#ffffff', fontWeight: 'bold'}}
                                onPress={() => {setSegundo(30); setesperando(true);}}
                            >
                                Reenviar
                            </Text>
                            :
                            <CustomText text={`00:${segundo.toString().padStart(2, '0')}`} style={{textAlign: 'center', fontWeight: 'bold'}}/>
                        }
                    </View>
                </View>
            </View>
            <View style={styles.footer}>
                <View style={{ flex: 2, paddingInline: 10, backgroundColor: '#000000', justifyContent: 'center'}}>
                    {/* {
                        !loading ?
                        <Text>Cargando</Text>
                        :<Button
                            text='Ingresar'
                            //style={{backgroundColor : 'yellow'}}
                            onPress={logInUser}
                        />
                    } */}
                    <Button
                        text='Ingresar'
                        //style={{backgroundColor : 'yellow'}}
                        onPress={logInUser}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default VerifyUserView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000'
    },
    header: {
		flex: 1
	},
	body: {
		flex: 6
	},
	footer: {
		flex: 1
	},
    content: {
        justifyContent: 'center', // Centra verticalmente
		alignItems: 'center', // Centra horizontalmente
		//padding: 20,
        paddingVertical: 20,
        paddingHorizontal: 10,
        gap: 16,
        flex: 1
    },
    validation: {
        flexDirection: 'row',
        width: '100%',
        gap: 8,
        justifyContent: 'center'
    },
    validationInput: {
        //backgroundColor: '#e92222',
        borderColor: '#ffffff',
        //width: 50
    },
    validationInputFiel: {
        backgroundColor: '#1E1E1E',
        borderWidth: 1
        ,height: '100%'
        ,color: '#ffffff'
        ,textAlign: 'center'
    },
    textField: {
        color: '#8E8E93',
        textAlign: 'center',
        fontFamily: 'cursive'
    },
    buttonConfirm: {
        borderRadius: 12,
		padding: 0,
		backgroundColor: '#ffffff',
		textAlign: 'center',
		justifyContent: 'center',
		height: 30
    }
});