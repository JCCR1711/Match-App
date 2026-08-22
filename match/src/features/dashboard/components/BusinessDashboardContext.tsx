import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";

interface BusinessDashboardContextProps {
  venueName?: string;
}

const formatToday = () =>
  new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

const BusinessDashboardContext = ({ venueName }: BusinessDashboardContextProps) => (
  <View style={styles.container}>
    <CustomText text={formatToday()} variant="caption" style={styles.date} />
    {venueName ? <CustomText text={venueName} variant="caption" style={styles.venue} numberOfLines={1} /> : null}
  </View>
);

export default BusinessDashboardContext;

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md },
  date: { flex: 1, color: theme.colors.authTextSecondary, textTransform: "capitalize" },
  venue: { maxWidth: "46%", color: theme.colors.textOnDarkSecondary, textAlign: "right" },
});
