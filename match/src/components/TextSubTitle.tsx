import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from "react-native";

interface SubTitleTextProps extends TextProps {
    text: string;
    style?: StyleProp<TextStyle>;
    colorText?: string;
}

const TextSubTitle = ({ text, style, colorText, ...props }: SubTitleTextProps) => {
    return (
        <Text
            {...props}
            style={[styles.text, style]}
        >
            {text}
        </Text>
    )
}

export default TextSubTitle;

const styles = StyleSheet.create({
    text: {
        color: '#ffffff',
        fontFamily: 'Outfit_800ExtraBold',
        fontWeight: 'bold'
    }
})