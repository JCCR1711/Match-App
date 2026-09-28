import AppScreenLayout from "@/src/components/ui/AppScreenLayout";
import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import BusinessProEmblem from "@/src/features/subscriptions/components/BusinessProEmblem";
import { useBusinessSubscription } from "@/src/features/subscriptions/hooks/useBusinessSubscription";
import { useBusinessDraft } from "@/src/features/venues/hooks/useBusinessDraft";
import useAppToast from "@/src/hooks/useAppToast";
import { theme } from "@/src/theme";
import { backOrReplace } from "@/src/utils/routerNavigation";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

const BusinessPlanView = () => {
  const { draft } = useBusinessDraft();
  const { showToast } = useAppToast();
  const { subscription, access } = useBusinessSubscription(draft?.organizationId);
  const isOwner = draft?.membership.role === "owner";
  const isPro = access.effectivePlan === "pro";
  const closePlan = () => backOrReplace("/(tabs)/business-profile");

  const handlePlanAction = () => {
    if (isPro) {
      closePlan();
      return;
    }
    showToast({ message: isOwner ? "Te avisaremos cuando la activación de Match Pro esté disponible." : "El propietario del negocio puede activar Match Pro.", tone: "success" });
  };

  return (
    <AppScreenLayout
      title="Match Pro"
      headerTitleAlign="center"
      headerTitleSize="compact"
      backIconVariant="back"
      backAccessibilityLabel="Volver"
      backgroundVariant="premium"
      contentStyle={styles.screenContent}
      onBack={closePlan}
    >
      <View style={styles.hero}>
        <BusinessProEmblem style={styles.emblem} />
        <View style={styles.heroCopy}>
          <CustomText text={isPro ? "Tu negocio es Pro" : "Impulsa tu negocio"} variant="heading" style={styles.heroTitle} />
          <CustomText text={isPro ? "Tu equipo y herramientas avanzadas están activos." : "Más equipo, más sedes y mejores decisiones."} variant="caption" style={styles.heroMessage} />
        </View>
      </View>

      <LinearGradient
        colors={[theme.colors.premiumPlanBright, theme.colors.electricBlue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.offer}
      >
        <View style={styles.offerCopy}>
          <View style={styles.offerHeader}>
            <CustomText text="Mensual" variant="bodyStrong" style={styles.offerTitle} />
            <View style={styles.savingsBadge}>
              <CustomText text={isPro ? "Activo" : "Ahorra 50%"} variant="label" style={styles.savingsLabel} />
            </View>
          </View>
          <View style={styles.priceLine}>
            <CustomText text="S/ 19.90" variant="caption" style={styles.regularPrice} />
            <CustomText text="S/ 9.90" variant="sectionHeading" style={styles.price} />
            <CustomText text="/ mes" variant="caption" style={styles.pricePeriod} />
          </View>
        </View>
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.selectedMark}>
          <CustomIcon icon={Tick02Icon} color={theme.colors.premiumPlanBright} size={17} strokeWidth={3} />
        </View>
      </LinearGradient>

      <View style={styles.features}>
        <CustomText text="Todo lo que incluye" variant="subtitle" style={styles.featuresTitle} />
        <View style={styles.featureList}>
          {proFeatures.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <CustomIcon icon={Tick02Icon} color={theme.colors.white} size={20} strokeWidth={3} />
              <CustomText text={feature} variant="body" style={styles.featureText} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footerCopy}>
        <CustomText text={isOwner ? "Tú controlas el plan del negocio." : "Solo el propietario puede cambiar el plan."} variant="caption" style={styles.ownerNote} />
        <CustomButton label={isPro ? "Continuar" : isOwner ? "Quiero Match Pro" : "Solicitar al propietario"} variant="light" onPress={handlePlanAction} style={styles.action} />
      </View>

      {subscription.status === "past_due" ? <CustomText text="Hay un pago pendiente en la suscripción." variant="caption" style={styles.status} /> : null}
    </AppScreenLayout>
  );
};

const proFeatures = [
  "Más sedes y canchas",
  "Equipo y permisos",
  "Analítica de hasta 12 meses",
  "Reportes y automatizaciones",
] as const;

export default BusinessPlanView;

const styles = StyleSheet.create({
  screenContent: { gap: theme.spacing.xxxl },
  hero: { alignItems: "center", gap: theme.layout.groupGap },
  emblem: { width: "100%", maxWidth: 260, height: 190 },
  heroCopy: { alignItems: "center", gap: theme.layout.microGap },
  heroTitle: { maxWidth: 330, color: theme.colors.white, textAlign: "center" },
  heroMessage: { maxWidth: 330, color: theme.colors.textOnDarkSecondary, textAlign: "center" },
  offer: {
    minHeight: 112,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.layout.elementGap,
    paddingHorizontal: theme.layout.cardPadding,
    paddingVertical: theme.layout.elementGap,
    borderRadius: theme.radius.extraLarge,
    borderCurve: "continuous",
  },
  offerHeader: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  offerTitle: { color: theme.colors.white },
  offerCopy: { flex: 1, minWidth: 0, gap: theme.layout.microGap },
  savingsBadge: { paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xxs, borderRadius: theme.radius.pill, backgroundColor: theme.colors.warmYellow },
  savingsLabel: { color: theme.colors.black },
  priceLine: { flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xs },
  regularPrice: { color: theme.colors.white, opacity: 0.56, textDecorationLine: "line-through" },
  price: { color: theme.colors.white },
  pricePeriod: { color: theme.colors.white, opacity: 0.78 },
  selectedMark: { width: 30, height: 30, flexShrink: 0, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.white },
  features: { gap: theme.layout.groupGap },
  featuresTitle: { color: theme.colors.white },
  featureList: { gap: theme.layout.elementGap },
  featureRow: { minHeight: 28, flexDirection: "row", alignItems: "center", gap: theme.layout.elementGap },
  featureText: { flex: 1, color: theme.colors.white },
  footerCopy: { gap: theme.layout.elementGap },
  ownerNote: { color: theme.colors.textOnDarkSecondary, textAlign: "center" },
  action: { width: "100%", borderRadius: theme.radius.pill },
  status: { color: theme.colors.errorSoft, textAlign: "center" },
});
