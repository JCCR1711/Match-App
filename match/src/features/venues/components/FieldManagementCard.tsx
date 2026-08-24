import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import ResourceStatusLabel from "@/src/features/venues/components/ResourceStatusLabel";
import { getVenueImage } from "@/src/features/venues/data/venueImages";
import type { SportsFieldDraft } from "@/src/features/venues/types/businessOnboarding";
import { theme } from "@/src/theme";
import { formatMoneyAmount, formatSoles } from "@/src/utils/formatMoney";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

interface FieldManagementCardProps {
  field: SportsFieldDraft;
  disabled?: boolean;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  presentation?: "compact" | "featured";
  onPress: () => void;
}

const FieldManagementCard = ({ field, disabled, subtitle, style, presentation = "compact", onPress }: FieldManagementCardProps) => {
  const isFeatured = presentation === "featured";

  return (
    <AppSurface
      style={[
        styles.card,
        isFeatured ? styles.featuredCard : styles.compactCard,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={`Abrir ${field.fieldName}, estado ${field.status === "active" ? "activa" : "inactiva"}, fútbol ${field.format}, precio ${formatSoles(field.hourlyPrice)}`}
    >
      {isFeatured ? (
        <FeaturedField field={field} />
      ) : (
        <CompactField field={field} venueName={subtitle} />
      )}
    </AppSurface>
  );
};

const FeaturedField = ({ field }: { field: SportsFieldDraft }) => (
  <View style={styles.featuredContent}>
    <Image source={getVenueImage(field.venueId)} style={styles.featuredImage} contentFit="cover" transition={180} cachePolicy="memory-disk" />
    <LinearGradient
      colors={["transparent", "rgba(8, 8, 10, 0.34)", "rgba(8, 8, 10, 0.9)"]}
      locations={[0, 0.34, 1]}
      style={styles.featuredFade}
      pointerEvents="none"
    />
    <View style={styles.featuredBody}>
      <View style={styles.featuredCopy}>
        <ResourceStatusLabel status={field.status} style={styles.cardStatus} />
        <CustomText text={field.fieldName} variant="sectionHeading" style={styles.featuredName} numberOfLines={1} />
      </View>
      <View style={styles.featuredPrice}>
        <View style={styles.featuredPriceRow}>
          <CustomText text="S/" variant="label" style={styles.featuredCurrency} />
          <CustomText text={formatMoneyAmount(field.hourlyPrice)} variant="actionSecondary" style={styles.featuredPriceAmount} numberOfLines={1} />
        </View>
      </View>
    </View>
  </View>
);

const CompactField = ({ field, venueName }: { field: SportsFieldDraft; venueName?: string }) => (
  <View style={styles.compactContent}>
    <LinearGradient
      pointerEvents="none"
      colors={[theme.colors.businessBlueSurface, theme.colors.authBlueDeep]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    <View style={styles.compactMedia}>
      <Image source={getVenueImage(field.venueId)} style={styles.compactImage} contentFit="cover" transition={180} cachePolicy="memory-disk" />
    </View>
    <View style={styles.compactBody}>
      <View style={styles.compactCopy}>
        <ResourceStatusLabel status={field.status} style={styles.cardStatus} />
        <CustomText text={field.fieldName} variant="subtitle" style={styles.compactName} numberOfLines={1} />
        <View style={styles.compactMeta}>
          {venueName ? <CustomText text={venueName} variant="caption" style={styles.compactSubtitle} numberOfLines={1} /> : null}
          {venueName ? <CustomText text="·" variant="caption" style={styles.compactDivider} /> : null}
          <CustomText text={`Fútbol ${field.format}`} variant="caption" style={styles.compactFormat} numberOfLines={1} />
        </View>
      </View>
      <FieldPrice amount={field.hourlyPrice} />
    </View>
  </View>
);

const FieldPrice = ({ amount }: { amount: number }) => (
  <View style={styles.priceRow}>
    <CustomText text="S/" variant="label" style={styles.currency} />
    <CustomText text={formatMoneyAmount(amount)} variant="actionSecondary" style={styles.priceAmount} numberOfLines={1} />
  </View>
);

export default memo(FieldManagementCard);

const styles = StyleSheet.create({
  card: { borderRadius: theme.radius.card, borderWidth: 0, backgroundColor: theme.colors.authSurface },
  featuredCard: { minHeight: 264, backgroundColor: theme.colors.authSurface },
  featuredContent: { flex: 1, minHeight: 264, position: "relative", justifyContent: "flex-end" },
  featuredImage: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.colors.backgroundAlt },
  featuredFade: { position: "absolute", right: 0, bottom: 0, left: 0, height: "66%" },
  featuredBody: { zIndex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md },
  featuredCopy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  featuredName: { flexShrink: 1, minWidth: 0, color: theme.colors.white },
  cardStatus: { alignSelf: "flex-start" },
  featuredPrice: { flexShrink: 0, alignItems: "flex-end" },
  featuredPriceRow: { flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xxs },
  featuredCurrency: { color: theme.colors.white },
  featuredPriceAmount: { color: theme.colors.white },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xxs },
  currency: { color: theme.colors.textOnDarkSecondary },
  priceAmount: { color: theme.colors.white },
  compactCard: { minHeight: 348, backgroundColor: theme.colors.businessBlueSurface },
  compactMedia: { position: "relative", height: 242, margin: theme.spacing.sm, marginBottom: 0, overflow: "hidden", borderRadius: theme.radius.extraLarge, backgroundColor: theme.colors.authSurface },
  compactImage: { width: "100%", height: "100%", backgroundColor: theme.colors.authSurface },
  compactContent: { flex: 1, minWidth: 0, minHeight: 348, overflow: "hidden" },
  compactBody: { minHeight: 106, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.lg, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md },
  compactCopy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  compactName: { flexShrink: 1, minWidth: 0, color: theme.colors.white, fontSize: 22, lineHeight: 28 },
  compactMeta: { minWidth: 0, flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  compactSubtitle: { flexShrink: 1, color: theme.colors.textOnDarkSecondary },
  compactDivider: { color: theme.colors.textOnDarkSecondary },
  compactFormat: { flexShrink: 0, color: theme.colors.white },
});
