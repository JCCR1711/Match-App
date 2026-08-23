import AppTextField from "@/src/components/ui/AppTextField";
import CustomText from "@/src/components/ui/CustomText";
import SportsAvatar from "@/src/components/ui/SportsAvatar";
import type { ReservationCustomer } from "@/src/features/reservations/types/reservation";
import { theme } from "@/src/theme";
import { memo, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface ReservationCustomerPickerProps {
  customers: readonly ReservationCustomer[];
  query: string;
  selectedCustomerId: string | null;
  onChangeQuery: (query: string) => void;
  onSelect: (customer: ReservationCustomer) => void;
}

const ReservationCustomerPicker = ({ customers, query, selectedCustomerId, onChangeQuery, onSelect }: ReservationCustomerPickerProps) => {
  const normalizedQuery = query.trim().toLocaleLowerCase("es-PE");
  const results = useMemo(
    () => customers.filter((customer) => !normalizedQuery || `${customer.displayName} ${customer.email}`.toLocaleLowerCase("es-PE").includes(normalizedQuery)).slice(0, 5),
    [customers, normalizedQuery],
  );

  return (
    <View style={styles.container}>
      <AppTextField
        label="Jugador"
        value={query}
        onChangeText={onChangeQuery}
        placeholder="Buscar por nombre o correo"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Buscar jugador"
      />
      <View style={styles.results}>
        {results.map((customer) => {
          const selected = customer.id === selectedCustomerId;
          return (
            <Pressable
              key={customer.id}
              onPress={() => onSelect(customer)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Seleccionar a ${customer.displayName}`}
              style={({ pressed }) => [styles.customer, selected && styles.customerSelected, pressed && styles.pressed]}
            >
              <SportsAvatar seed={customer.id} size={44} />
              <View style={styles.customerCopy}>
                <CustomText text={customer.displayName} variant="bodyStrong" style={styles.customerName} numberOfLines={1} />
                <CustomText text={customer.email} variant="caption" style={styles.customerEmail} numberOfLines={1} />
              </View>
              <View style={[styles.selectionMark, selected && styles.selectionMarkSelected]} />
            </Pressable>
          );
        })}
        {results.length === 0 ? <CustomText text="No encontramos jugadores." variant="caption" style={styles.empty} /> : null}
      </View>
    </View>
  );
};

export default memo(ReservationCustomerPicker);

const styles = StyleSheet.create({
  container: { gap: theme.spacing.md },
  results: { gap: theme.spacing.xs },
  customer: { minHeight: 60, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, paddingHorizontal: theme.spacing.sm, borderRadius: theme.radius.extraLarge },
  customerSelected: { backgroundColor: theme.colors.surface },
  customerCopy: { flex: 1, minWidth: 0 },
  customerName: { color: theme.colors.white },
  customerEmail: { color: theme.colors.textOnDarkSecondary },
  selectionMark: { width: 10, height: 10, borderRadius: 100, backgroundColor: theme.colors.surfaceMuted },
  selectionMarkSelected: { backgroundColor: theme.colors.accent },
  empty: { paddingVertical: theme.spacing.md, color: theme.colors.textOnDarkSecondary },
  pressed: { opacity: 0.72 },
});
