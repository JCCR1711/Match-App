import { Pressable, PressableProps, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";

interface ButtonProps extends PressableProps {
    text: string;
    style?: StyleProp<ViewStyle>;
    colorText?: string;
}

const Button = ({ text, style, colorText, ...props }: ButtonProps) => {
    return (
        <Pressable
            {...props}
            style={[styles.button, style]}
        >
            <Text style={[styles.text, {color: colorText ?? "#000000"}]}>{text}</Text>
        </Pressable>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        backgroundColor: '#ffffff',
        textAlign: 'center',
		justifyContent: 'center',
        height: 40
    },
    text: {
        textAlign: 'center',
        fontFamily: 'Outfit_800ExtraBold'
    }
});