import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { backOrReplace } from "@/src/utils/routerNavigation";
import { ArrowRight01Icon, Cancel01Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SportsDesignPreviewView = () => {
  const { width } = useWindowDimensions();
  const compact = width < 380;

  return (
    <View style={styles.screen}>
    <StatusBar style="dark" />
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <SafeAreaView edges={["top"]} style={styles.safeHeader}>
          <View style={styles.header}>
            <View>
              <CustomText text="MATCH" variant="subtitle" style={styles.wordmark} />
              <CustomText text="PARA LOS QUE JUEGAN" variant="label" style={styles.conceptLabel} />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar concepto deportivo"
              hitSlop={8}
              onPress={() => backOrReplace("/(tabs)")}
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
            >
              <CustomIcon icon={Cancel01Icon} color={theme.colors.white} size={22} strokeWidth={3} />
            </Pressable>
          </View>
        </SafeAreaView>

        <View style={styles.heroContent}>
          <View style={styles.liveTag}>
            <View style={styles.liveDot} />
            <CustomText text="CERCA DE TI" variant="label" style={styles.liveTagText} />
          </View>
          <CustomText
            text="JUEGA HOY."
            variant="display"
            style={[styles.heroTitle, compact && styles.heroTitleCompact]}
            maxFontSizeMultiplier={1.15}
          />
          <CustomText text="Reserva una cancha o únete a un partido cerca de ti." variant="body" style={styles.heroMessage} />
          <View style={styles.heroMedia}>
            <Image
              source={require("@/src/assets/venues/match-club-surco.png")}
              contentFit="cover"
              contentPosition="center"
              style={StyleSheet.absoluteFill}
              accessibilityLabel="Cancha de fútbol iluminada durante la noche"
            />
            <LinearGradient
              colors={[theme.colors.mediaScrimMid, theme.colors.mediaScrimStrong]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.mediaCopy}>
              <CustomText text="MATCH CLUB SURCO" variant="label" style={styles.mediaLabel} />
              <CustomText text="HOY · 21:00" variant="sectionHeading" style={styles.mediaTime} />
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Explorar partidos disponibles"
            onPress={() => router.navigate("/(tabs)")}
            style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}
          >
            <CustomText text="VER DISPONIBILIDAD" variant="action" style={styles.primaryActionText} />
            <View style={styles.primaryActionIcon}>
              <CustomIcon icon={ArrowRight01Icon} color={theme.colors.accent} size={21} strokeWidth={3} />
            </View>
          </Pressable>
        </View>
      </View>

      <SafeAreaView edges={["bottom"]} style={styles.nextMatch}>
        <View style={styles.sectionHeader}>
          <CustomText text="PRÓXIMO PARTIDO" variant="label" style={styles.sectionEyebrow} />
          <CustomText text="No te quedes fuera." variant="heading" style={styles.sectionTitle} />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir partido en Match Club Surco, hoy a las 9 de la noche"
          onPress={() => router.navigate("/(tabs)")}
          style={({ pressed }) => [styles.matchCard, pressed && styles.cardPressed]}
        >
          <View style={styles.matchTime}>
            <CustomText text="21:00" variant="sectionHeading" style={styles.matchTimeValue} />
            <CustomText text="HOY" variant="label" style={styles.matchTimeLabel} />
          </View>
          <View style={styles.matchCopy}>
            <CustomText text="PARTIDO ABIERTO" variant="label" style={styles.matchStatus} />
            <CustomText text="Match Club Surco" variant="sectionHeading" style={styles.matchTitle} numberOfLines={1} />
            <View style={styles.locationRow}>
              <CustomIcon icon={Location01Icon} color={theme.colors.authTextSecondary} size={16} strokeWidth={2.5} />
              <CustomText text="Surco · 3.2 km" variant="caption" style={styles.matchMeta} />
            </View>
          </View>
          <View style={styles.matchArrow}>
            <CustomIcon icon={ArrowRight01Icon} color={theme.colors.accent} size={21} strokeWidth={3} />
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver todas las canchas"
          onPress={() => router.navigate("/(tabs)")}
          style={({ pressed }) => [styles.secondaryAction, pressed && styles.secondaryActionPressed]}
        >
          <CustomText text="VER TODAS LAS CANCHAS" variant="actionSecondary" style={styles.secondaryActionText} />
          <CustomIcon icon={ArrowRight01Icon} color={theme.colors.black} size={20} strokeWidth={3} />
        </Pressable>
      </SafeAreaView>
    </ScrollView>
  </View>
  );
};

export default SportsDesignPreviewView;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.authPrimary },
  scrollContent: { flexGrow: 1, backgroundColor: theme.colors.authPrimary },
  hero: { backgroundColor: theme.colors.authPrimary },
  safeHeader: { zIndex: 2 },
  header: { minHeight: 72, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: theme.layout.screenGutter },
  wordmark: { color: theme.colors.black, letterSpacing: -0.8 },
  conceptLabel: { color: theme.colors.textMuted, letterSpacing: 1.4 },
  closeButton: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.black },
  heroContent: { gap: theme.layout.elementGap, paddingHorizontal: theme.layout.screenGutter, paddingTop: theme.spacing.xxl, paddingBottom: theme.spacing.xl },
  liveTag: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  liveDot: { width: 7, height: 7, borderRadius: theme.radius.pill, backgroundColor: theme.colors.accent },
  liveTagText: { color: theme.colors.black, letterSpacing: 1 },
  heroTitle: { maxWidth: 350, color: theme.colors.black, fontSize: 52, lineHeight: 52, letterSpacing: -2.2 },
  heroTitleCompact: { fontSize: 46, lineHeight: 47, letterSpacing: -1.8 },
  heroMessage: { maxWidth: 310, color: theme.colors.surfaceMuted },
  heroMedia: { height: 286, overflow: "hidden", marginTop: theme.spacing.xs, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.authSurface },
  mediaCopy: { position: "absolute", right: theme.spacing.lg, bottom: theme.spacing.lg, left: theme.spacing.lg, gap: theme.spacing.xxs },
  mediaLabel: { color: theme.colors.textOnMediaSecondary, letterSpacing: 1 },
  mediaTime: { color: theme.colors.white },
  primaryAction: { minHeight: 72, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: theme.spacing.xs, paddingLeft: theme.spacing.xl, paddingRight: theme.spacing.sm, borderRadius: theme.radius.extraLarge, borderCurve: "continuous", backgroundColor: theme.colors.black },
  primaryActionText: { color: theme.colors.white, letterSpacing: 0.3 },
  primaryActionIcon: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.authSurface },
  pressed: { opacity: 0.8 },
  nextMatch: { gap: theme.layout.groupGap, paddingHorizontal: theme.layout.screenGutter, paddingTop: theme.spacing.xxl, paddingBottom: theme.spacing.xxxl, backgroundColor: theme.colors.authPrimary },
  sectionHeader: { gap: theme.spacing.xs },
  sectionEyebrow: { color: theme.colors.black, letterSpacing: 1.4, opacity: 0.58 },
  sectionTitle: { maxWidth: 320, color: theme.colors.black },
  matchCard: { minHeight: 148, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, padding: theme.spacing.lg, borderRadius: theme.radius.card, borderCurve: "continuous", backgroundColor: theme.colors.black },
  cardPressed: { opacity: 0.84 },
  matchTime: { alignSelf: "stretch", justifyContent: "center", gap: theme.spacing.xxs },
  matchTimeValue: { color: theme.colors.white },
  matchTimeLabel: { color: theme.colors.authTextSecondary, letterSpacing: 1 },
  matchCopy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  matchStatus: { color: theme.colors.accent, letterSpacing: 0.8 },
  matchTitle: { color: theme.colors.white },
  locationRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xxs },
  matchMeta: { color: theme.colors.authTextSecondary },
  matchArrow: { width: 48, height: 48, flexShrink: 0, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.authSurface },
  secondaryAction: { minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: theme.spacing.xs },
  secondaryActionPressed: { opacity: 0.56 },
  secondaryActionText: { color: theme.colors.black },
});
