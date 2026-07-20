import { router } from 'expo-router';
import { MsIcon } from 'material-symbols-react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
//import { arrow_back } from '@material-symbols/svg-400/outlined/arrow_back';
import CustomText from '@/src/components/CustomText';
import CustomTextTitle from '@/src/components/CustomTextTitle';
import { useAuth } from '@/src/hooks/useAuth';
import { msArrowLeftAlt } from "@material-symbols-react-native/rounded-400/msArrowLeftAlt";
import { useState } from 'react';
import Button from '../components/Button';

const LoginView = () => {

	const [userEmail, setUserEmail] = useState<string>('');

	const {sendemail} = useAuth();

	const continuar = () => {
		//send mail to the email especify
		sendemail(userEmail);
		router.push('/auth/verifyUser');
		//router.push('/auth/register');
	};

	const volver = () => {
		router.replace("/auth/slides");
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<View style={{flex: 1, justifyContent: 'flex-end'}}>
					<Text style={{ textAlign: 'left', color: '#ffffff' }} onPress={(e) => { volver(); }}>
						<MsIcon icon={msArrowLeftAlt} color="white" size={30}></MsIcon>
					</Text>
				</View>
			</View>
			<View style={styles.body}>
				<View style={{ flex: 11, justifyContent: 'center', padding: 20 }}>
					<View style={styles.content}>
						<CustomTextTitle text='Binvenido' style={{color: '#ffffff'}}/>
						<CustomText text='Reserva tu proxima cancha en segundos con match' style={{textAlign: 'center'}}/>
						<View style={{ width: '100%' }}>
							<TextInput 
								value={userEmail}
								placeholder='Correo' 
								style={{ color: '#ffffff', borderRadius: 12, padding: 8, backgroundColor: '#3A3A3C', fontFamily: 'Outfit_800ExtraBold' }} placeholderTextColor={'#8E8E93'}
								onChangeText={setUserEmail}
							/>
						</View>
					</View>
				</View>
			</View>
			<View style={styles.footer}>
				<View style={{ paddingInline: 10, flex: 1, backgroundColor: '#000000' }}>
					<Button
					text='Continuar'
					onPress={continuar}				
					/>
				</View>
			</View>
		</SafeAreaView>
	)
};

export default LoginView;


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
		flex: 6
	},
	footer: {
		flex: 1
	},
	textodd: {
		color: '#d42323'
	},
	content: {
		justifyContent: 'center', // Centra verticalmente
		alignItems: 'center', // Centra horizontalmente
		padding: 20,
		backgroundColor: '#000000',
		color: '#ffffff',
		gap: 16
	},
	buttA: {
		borderRadius: 12,
		padding: 0,
		backgroundColor: '#ffffff',
		textAlign: 'center',
		justifyContent: 'center',
		height: 30
	}
});