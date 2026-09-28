import AppBottomSheet from "@/src/components/ui/AppBottomSheet";
import AppSurface from "@/src/components/ui/AppSurface";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import FinancialPremiumSurface from "@/src/features/payments/components/FinancialPremiumSurface";
import { financialInstitutions, getFinancialInstitution } from "@/src/features/payments/data/financialInstitutions";
import { theme } from "@/src/theme";
import { ArrowDown01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { memo, useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface FinancialInstitutionSelectorProps {
  value: string;
  disabled?: boolean;
  onChange: (institutionId: string) => void;
}

const FinancialInstitutionSelector = ({ value, disabled, onChange }: FinancialInstitutionSelectorProps) => {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const selected = getFinancialInstitution(value);
  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es-PE");
    if (!normalizedQuery) return financialInstitutions;
    return financialInstitutions.filter((institution) =>
      institution.shortName.toLocaleLowerCase("es-PE").includes(normalizedQuery)
      || institution.displayName.toLocaleLowerCase("es-PE").includes(normalizedQuery)
    );
  }, [query]);

  const close = () => {
    setVisible(false);
    setQuery("");
  };

  return (
    <View style={styles.group}>
      <CustomText text="Banco" variant="body" style={styles.label} />
      <AppSurface
        variant="transparent"
        disabled={disabled}
        onPress={() => setVisible(true)}
        accessibilityLabel={`Cambiar banco. Seleccionado: ${selected?.shortName ?? "ninguno"}`}
        style={styles.trigger}
      >
        <FinancialPremiumSurface tone="secondary" style={styles.triggerCard}>
          <View style={styles.triggerCopy}>
            <CustomText text={selected?.shortName ?? "Selecciona un banco"} variant="subtitle" style={styles.triggerTitle} numberOfLines={1} />
            {selected ? <CustomText text={selected.displayName} variant="caption" style={styles.triggerDetail} numberOfLines={1} /> : null}
          </View>
          <View style={styles.triggerAction}>
            <CustomIcon icon={ArrowDown01Icon} color={theme.colors.black} size={21} strokeWidth={2.5} />
          </View>
        </FinancialPremiumSurface>
      </AppSurface>

      <AppBottomSheet visible={visible} title="Selecciona un banco" expandable collapsedHeight={680} onClose={close}>
        <View style={styles.search}>
          <CustomIcon icon={Search01Icon} color={theme.colors.authTextSecondary} size={22} strokeWidth={2.5} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar banco"
            placeholderTextColor={theme.colors.authTextSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.searchInput}
          />
        </View>
        <View style={styles.list} accessibilityRole="radiogroup">
          {results.map((institution) => {
            const isSelected = institution.id === value;
            return (
              <Pressable
                key={institution.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                onPress={() => {
                  onChange(institution.id);
                  close();
                }}
                style={({ pressed }) => [styles.option, isSelected && styles.optionSelected, pressed && styles.pressed]}
              >
                <View style={styles.optionCopy}>
                  <CustomText text={institution.shortName} variant="bodyStrong" style={[styles.optionTitle, isSelected && styles.optionTitleSelected]} numberOfLines={1} />
                  {institution.displayName !== institution.shortName ? (
                    <CustomText text={institution.displayName} variant="caption" style={[styles.optionDetail, isSelected && styles.optionDetailSelected]} numberOfLines={1} />
                  ) : null}
                </View>
                {isSelected ? <CustomText text="Actual" variant="caption" style={styles.current} /> : null}
              </Pressable>
            );
          })}
          {results.length === 0 ? <CustomText text="No encontramos ese banco" variant="body" style={styles.empty} /> : null}
        </View>
      </AppBottomSheet>
    </View>
  );
};

export default memo(FinancialInstitutionSelector);

const styles = StyleSheet.create({
  group: { gap: theme.spacing.sm },
  label: { color: theme.colors.textOnDarkSecondary },
  trigger: { minHeight: 92, borderRadius: theme.radius.card, borderCurve: "continuous" },
  triggerCard: { minHeight: 92, flexDirection: "row", alignItems: "center", gap: theme.spacing.lg, paddingHorizontal: theme.spacing.lg },
  triggerCopy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  triggerTitle: { color: theme.colors.white },
  triggerDetail: { color: theme.colors.authTextSecondary },
  triggerAction: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.authPrimary },
  search: { height: 58, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, paddingHorizontal: theme.spacing.lg, borderRadius: theme.radius.extraLarge, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.controlBorderOnDark, backgroundColor: theme.colors.controlSurfaceOnDark },
  searchInput: { flex: 1, height: 54, color: theme.colors.white, fontFamily: theme.fontFamilies.outfitSemiBold, fontSize: theme.fontSizes.body },
  list: { gap: theme.spacing.xs, paddingBottom: theme.spacing.huge },
  option: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm, borderRadius: theme.radius.extraLarge },
  optionSelected: { backgroundColor: theme.colors.businessBlueSurface },
  optionCopy: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  optionTitle: { color: theme.colors.white },
  optionTitleSelected: { color: theme.colors.white },
  optionDetail: { color: theme.colors.authTextSecondary },
  optionDetailSelected: { color: theme.colors.textOnDarkSecondary },
  current: { flexShrink: 0, color: theme.colors.white },
  pressed: { opacity: 0.72 },
  empty: { paddingVertical: theme.spacing.xl, color: theme.colors.authTextSecondary, textAlign: "center" },
});
