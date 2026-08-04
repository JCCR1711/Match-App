import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from "react-native";

interface CustomTextTitle extends TextProps {
    text: string;
    style?: StyleProp<TextStyle>;
    colorText?: string;
}

const CustomTextTitle = ({ text, style, colorText, ...props }: CustomTextTitle) => {
    return (
        <Text
            {...props}
            style={[styles.text, style]}
        >
            {text}
        </Text>
    )
}

export default CustomTextTitle;

const styles = StyleSheet.create({
    text: {
        color:'#94ED00',
        fontWeight: "bold",
        textAlign:'center',
        fontSize: 40,
        fontFamily: 'Outfit_800ExtraBold'
    }
})