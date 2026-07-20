import CustomText from "@/src/components/CustomText";
import CustomTextTitle from "@/src/components/CustomTextTitle";
import TextSubTitle from "@/src/components/TextSubTitle";
import { clientReservations, fieldsPlay } from "@/src/constants/gmails";
import { msCalendarToday } from "@material-symbols-react-native/rounded-400/msCalendarToday";
import { msError } from "@material-symbols-react-native/rounded-400/msError";
import { msKeyboardArrowDown } from "@material-symbols-react-native/rounded-400/msKeyboardArrowDown";
import { MsIcon } from "material-symbols-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
//import { LineChart, LineChart } from "react-native-chart-kit/v2";
import { LineChart } from "react-native-chart-kit/v2";
import { SafeAreaView } from "react-native-safe-area-context";
import ClientReservationCard from "../components/ClientReservationCard";
import FieldCard from "../components/FielCard";
import SummaryCard from "../components/SummaryCard";


const DashboardView = () => {

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const data = [
        { month: "Jan", revenue: 52 },
        { month: "Feb", revenue: 86 },
        { month: "Mar", revenue: 58 },
        { month: "Apr", revenue: 134 }
    ];

    const dataSumary = {
        Ingresos: 1250,
        IngresosPorcentaje: 80,
        Ocupacion: 96,
        OcupacionPorcentaje: 65,
        Reservas: 120,
        ReservasPorcentaje: 82
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={{ justifyContent: 'flex-end'}}>
                    <CustomTextTitle
                        text="INGRESOS"
                        style={{textAlign: 'left', color: '#ffffff', fontSize: 20, fontWeight: 'bold'}}
                    />
                    <CustomText text="Resumen de tu club"/>
                </View>
                <View style={{ justifyContent: 'flex-end'}}>
                    <Pressable style={{alignItems: 'flex-end'}}>
                        <MsIcon icon={msCalendarToday} color="white" size={20}/>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <CustomText text="Mayo 2026"/>
                            <MsIcon icon={msKeyboardArrowDown} color="white" size={30}/> 
                        </View>
                    </Pressable>
                </View>
            </View>
            <View style={styles.body}>
                <ScrollView
                    //style={{ flex: 1 }}
                    contentContainerStyle={{
                        padding: 20,
                        gap: 25,
                        flexGrow: 1,
                        //justifyContent: 'center',
                        //alignItems: 'center',
                    }}
                >
                    <View style={{gap: 10}}>
                        <TextSubTitle text="Resumen General"/>
                        <SummaryCard
                            Ingresos={dataSumary.Ingresos}
                            IngresosPorcentaje={dataSumary.IngresosPorcentaje}
                            Ocupacion={dataSumary.Ocupacion}
                            OcupacionPorcentaje={dataSumary.OcupacionPorcentaje}
                            Reservas={dataSumary.Reservas}
                            ReservasPorcentaje={dataSumary.ReservasPorcentaje}
                        />
                    </View>
                    <View style={{gap: 10}}>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                            <TextSubTitle text="Ingresos por dia"/>
                            <Pressable style={{flexDirection: 'row', alignItems: 'center'}}>
                                <CustomText text="Semanal"/>
                                <MsIcon icon={msKeyboardArrowDown} color="white" size={30}/> 
                            </Pressable>
                        </View>
                        <View
                            onLayout={(event) => {
                                setWidth(event.nativeEvent.layout.width);
                                setHeight(event.nativeEvent.layout.height);
                            }}

                            style={{minHeight: 300}}
                        >
                            <LineChart
                                data={data}
                                xKey="month"
                                yKey="revenue"
                                width={width}
                                height={height}
                                theme={{
                                    background: '#000000',
                                    plotBackground: '#000000',
                                    series: ["#ffffff"],
                                    text: "#ffffff",
                                    axis: '#ffffff',
                                    mutedText: '#ffffff'
                                }}
                                curve="monotone"
                                showDots={false}
                            />                
                        </View>
                    </View>
                    <View style={{gap: 10}}>
                        <View style={{justifyContent: 'flex-start', flexDirection: 'row', gap: 10}}>
                            <TextSubTitle text="Horas Pico"/>
                            <MsIcon icon={msError} color={"#e0e0e0"} size={20}/>
                        </View>
                        <View>
                            <LineChart
                                data={data}
                                xKey="month"
                                yKey="revenue"
                                width={width}
                                height={height}
                                theme={{
                                    background: '#000000',
                                    plotBackground: '#000000',
                                    series: ["#ffffff"],
                                    text: "#ffffff",
                                    axis: '#ffffff',
                                    mutedText: '#ffffff'
                                }}
                                curve="monotone"
                                showDots={false}
                            />
                        </View>
                    </View>
                    <View style={{gap: 20}}>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                            <TextSubTitle text="Rendimiento por cancha"/>
                            <Pressable style={{flexDirection: 'row', alignItems: 'center'}}>
                                <CustomText text="Ver mas"/>
                            </Pressable>
                        </View>
                        {
                            fieldsPlay.map((fieldPlay, i) => (
                                <View key={fieldPlay.id + i}>
                                    <FieldCard field={fieldPlay}/>
                                </View>
                            ))
                        }
                    </View>
                    <View style={{gap: 20}}>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                            <TextSubTitle text="Reservas recientes"/>
                            <Pressable style={{flexDirection: 'row', alignItems: 'center'}}>
                                <CustomText text="Ver mas"/>
                            </Pressable>
                        </View>
                        {
                            clientReservations.map((reservation, i) => (
                                <View key={reservation.id + i}>
                                    <ClientReservationCard clienteReservation={reservation}/>
                                </View>
                            ))
                        }
                    </View>
                </ScrollView>
            </View>
            <View>
                
            </View>
        </SafeAreaView>
    )
}

export default DashboardView

const styles = StyleSheet.create({
    container: {
		flex: 1,
		backgroundColor: '#000000',
		color: '#ffffff'
	},
    header: {
		flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        flexDirection: 'row'
	},
	body: {
		flex: 6
	}
})