import AppCardArrow from "@/src/components/ui/AppCardArrow";
import CustomText from "@/src/components/ui/CustomText";
import SettlementGradientSurface from "@/src/features/payments/components/SettlementGradientSurface";
import type { Settlement } from "@/src/features/payments/types/businessPayments";
import { formatSettlementAccount } from "@/src/features/payments/utils/formatSettlementAccount";
import { theme } from "@/src/theme";
import { formatSoles } from "@/src/utils/formatMoney";
import { Pressable, StyleSheet, View } from "react-native";

const SettlementSummaryLink = ({ settlement, onPress }: { settlement: Settlement; onPress: () => void }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`Ver próxima liquidación de ${formatSoles(settlement.amount)}`}
    onPress={onPress}
    style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
  >
    <SettlementGradientSurface style={styles.container}>
      <CustomText text="Próxima liquidación" variant="caption" style={styles.label} />

      <CustomText text={formatSoles(settlement.amount)} variant="heading" style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78} />

      <View style={styles.footer}>
        <CustomText
          text={formatSettlementAccount(settlement.accountLastDigits)}
          accessibilityLabel={`Cuenta terminada en ${settlement.accountLastDigits}`}
          variant="caption"
          style={styles.detail}
          numberOfLines={1}
        />
        <AppCardArrow backgroundColor={theme.colors.authPrimary} color={theme.colors.black} style={styles.arrow} />
      </View>
    </SettlementGradientSurface>
  </Pressable>
);

export default SettlementSummaryLink;

const styles = StyleSheet.create({
  pressable: { minHeight: 160, overflow: "hidden", borderRadius: theme.radius.card, borderCurve: "continuous" },
  container: { minHeight: 160, justifyContent: "space-between", gap: theme.spacing.sm, padding: theme.spacing.lg },
  label: { color: theme.colors.textOnDarkSecondary },
  value: { color: theme.colors.white },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  detail: { flex: 1, minWidth: 0, color: theme.colors.iceBlue },
  arrow: { width: 44, height: 44 },
  pressed: { opacity: 0.78 },
});
