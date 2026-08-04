import CustomTextTitle from "@/src/components/CustomTextTitle"
import TextSubTitle from "@/src/components/TextSubTitle"
import { Text, View } from "react-native"

const SlideInformation = () => {
    return (
        <View style={{flex: 1, justifyContent: 'flex-start', margin: 10}}>
            <View style={{flex: 1}}>
                <TextSubTitle text="Reserva en segundos con" style={{fontSize: 20}}/>
                <CustomTextTitle text="Match" style={{fontSize: 50, textAlign: 'left', color: '#ffffff'}}/>
                <TextSubTitle text="Elige fecha, hora y confirma tu cancha en pocos pasos"/>  
            </View>
            <View style={{flex: 4, gap: 10, paddingVertical: 50}}>
                <View style={{ flex: 1, flexDirection:'row', backgroundColor: '#3A3A3C', borderRadius: 12, padding: 5, marginHorizontal: 30 }}>
                    <View style={{ flex: 1, alignSelf: 'center' }}>
                        <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold', fontSize: 70}}>1</Text>
                    </View>
                    <View style={{ flex: 3, alignSelf: 'center', padding: 10 }}>
                        <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>
                            Elije tu fecha en el horario que prefieras
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection:'row', backgroundColor: '#3A3A3C', borderRadius: 12, padding: 5 }}>
                    <View style={{ flex: 1, alignSelf: 'center' }}>
                        <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold', fontSize: 70 }}>2</Text>
                    </View>
                    <View style={{ flex: 2, alignSelf: 'center' }}>
                        <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>Selecciona el horario que prefieras</Text>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection:'row', backgroundColor: '#3A3A3C', borderRadius: 12, padding: 5, marginHorizontal: 30 }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 70}}>3</Text>
                    </View>
                    <View style={{ flex: 2, alignSelf: 'center' }}>
                        <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>confirma y juega, y listo para jugar</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default SlideInformation