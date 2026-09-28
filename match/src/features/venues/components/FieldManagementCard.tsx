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
  presentation?: "compact" | "featured" | "list";
  onPress: () => void;
}

const FieldManagementCard = ({ field, disabled, subtitle, style, presentation = "compact", onPress }: FieldManagementCardProps) => {
  const isFeatured = presentation === "featured";
  const isList = presentation === "list";

  return (
    <AppSurface
      style={[
        styles.card,
        isList ? styles.listCard : isFeatured ? styles.featuredCard : styles.compactCard,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={`Abrir ${field.fieldName}${subtitle ? `, sede ${subtitle}` : ""}, estado ${field.status === "active" ? "activa" : "inactiva"}, fútbol ${field.format}, precio ${formatSoles(field.hourlyPrice)}`}
    >
      {isFeatured || isList ? (
        <FeaturedField field={field} subtitle={subtitle} compact={isList} />
      ) : (
        <CompactField field={field} venueName={subtitle} />
      )}
    </AppSurface>
  );
};

const FeaturedField = ({ field, subtitle, compact = false }: { field: SportsFieldDraft; subtitle?: string; compact?: boolean }) => (
  <View style={[styles.featuredContent, compact && styles.listContent]}>
    <View style={[styles.featuredMedia, compact && styles.listMedia]}>
      <Image source={getVenueImage(field.venueId)} style={styles.featuredImage} contentFit="cover" transition={180} cachePolicy="memory-disk" />
    </View>
    <View style={styles.featuredBody}>
      <View style={styles.featuredCopy}>
        <CustomText text={field.fieldName} variant="bodyStrong" style={styles.featuredName} numberOfLines={1} />
        <CustomText text={compact ? `Fútbol ${field.format}` : subtitle ?? ""} variant="caption" style={styles.featuredMetadata} numberOfLines={1} />
        <ResourceStatusLabel status={field.status} style={styles.featuredStatus} />
      </View>
      <View style={styles.featuredPrice}>
        <View style={styles.featuredPriceValue}>
          <CustomText text="S/" variant="caption" style={styles.featuredCurrency} />
          <CustomText text={formatMoneyAmount(field.hourlyPrice)} variant="actionSecondary" style={styles.featuredAmount} numberOfLines={1} />
        </View>
        <CustomText text="por hora" variant="caption" style={styles.featuredPriceLabel} />
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
  listCard: { height: 92, borderRadius: 0, backgroundColor: "transparent" },
  featuredCard: { height: 116, backgroundColor: "transparent" },
  featuredContent: { minWidth: 0, height: 116, flexDirection: "row", gap: theme.spacing.md, padding: theme.spacing.sm },
  featuredMedia: { width: 100, height: 100, overflow: "hidden", borderRadius: theme.radius.extraLarge, borderCurve: "continuous", backgroundColor: theme.colors.backgroundAlt },
  listContent: { height: 92, gap: theme.spacing.md, paddingHorizontal: 0, paddingVertical: theme.spacing.sm },
  listMedia: { width: 76, height: 76, borderRadius: theme.radius.large },
  featuredImage: { width: "100%", height: "100%", backgroundColor: theme.colors.backgroundAlt },
  featuredBody: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, paddingRight: theme.spacing.sm },
  featuredCopy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  featuredName: { color: theme.colors.white },
  featuredMetadata: { color: theme.colors.authTextSecondary },
  featuredStatus: { marginTop: theme.spacing.xxs, fontSize: 10, lineHeight: 14 },
  featuredPrice: { flexShrink: 0, alignItems: "flex-end" },
  featuredPriceValue: { flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xxs },
  featuredCurrency: { color: theme.colors.textOnDarkSecondary },
  featuredAmount: { color: theme.colors.white },
  featuredPriceLabel: { color: theme.colors.authTextSecondary },
  cardStatus: { alignSelf: "flex-start" },
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
