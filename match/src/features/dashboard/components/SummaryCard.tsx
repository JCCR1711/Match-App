import CustomText from "@/src/components/ui/CustomText";
import CustomIcon from "@/src/components/ui/CustomIcon";
import { ArrowUp01Icon, BarChartIcon, Calendar03Icon, Payment01Icon } from "@hugeicons/core-free-icons";
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
                        <CustomIcon icon={Payment01Icon} color="white" size={30} />
                        <CustomText
                            text={`S/${Ingresos}`}
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <CustomIcon icon={ArrowUp01Icon} color="#73FE65" size={20} />
                        <CustomText text={`${IngresosPorcentaje}%`} style={{ color: '#73FE65' }} />
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
                        <CustomIcon icon={BarChartIcon} color="white" size={30} />
                        <CustomText
                            text={`${Ocupacion}`}
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <CustomIcon icon={ArrowUp01Icon} color="#73FE65" size={20} />
                        <CustomText text={`${OcupacionPorcentaje}%`} style={{ color: '#73FE65' }} />
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
                        <CustomIcon icon={Calendar03Icon} color="white" size={20} />
                        <CustomText
                            text={`${Reservas}`}
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <CustomIcon icon={ArrowUp01Icon} color="#73FE65" size={20} />
                        <CustomText text={`${ReservasPorcentaje}%`} style={{ color: '#73FE65' }} />
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
