import AppSurface from "@/src/components/ui/AppSurface";
import CustomText from "@/src/components/ui/CustomText";
import { getVenueImage } from "@/src/features/venues/data/venueImages";
import type { SportsFieldDraft } from "@/src/features/venues/types/businessOnboarding";
import { theme } from "@/src/theme";
import { Image } from "expo-image";
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

const FieldManagementCard = ({ field, disabled, subtitle, style, presentation = "compact", onPress }: FieldManagementCardProps) => (
  <AppSurface
    style={[styles.card, presentation === "featured" ? styles.featuredCard : styles.compactCard, style]}
    onPress={onPress}
    disabled={disabled}
    accessibilityLabel={`Abrir ${field.fieldName}, fútbol ${field.format}, precio S/ ${field.hourlyPrice}`}
  >
    {presentation === "featured" ? <FeaturedField field={field} venueName={subtitle} /> : <CompactField field={field} venueName={subtitle} />}
  </AppSurface>
);

const FeaturedField = ({ field, venueName }: { field: SportsFieldDraft; venueName?: string }) => (
  <View style={styles.featuredContent}>
    <View style={styles.featuredMedia}>
      <Image source={getVenueImage(field.venueId)} style={styles.featuredImage} contentFit="cover" transition={180} cachePolicy="memory-disk" />
      <View style={styles.formatBadge}>
        <CustomText text={field.format} variant="actionSecondary" style={styles.formatBadgeText} />
      </View>
    </View>
    <View style={styles.featuredBody}>
      <View style={styles.featuredCopy}>
        <CustomText text={field.fieldName} variant="subtitle" style={styles.featuredName} numberOfLines={1} />
        <CustomText text={venueName ?? "Cancha deportiva"} variant="caption" style={styles.featuredVenue} numberOfLines={1} />
      </View>
      <View style={styles.priceBadge}>
        <CustomText text="S/" variant="label" style={styles.featuredCurrency} />
        <CustomText text={String(field.hourlyPrice)} variant="subtitle" style={styles.featuredPriceAmount} numberOfLines={1} />
      </View>
    </View>
  </View>
);

const CompactField = ({ field, venueName }: { field: SportsFieldDraft; venueName?: string }) => (
  <>
    <Image source={getVenueImage(field.venueId)} style={styles.compactImage} contentFit="cover" transition={180} cachePolicy="memory-disk" />
    <View style={styles.compactContent}>
      <View style={styles.compactCopy}>
        <CustomText text={field.fieldName} variant="sectionHeading" style={styles.compactName} numberOfLines={1} />
        <CustomText text={venueName ?? `Fútbol ${field.format}`} variant="caption" style={styles.compactSubtitle} numberOfLines={1} />
      </View>
      <View style={styles.compactFooter}>
        <CustomText text={`Fútbol ${field.format}`} variant="caption" style={styles.compactFormat} numberOfLines={1} />
        <FieldPrice amount={field.hourlyPrice} />
      </View>
    </View>
  </>
);

const FieldPrice = ({ amount }: { amount: number }) => (
  <View style={styles.priceRow}>
    <CustomText text="S/" variant="label" style={styles.currency} />
    <CustomText text={String(amount)} variant="actionSecondary" style={styles.priceAmount} numberOfLines={1} />
  </View>
);

export default memo(FieldManagementCard);

const styles = StyleSheet.create({
  card: { borderRadius: theme.radius.extraLarge, borderWidth: 0, backgroundColor: theme.colors.authSurface },
  featuredCard: { backgroundColor: theme.colors.black },
  featuredContent: { flex: 1 },
  featuredMedia: { position: "relative" },
  featuredImage: { width: "100%", aspectRatio: 1.8, backgroundColor: theme.colors.backgroundAlt },
  formatBadge: { position: "absolute", top: theme.spacing.md, left: theme.spacing.md, minHeight: 40, justifyContent: "center", paddingHorizontal: theme.spacing.md, borderRadius: theme.radius.pill, backgroundColor: theme.colors.accent },
  formatBadgeText: { color: theme.colors.black },
  priceBadge: { minHeight: 48, flexDirection: "row", alignItems: "baseline", justifyContent: "center", gap: theme.spacing.xs, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs, borderRadius: theme.radius.pill, backgroundColor: theme.colors.authPrimary },
  featuredBody: { minWidth: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md, padding: theme.spacing.lg },
  featuredCopy: { flex: 1, minWidth: 0, gap: theme.spacing.xs },
  featuredName: { color: theme.colors.white },
  featuredVenue: { color: theme.colors.textOnDarkSecondary },
  featuredCurrency: { color: theme.colors.surfaceMuted },
  featuredPriceAmount: { color: theme.colors.black },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xxs },
  currency: { color: theme.colors.authTextSecondary },
  priceAmount: { color: theme.colors.white },
  compactCard: { minHeight: 120, flexDirection: "row" },
  compactImage: { width: 112, alignSelf: "stretch", backgroundColor: theme.colors.authSurface },
  compactContent: { flex: 1, minWidth: 0, justifyContent: "space-between", gap: theme.spacing.sm, padding: theme.spacing.md },
  compactCopy: { gap: theme.spacing.xxs },
  compactName: { color: theme.colors.white },
  compactSubtitle: { color: theme.colors.authTextSecondary },
  compactFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.sm },
  compactFormat: { flex: 1, color: theme.colors.authTextSecondary },
});
