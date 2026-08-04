import CustomText from "@/src/components/CustomText";
import TextSubTitle from "@/src/components/TextSubTitle";
import { useWindowDimensions, View } from "react-native";

const ScheduleCard = ({indice, schedule}:{indice: number ,schedule: string}) => {

    const { width, height } = useWindowDimensions();
    const size = Math.min(width, height) * 0.12;

    return (
        <View style={{flexDirection: 'row', minHeight: 40}}>
            <View style={{alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                <View style={{borderWidth: 2, borderColor: '#ffffff', borderRadius: size / 2, alignSelf: 'center', height: size, width: size, justifyContent: 'center', alignItems: 'center'}}>
                    <CustomText text={indice.toString()}/>
                </View>
            </View>
            <View style={{flex: 2, paddingHorizontal: 10, alignSelf: 'center'}}>
                <TextSubTitle text={`${schedule.split('|')[0]}`}/>
            </View>
            <View style={{flex: 1}}>
                <TextSubTitle text={`${schedule.split('|')[1]}%`}/>
                <CustomText text="ocupado"/>
            </View>
        </View>
    )
}

export default ScheduleCard;