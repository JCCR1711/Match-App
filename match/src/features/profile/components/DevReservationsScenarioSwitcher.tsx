import AppChoiceGroup, {
  type AppChoiceOption,
} from "@/src/components/ui/AppChoiceGroup";
import CustomText from "@/src/components/ui/CustomText";
import type { DevReservationsApiScenario } from "@/src/features/reservations/services/ReservationsGateway";
import { theme } from "@/src/theme";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

interface DevReservationsScenarioSwitcherProps {
  value: DevReservationsApiScenario;
  disabled?: boolean;
  onChange: (scenario: DevReservationsApiScenario) => void;
}

const options: readonly AppChoiceOption<DevReservationsApiScenario>[] = [
  { value: "normal", label: "Normal" },
  { value: "slow", label: "Carga lenta" },
  { value: "empty", label: "Agenda vacía" },
  { value: "offline", label: "Sin conexión" },
  { value: "server-error", label: "Error 500" },
  { value: "conflict", label: "Conflicto 409" },
  { value: "unauthorized", label: "Sesión 401" },
];

const DevReservationsScenarioSwitcher = ({
  value,
  disabled,
  onChange,
}: DevReservationsScenarioSwitcherProps) => (
  <View style={styles.section}>
    <View style={styles.heading}>
      <CustomText text="API de reservas" variant="body" style={styles.title} />
      <CustomText text="Solo desarrollo" variant="caption" style={styles.devLabel} />
    </View>
    <AppChoiceGroup
      options={options}
      value={value}
      tone="neutral"
      layout="flow"
      disabled={disabled}
      onChange={onChange}
    />
  </View>
);

export default memo(DevReservationsScenarioSwitcher);

const styles = StyleSheet.create({
  section: { gap: theme.spacing.md },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  title: {
    color: theme.colors.white,
    fontSize: 19,
    lineHeight: 26,
    fontFamily: theme.fontFamilies.poppinsBold,
  },
  devLabel: { color: theme.colors.authTextSecondary },
});
