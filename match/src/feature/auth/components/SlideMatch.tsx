import { Text, View } from "react-native";

const SlideMatch = () => {
    return (
        <View style={{flex: 1, justifyContent: 'flex-end', margin: 15}}>
            <View>
                <Text style={{color:'#ffffff', fontWeight: 'bold', textAlign:'center', fontSize: 20 }}>
                    Todo listo para jugar con 
                </Text>
                <Text style={{color:'#94ED00', fontWeight: "bold", textAlign:'center', fontSize: 40, fontFamily: 'Outfit_800ExtraBold' }}>
                    Match
                </Text>
                <Text style={{color:'#ffffff', textAlign:'center'}}>
                    Reserva, organiza y disfruta tus partidos
                    sin complicaciones
                </Text>
            </View>
        </View>
    )
}

export default SlideMatch;