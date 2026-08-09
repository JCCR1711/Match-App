import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { Image, ImageSource } from "expo-image";
import { StyleSheet, View } from "react-native";

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
          <View style={styles.imageArea}>
            <Image
              source={image}
              style={styles.image}
              contentFit="contain"
              contentPosition="center"
              transition={150}
              accessibilityLabel={imageAccessibilityLabel}
            />
          </View>
        ) : null}
        <View style={styles.content}>
          <CustomText text={title} variant="h1" style={styles.title} />
          <CustomText
            text={description}
            variant="body"
            style={styles.description}
          />
        </View>
      </View>
    </View>
  );
};

export default OnboardingSlide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.huge,
    paddingBottom: 220,
  },
  contentWrapper: {
    flex: 1,
    alignItems: "center",
    gap: theme.spacing.xxl,
  },
  imageArea: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  image: {
    width: "92%",
    height: "96%",
    transform: [{ translateY: 8 }],
  },
  content: {
    width: "100%",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    ...theme.typography.heroTitle,
    width: "100%",
    paddingVertical: 2,
    includeFontPadding: true,
    textAlign: "center",
    textTransform: "none",
  },
  description: {
    color: "rgba(255, 255, 255, 0.62)",
    paddingBottom: 2,
    maxWidth: 320,
    textAlign: "center",
  },
});
