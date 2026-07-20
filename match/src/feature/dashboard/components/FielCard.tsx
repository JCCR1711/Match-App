import CustomText from "@/src/components/CustomText";
import TextSubTitle from "@/src/components/TextSubTitle";
import { FieldPlay } from "@/src/types/FieldPlay";
import { router } from "expo-router";
import { View } from "react-native";

interface FieldCardProps {
    field: FieldPlay;
}

const FieldCard = ({ field }: FieldCardProps) => {

    const handleFieldPress = (id: number) => {
        router.push(`/dashboard/${id}`);
    };
    return (
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
                <CustomText text="imagen" onPress={() => handleFieldPress(field.id)}/>
            </View>
            <View style={{flex: 2}}>
                <TextSubTitle text={field.name}/>
                <CustomText text={field.price.toString()}/>
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                <TextSubTitle text={`${field.percentage.toString()} %`}/>
                <CustomText text="ocupado"/>
            </View>
        </View>
    )
}

export default FieldCard;