import AppCardArrow from "@/src/components/ui/AppCardArrow";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { Pressable, StyleSheet, View } from "react-native";

type BusinessHighlightCardTone = "blue" | "green";

interface BusinessHighlightCardProps {
  accessibilityLabel: string;
  value: string;
  onPress: () => void;
  tone: BusinessHighlightCardTone;
  label?: string;
  valuePrefix?: string;
}

const BusinessHighlightCard = ({
  accessibilityLabel,
  value,
  onPress,
  tone,
  label,
  valuePrefix,
}: BusinessHighlightCardProps) => {
  const isGreen = tone === "green";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isGreen ? styles.greenCard : styles.blueCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.copy}>
        {label ? (
          <CustomText
            text={label}
            variant="caption"
            style={isGreen ? styles.greenLabel : styles.blueLabel}
          />
        ) : null}
        <View style={styles.valueRow}>
          {valuePrefix ? (
            <CustomText
              text={valuePrefix}
              variant="caption"
              style={isGreen ? styles.greenPrefix : styles.blueLabel}
            />
          ) : null}
          <CustomText
            text={value}
            variant={valuePrefix ? "heading" : "subtitle"}
            style={isGreen ? styles.greenValue : styles.blueValue}
          />
        </View>
      </View>

      <AppCardArrow
        backgroundColor={theme.colors.black}
        color={isGreen ? theme.colors.white : theme.colors.accent}
      />
    </Pressable>
  );
};

export default BusinessHighlightCard;

const styles = StyleSheet.create({
  card: {
    minHeight: 128,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.lg,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.card,
    borderCurve: "continuous",
  },
  blueCard: {
    backgroundColor: theme.colors.businessBlueSurface,
  },
  greenCard: {
    backgroundColor: theme.colors.accent,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: theme.spacing.xxs,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: theme.spacing.xs,
  },
  blueLabel: {
    color: theme.colors.textOnDarkSecondary,
  },
  greenLabel: {
    color: theme.colors.black,
  },
  greenPrefix: {
    color: theme.colors.black,
    opacity: 0.72,
  },
  blueValue: {
    color: theme.colors.white,
  },
  greenValue: {
    color: theme.colors.black,
  },
  pressed: {
    opacity: 0.78,
  },
});
