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
  const normalizedUsernameQuery = normalizedQuery.startsWith("@") ? normalizedQuery.slice(1) : normalizedQuery;
  const results = useMemo(
    () => customers.filter((customer) => {
      if (!normalizedQuery) return true;

      const normalizedName = customer.displayName.toLocaleLowerCase("es-PE");
      const normalizedEmail = customer.email.toLocaleLowerCase("es-PE");
      const normalizedUsername = customer.username.toLocaleLowerCase("es-PE");

      return normalizedName.includes(normalizedQuery)
        || normalizedUsername.startsWith(normalizedUsernameQuery)
        || normalizedEmail === normalizedQuery;
    }).slice(0, 5),
    [customers, normalizedQuery, normalizedUsernameQuery],
  );

  return (
    <View style={styles.container}>
      <AppTextField
        label="Jugador"
        value={query}
        onChangeText={onChangeQuery}
        placeholder="Buscar por nombre o @usuario"
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
              accessibilityLabel={`Seleccionar a ${customer.displayName}, arroba ${customer.username}`}
              style={({ pressed }) => [styles.customer, selected && styles.customerSelected, pressed && styles.pressed]}
            >
              <SportsAvatar seed={customer.id} size={44} />
              <View style={styles.customerCopy}>
                <CustomText text={customer.displayName} variant="bodyStrong" style={styles.customerName} numberOfLines={1} ellipsizeMode="tail" />
                <CustomText text={`@${customer.username}`} variant="caption" style={styles.username} numberOfLines={1} ellipsizeMode="tail" />
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
  results: { gap: theme.spacing.sm },
  customer: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderRadius: theme.radius.extraLarge },
  customerSelected: { backgroundColor: theme.colors.businessBlueSurface },
  customerCopy: { flex: 1, minWidth: 0 },
  customerName: { color: theme.colors.white },
  username: { color: theme.colors.textOnDarkSecondary },
  selectionMark: { width: 10, height: 10, borderRadius: 100, backgroundColor: theme.colors.surfaceMuted },
  selectionMarkSelected: { backgroundColor: theme.colors.electricBlue },
  empty: { paddingVertical: theme.spacing.md, color: theme.colors.textOnDarkSecondary },
  pressed: { opacity: 0.72 },
});
