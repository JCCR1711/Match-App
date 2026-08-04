import CustomText from "@/src/components/CustomText";
import { msArrowUpward } from "@material-symbols-react-native/rounded-400/msArrowUpward";
import { msBarChart } from "@material-symbols-react-native/rounded-400/msBarChart";
import { msCalendarToday } from "@material-symbols-react-native/rounded-400/msCalendarToday";
import { msPayments } from "@material-symbols-react-native/rounded-400/msPayments";
import { MsIcon } from "material-symbols-react-native";
import { View } from "react-native";

interface SummaryCardProps {
    Ingresos: number;
    IngresosPorcentaje: number;
    Ocupacion: number;
    OcupacionPorcentaje: number;
    Reservas: number;
    ReservasPorcentaje: number;
}

const SummaryCard = ({ Ingresos, IngresosPorcentaje, Ocupacion, OcupacionPorcentaje, Reservas, ReservasPorcentaje }: SummaryCardProps) => {
    return (
        <View style={{ gap: 10 }}>
            <View style={{ backgroundColor: '#3A3A3C', borderRadius: 12, padding: 10 }}>
                <CustomText
                    text="Ingresos"
                />
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <MsIcon icon={msPayments} color="white" size={30} />
                        <CustomText
                            text={`S/${Ingresos}`}
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <MsIcon icon={msArrowUpward} color="#14e737" size={20} />
                        <CustomText text={`${IngresosPorcentaje}%`} style={{ color: '#14e737' }} />
                        <CustomText
                            text="vs mes anterior"
                        />
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1, backgroundColor: '#3A3A3C', borderRadius: 12, padding: 10 }}>
                    <CustomText
                        text="Ocupacion hoy"
                    />
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <MsIcon icon={msBarChart} color="white" size={30} />
                        <CustomText
                            text={`${Ocupacion}`}
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <MsIcon icon={msArrowUpward} color="#14e737" size={20} />
                        <CustomText text={`${OcupacionPorcentaje}%`} style={{ color: '#14e737' }} />
                        <CustomText
                            text="vs mes anterior"
                        />
                    </View>
                </View>
                <View style={{ flex: 1, backgroundColor: '#3A3A3C', borderRadius: 12, padding: 10 }}>
                    <CustomText
                        text="Reservas"
                    />
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <MsIcon icon={msCalendarToday} color="white" size={20} />
                        <CustomText
                            text={`${Reservas}`}
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <MsIcon icon={msArrowUpward} color="#14e737" size={20} />
                        <CustomText text={`${ReservasPorcentaje}%`} style={{ color: '#14e737' }} />
                        <CustomText
                            text="vs mes anterior"
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default SummaryCard;