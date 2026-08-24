import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import MatchMapPin from "@/src/features/venues/components/MatchMapPin";
import type { VenueLocationMapPickerProps } from "@/src/features/venues/components/VenueLocationMapPicker.types";
import { searchVenueLocation, searchVenueLocations, type DetectedVenueLocation } from "@/src/features/venues/services/detectVenueLocation";
import { theme } from "@/src/theme";
import { ArrowDown01Icon, Cancel01Icon, PinLocation03Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Keyboard, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAP_LINES = [18, 36, 54, 72, 88];

const LocationCanvas = ({ selected = false }: { selected?: boolean }) => (
  <View style={styles.canvas} pointerEvents="none">
    <LinearGradient
      colors={[theme.colors.businessBlueSurface, theme.colors.backgroundAlt, theme.colors.appCanvas]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    {MAP_LINES.map((position) => <View key={`horizontal-${position}`} style={[styles.horizontalLine, { top: `${position}%` }]} />)}
    {MAP_LINES.map((position) => <View key={`vertical-${position}`} style={[styles.verticalLine, { left: `${position}%` }]} />)}
    <View style={styles.route} />
    <View style={styles.pin}>
      <MatchMapPin size={selected ? 50 : 44} color={theme.colors.white} />
    </View>
  </View>
);

const VenueLocationMapPicker = ({ coordinates, address, district, city, disabled = false, onSelect }: VenueLocationMapPickerProps) => {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<DetectedVenueLocation[]>([]);
  const [selection, setSelection] = useState<DetectedVenueLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchRequest = useRef(0);

  useEffect(() => {
    if (!visible) return;
    setSelection(coordinates ? { coordinates, address, district, city } : null);
    setQuery("");
    setSearchResults([]);
    setError(null);
  }, [address, city, coordinates, district, visible]);

  useEffect(() => {
    if (!visible || query.trim().length < 3) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    const requestId = ++searchRequest.current;
    setSearching(true);
    setError(null);
    const timeout = setTimeout(() => {
      void searchVenueLocations(query).then((results) => {
        if (requestId === searchRequest.current) setSearchResults(results);
      }).catch((searchError) => {
        if (requestId === searchRequest.current) setError(searchError instanceof Error ? searchError.message : "No pudimos buscar esta dirección.");
      }).finally(() => {
        if (requestId === searchRequest.current) setSearching(false);
      });
    }, 550);

    return () => clearTimeout(timeout);
  }, [query, visible]);

  const search = async () => {
    if (query.trim().length < 3 || searching) return;
    Keyboard.dismiss();
    setSearching(true);
    setError(null);
    try {
      const location = await searchVenueLocation(query);
      setSelection(location);
      setSearchResults([]);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "No pudimos buscar esta dirección.");
    } finally {
      setSearching(false);
    }
  };

  const selectResult = (location: DetectedVenueLocation) => {
    Keyboard.dismiss();
    setSelection(location);
    setQuery(location.address);
    setSearchResults([]);
    setError(null);
  };

  const confirm = () => {
    if (!selection) return;
    onSelect(selection);
    setVisible(false);
  };

  const clearSearch = () => {
    setQuery("");
    setSearchResults([]);
    setError(null);
  };

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={coordinates ? "Cambiar ubicación" : "Seleccionar ubicación"}
        style={({ pressed }) => [styles.preview, disabled && styles.disabled, pressed && styles.pressed]}
      >
        <LocationCanvas selected={Boolean(coordinates)} />
        <LinearGradient colors={["transparent", theme.colors.mediaScrimStrong]} locations={[0, 1]} pointerEvents="none" style={styles.previewShade} />
        <View pointerEvents="none" style={styles.previewCopy}>
          <CustomText text={coordinates ? address || district || "Ubicación seleccionada" : "Seleccionar ubicación"} variant="bodyStrong" style={styles.previewTitle} numberOfLines={2} />
          <CustomText text="Buscar en la versión web" variant="caption" style={styles.previewMeta} />
        </View>
      </Pressable>

      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setVisible(false)}>
        <View style={[styles.fullScreen, { paddingTop: Math.max(insets.top, theme.spacing.lg) }]}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Pressable onPress={() => setVisible(false)} accessibilityRole="button" accessibilityLabel="Cerrar selector de ubicación" style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}>
                <CustomIcon icon={ArrowDown01Icon} color={theme.colors.white} size={26} strokeWidth={3} />
              </Pressable>
              <CustomText text="Ubicación" variant="bodyStrong" style={styles.headerTitle} />
              <View style={styles.headerSpacer} />
            </View>

            <View style={styles.searchArea}>
              <View style={styles.searchBar}>
                <CustomIcon icon={Search01Icon} color={theme.colors.authTextSecondary} size={24} strokeWidth={3} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  onSubmitEditing={() => void search()}
                  placeholder="Busca una dirección o lugar"
                  placeholderTextColor={theme.colors.authTextSecondary}
                  selectionColor={theme.colors.authBlue}
                  returnKeyType="search"
                  autoCorrect={false}
                  accessibilityLabel="Buscar dirección"
                  style={styles.searchInput}
                />
                {searching ? <ActivityIndicator color={theme.colors.authTextSecondary} size="small" /> : null}
                {!searching && query.length > 0 ? (
                  <Pressable onPress={clearSearch} accessibilityRole="button" accessibilityLabel="Limpiar búsqueda" hitSlop={8} style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}>
                    <CustomIcon icon={Cancel01Icon} color={theme.colors.authTextSecondary} size={21} strokeWidth={2.4} />
                  </Pressable>
                ) : null}
              </View>

              {searchResults.length > 0 ? (
                <View style={styles.results}>
                  {searchResults.map((result) => (
                    <Pressable key={`${result.coordinates.latitude}-${result.coordinates.longitude}`} onPress={() => selectResult(result)} accessibilityRole="button" accessibilityLabel={`Seleccionar ${[result.address, result.district, result.city].filter(Boolean).join(", ")}`} style={({ pressed }) => [styles.result, pressed && styles.pressed]}>
                      <CustomIcon icon={PinLocation03Icon} color={theme.colors.authTextSecondary} size={22} strokeWidth={2.5} />
                      <View style={styles.resultCopy}>
                        <CustomText text={result.address || "Ubicación encontrada"} variant="bodyStrong" style={styles.resultTitle} numberOfLines={1} />
                        <CustomText text={[result.district, result.city].filter(Boolean).join(", ")} variant="caption" style={styles.resultMeta} numberOfLines={1} />
                      </View>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>

            <View style={styles.mapFallback}>
              <LocationCanvas selected={Boolean(selection)} />
            </View>

            <View style={styles.details}>
              <CustomText text={selection?.address || "Busca una dirección para seleccionarla"} variant="bodyStrong" style={styles.address} numberOfLines={2} />
              {selection ? (
                <>
                  <CustomText text={[selection.district, selection.city].filter(Boolean).join(", ") || "Zona por completar"} variant="body" style={styles.zone} numberOfLines={1} />
                  <CustomText text={`${selection.coordinates.latitude.toFixed(5)}, ${selection.coordinates.longitude.toFixed(5)}`} variant="caption" style={styles.coordinates} numberOfLines={1} />
                </>
              ) : null}
              {error ? <CustomText text={error} variant="caption" style={styles.error} accessibilityRole="alert" /> : null}
              <CustomButton label="Usar esta ubicación" variant="primary" onPress={confirm} disabled={!selection || searching} style={styles.confirmButton} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default VenueLocationMapPicker;

const styles = StyleSheet.create({
  preview: { height: 230, overflow: "hidden", borderRadius: theme.radius.extraLarge, backgroundColor: theme.colors.authSurface },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.78 },
  canvas: { flex: 1, minHeight: 180, overflow: "hidden", backgroundColor: theme.colors.backgroundAlt },
  horizontalLine: { position: "absolute", right: 0, left: 0, height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.controlBorderOnDark, transform: [{ rotate: "-5deg" }] },
  verticalLine: { position: "absolute", top: 0, bottom: 0, width: StyleSheet.hairlineWidth, backgroundColor: theme.colors.controlBorderOnDark, transform: [{ rotate: "8deg" }] },
  route: { position: "absolute", top: "52%", left: "18%", width: "64%", height: 3, borderRadius: theme.radius.pill, backgroundColor: theme.colors.accent, transform: [{ rotate: "-12deg" }] },
  pin: { position: "absolute", top: "36%", left: "50%", marginLeft: -25 },
  previewShade: { position: "absolute", right: 0, bottom: 0, left: 0, height: 124 },
  previewCopy: { position: "absolute", right: theme.spacing.xl, bottom: theme.spacing.xl, left: theme.spacing.xl, gap: theme.spacing.xxs },
  previewTitle: { color: theme.colors.white, lineHeight: 22 },
  previewMeta: { color: theme.colors.textOnMediaSecondary },
  fullScreen: { flex: 1, backgroundColor: theme.colors.appCanvas },
  modalContent: { flex: 1, width: "100%", maxWidth: 820, alignSelf: "center", paddingHorizontal: theme.layout.screenGutter, paddingBottom: theme.spacing.xl, gap: theme.spacing.lg },
  header: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  closeButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.surfaceOnDarkSubtle },
  headerTitle: { color: theme.colors.white },
  headerSpacer: { width: 44, height: 44 },
  searchArea: { zIndex: 2 },
  searchBar: { height: 58, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, borderRadius: theme.radius.pill, backgroundColor: theme.colors.authSurface },
  searchInput: { flex: 1, minWidth: 0, height: 58, paddingVertical: 0, color: theme.colors.white, fontFamily: theme.fontFamilies.outfitSemiBold, fontSize: theme.fontSizes.body, lineHeight: 20, fontWeight: theme.fontWeights.semibold },
  clearButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  results: { position: "absolute", top: 64, right: 0, left: 0, overflow: "hidden", borderRadius: theme.radius.extraLarge, backgroundColor: theme.colors.backgroundAlt, ...theme.shadows.medium },
  result: { minHeight: 68, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.separatorOnDark },
  resultCopy: { flex: 1, minWidth: 0 },
  resultTitle: { color: theme.colors.white },
  resultMeta: { color: theme.colors.authTextSecondary },
  mapFallback: { flex: 1, minHeight: 220, overflow: "hidden", borderRadius: theme.radius.extraLarge, backgroundColor: theme.colors.authSurface },
  details: { gap: theme.spacing.sm, padding: theme.spacing.xl, borderRadius: theme.radius.extraLarge, backgroundColor: theme.colors.backgroundAlt },
  address: { color: theme.colors.white, textAlign: "center" },
  zone: { color: theme.colors.textOnDarkSecondary, textAlign: "center" },
  coordinates: { color: theme.colors.authTextSecondary, textAlign: "center" },
  error: { color: theme.colors.error, textAlign: "center" },
  confirmButton: { minHeight: 56, marginTop: theme.spacing.sm, borderRadius: theme.radius.pill },
});
