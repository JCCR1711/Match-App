import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { Image, ImageSource } from "expo-image";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

type OnboardingImageSource = ImageSource | number;

interface OnboardingSlideProps {
  title: string;
  description: string;
  image?: OnboardingImageSource;
  imageAccessibilityLabel?: string;
}

const OnboardingSlide = ({
  title,
  description,
  image,
  imageAccessibilityLabel,
}: OnboardingSlideProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        {image ? (
          <Animated.View entering={FadeIn.duration(520)} style={styles.imageArea}>
            <Image
              source={image}
              style={styles.image}
              contentFit="contain"
              contentPosition="center"
              transition={150}
              accessibilityLabel={imageAccessibilityLabel}
            />
          </Animated.View>
        ) : null}
        <Animated.View entering={FadeInDown.delay(120).duration(420)} style={styles.content}>
          <CustomText text={title} variant="h1" style={styles.title} />
          <CustomText
            text={description}
            variant="body"
            style={styles.description}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default OnboardingSlide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
  },
  contentWrapper: {
    flex: 1,
    alignItems: "stretch",
    gap: theme.spacing.md,
  },
  imageArea: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "visible",
  },
  image: {
    width: "78%",
    height: "88%",
    alignSelf: "center",
  },
  content: {
    width: "100%",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    ...theme.typography.heroTitle,
    fontSize: 32,
    lineHeight: 37,
    letterSpacing: -0.45,
    width: "100%",
    paddingVertical: 2,
    includeFontPadding: true,
    textAlign: "left",
    textTransform: "none",
  },
  description: {
    color: theme.colors.textOnMediaSecondary,
    paddingBottom: 2,
    maxWidth: 310,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "left",
  },
});
