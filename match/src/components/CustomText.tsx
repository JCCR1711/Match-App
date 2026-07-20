import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from "react-native";

interface CustomTextProps extends TextProps {
    text: string;
    style?: StyleProp<TextStyle>;
    colorText?: string;
}

const CustomText = ({ text, style, colorText, ...props }: CustomTextProps) => {
    return (
        <Text
            {...props}
            style={[styles.text, style]}
        >
            {text}
        </Text>
    )
}

export default CustomText;

const styles = StyleSheet.create({
    text: {
        color: '#ffffff',
        fontFamily: 'Outfit_800ExtraBold'
    }
})