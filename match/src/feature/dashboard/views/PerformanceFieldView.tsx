import CustomText from "@/src/components/CustomText";
import CustomTextTitle from "@/src/components/CustomTextTitle";
import TextSubTitle from "@/src/components/TextSubTitle";
import { fieldsPlay } from "@/src/constants/gmails";
import { FieldPlay } from "@/src/types/FieldPlay";
import { msArrowLeftAlt } from "@material-symbols-react-native/rounded-400/msArrowLeftAlt";
import { msError } from "@material-symbols-react-native/rounded-400/msError";
import { msKeyboardArrowDown } from "@material-symbols-react-native/rounded-400/msKeyboardArrowDown";
import { router, useLocalSearchParams } from "expo-router";
import { MsIcon } from "material-symbols-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit/v2";
import { SafeAreaView } from "react-native-safe-area-context";
import ScheduleCard from "../components/ScheduleCard";
import SummaryCard from "../components/SummaryCard";

const PerformanceFieldView = () => {
    
    const { id } = useLocalSearchParams<{ id: string }>();
    
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [field, setField] = useState<FieldPlay | null>(null);
    
    const data = [
        { month: "Jan", revenue: 52 },
        { month: "Feb", revenue: 86 },
        { month: "Mar", revenue: 58 },
        { month: "Apr", revenue: 134 }
    ];

    const volver = () => {
        router.back();
    };

    useEffect(() => {
        const fieldData = fieldsPlay.find(o => o.id == Number(id));
        if (fieldData)
        {
            setField(fieldData);
        }
    }, [id])
    
    if (!field) {
        return (
            <View style={styles.container}>
                <CustomText text="Cargando..." />
            </View>
        )
    }
    
    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', padding: 20}}>
                        <Text style={{ textAlign: 'left', color: '#ffffff', verticalAlign: 'bottom'}} onPress={(e) => { volver(); }}>
                            <MsIcon icon={msArrowLeftAlt} color="white" size={30}/>
                        </Text>
                        <CustomTextTitle text="Rendimiento" style={{color: '#ffffff', fontSize: 30}}/>
                    </View>
                </View>
                <View style={styles.body}>
                    <ScrollView
                        //style={{ flex: 1 }}
                        contentContainerStyle={{
                            padding: 20,
                            gap: 20,
                            flexGrow: 1,
                            //justifyContent: 'center',
                            //alignItems: 'center',
                        }}
                    >
                        <View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <TextSubTitle text={`${field.name}`} style={{color: '#ffffff', fontSize: 25}}/>
                                <TextSubTitle text="Activa" style={{color: '#14e737'}}/>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <CustomText text={`${field.direction}`}/>
                                <Pressable style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <CustomText text="Semanal"/>
                                    <MsIcon icon={msKeyboardArrowDown} color="white" size={30}/> 
                                </Pressable>
                            </View>
                        </View>
                        <View style={{gap: 10}}>
                            <TextSubTitle
                                text="Resumen"
                            />
                            <SummaryCard
                                Ingresos={field.summary.Ingresos}
                                IngresosPorcentaje={field.summary.IngresosPorcentaje}
                                Ocupacion={field.summary.Ocupacion}
                                OcupacionPorcentaje={field.summary.OcupacionPorcentaje}
                                Reservas={field.summary.Reservas}
                                ReservasPorcentaje={field.summary.ReservasPorcentaje}
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
                                {width > 0 && height > 0 && (
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
                                )}
                            </View>
                        </View>
                        <View style={{gap: 10}}>
                            <View style={{justifyContent: 'flex-start', flexDirection: 'row', gap: 10}}>
                                <TextSubTitle text="Horas Pico"/>
                                <MsIcon icon={msError} color={"#e0e0e0"} size={20}/>
                            </View>
                            <View style={{minHeight: 300}}>
                                {width > 0 && height > 0 && (
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
                                )}
                            </View>
                        </View>
                        <View style={{gap: 10}}>
                            <TextSubTitle
                                text="Mejores horarios"
                            />
                            {
                                field.bestSchedules.map((schedule, i) => (
                                    <ScheduleCard
                                        key={i}
                                        indice={i + 1}
                                        schedule={schedule}
                                    />
                                ))
                            }
                        </View>
                        <View style={{gap: 10}}>
                            <TextSubTitle
                                text="Ingresos totales"
                            />
                            <View style={{flexDirection: 'row', gap: 10}}>
                                <View style={{flex: 1, borderRightWidth: 2, borderColor: '#ffffff'}}>
                                    <CustomText text="Ingresos Totales"/>
                                    <CustomTextTitle
                                        text={`s/${field.summary.IngresosTotales}`}
                                        style={{color: '#ffffff'}}
                                    />
                                </View>
                                <View style={{flex: 1}}>
                                    <CustomText text="Horas Reservadas"/>
                                    <CustomTextTitle
                                        text={`${field.summary.HorasTotales} h`}
                                        style={{color: '#ffffff'}}
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default PerformanceFieldView;

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
	}
})