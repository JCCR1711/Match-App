import CustomText from "@/src/components/CustomText";
import TextSubTitle from "@/src/components/TextSubTitle";
import { ClienteReservation } from "@/src/types/ClientReservation";
import { StyleSheet, useWindowDimensions, View } from "react-native";

interface ClienteReservationCardProps {
    clienteReservation: ClienteReservation;
}

const ClientReservationCard = ({ clienteReservation }: ClienteReservationCardProps) => {
    const { width, height } = useWindowDimensions();
    const size = Math.min(width, height) * 0.15;

    return (
        <View key={`clientReservation_${clienteReservation.id}`} style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
                <View style={{borderWidth: 2, borderColor: '#ffffff', borderRadius: size / 2, alignSelf: 'center', height: size, width: size}}>
                    {/* <CustomText text={"imagen"}/> */}
                </View>
            </View>
            <View style={{flex: 2}}>
                <TextSubTitle text={clienteReservation.customer}/>
                <CustomText text={clienteReservation.schudele}/>
                <CustomText text={clienteReservation.fieldName}/>
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                <TextSubTitle text={`Completado`}/>
                <View style={styles.dot}></View>
                <CustomText text={`S/${clienteReservation.cost}`} style={{fontWeight: 'bold', paddingTop: 10}}/>
            </View>
        </View>
    )
}

export default ClientReservationCard;

const styles = StyleSheet.create({
    dot: {
		width: 40,
		height: 10,
		borderRadius: 5,
		backgroundColor: '#14e737',
		marginHorizontal: 5,
	}
})