import CustomButton from "@/src/components/ui/CustomButton";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import type { VenueLocationMapPickerProps } from "@/src/features/venues/components/VenueLocationMapPicker.types";
import MatchMapPin from "@/src/features/venues/components/MatchMapPin";
import { resolveVenueCoordinates, searchVenueLocation, searchVenueLocations, type DetectedVenueLocation } from "@/src/features/venues/services/detectVenueLocation";
import type { VenueCoordinates } from "@/src/features/venues/types/businessOnboarding";
import useDeviceLocation from "@/src/hooks/useDeviceLocation";
import { theme } from "@/src/theme";
import { calculateDistanceKm } from "@/src/utils/location";
import { ArrowDown01Icon, Cancel01Icon, Gps01Icon, PinLocation03Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Keyboard, Modal, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import MapView, { Marker, type MapPressEvent, type MapStyleElement } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LIMA_CENTER: VenueCoordinates = { latitude: -12.0464, longitude: -77.0428 };
const REGION_DELTA = { latitudeDelta: 0.006, longitudeDelta: 0.006 };
const MATCH_MAP_STYLE: MapStyleElement[] = [
  { elementType: "geometry", stylers: [{ color: theme.colors.backgroundAlt }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: theme.colors.authTextSecondary }] },
  { elementType: "labels.text.stroke", stylers: [{ color: theme.colors.backgroundAlt }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: theme.colors.surfaceMuted }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: theme.colors.surface }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: theme.colors.reservedSurface }] },
];

const MatchLocationMarker = () => (
  <View style={styles.markerGlyph}>
    <MatchMapPin />
  </View>
);

const VenueLocationMapPicker = ({ coordinates, address, district, city, disabled = false, onSelect }: VenueLocationMapPickerProps) => {
  const insets = useSafeAreaInsets();
  const { coordinates: deviceCoordinates, permission, requestCurrentLocation, refreshLocation } = useDeviceLocation();
  const [visible, setVisible] = useState(false);
  const [candidate, setCandidate] = useState<VenueCoordinates>(coordinates ?? deviceCoordinates ?? LIMA_CENTER);
  const [resolvedLocation, setResolvedLocation] = useState<DetectedVenueLocation | null>(null);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [locatingDevice, setLocatingDevice] = useState(false);
  const [searchResults, setSearchResults] = useState<DetectedVenueLocation[]>([]);
  const [panelHeight, setPanelHeight] = useState(228);
  const mapRef = useRef<MapView>(null);
  const searchRequest = useRef(0);

  useEffect(() => {
    if (!visible) return;
    setCandidate(coordinates ?? deviceCoordinates ?? LIMA_CENTER);
    setResolvedLocation(coordinates ? { coordinates, address, district, city } : null);
    setError(null);
    setQuery("");
    setSearchResults([]);
  }, [address, city, coordinates, deviceCoordinates, district, visible]);

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

  const resolveCandidate = async (nextCoordinates: VenueCoordinates) => {
    setCandidate(nextCoordinates);
    setResolving(true);
    setError(null);
    try {
      setResolvedLocation(await resolveVenueCoordinates(nextCoordinates));
    } catch (resolveError) {
      setResolvedLocation(null);
      setError(resolveError instanceof Error ? resolveError.message : "No pudimos leer esta ubicación.");
    } finally {
      setResolving(false);
    }
  };

  const centerMapOn = (nextCoordinates: VenueCoordinates) => {
    mapRef.current?.animateToRegion({ ...nextCoordinates, ...REGION_DELTA }, 420);
  };
  const selectCoordinates = (nextCoordinates: VenueCoordinates) => {
    centerMapOn(nextCoordinates);
    void resolveCandidate(nextCoordinates);
  };

  const handleMapPress = (event: MapPressEvent) => selectCoordinates(event.nativeEvent.coordinate);
  const search = async () => {
    if (query.trim().length < 3 || resolving) return;
    Keyboard.dismiss();
    setResolving(true);
    setError(null);
    try {
      const location = await searchVenueLocation(query);
      setCandidate(location.coordinates);
      setResolvedLocation(location);
      setSearchResults([]);
      centerMapOn(location.coordinates);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "No pudimos buscar esta dirección.");
    } finally {
      setResolving(false);
    }
  };
  const selectSearchResult = (location: DetectedVenueLocation) => {
    Keyboard.dismiss();
    setQuery(location.address);
    setSearchResults([]);
    setCandidate(location.coordinates);
    setResolvedLocation(location);
    setError(null);
    centerMapOn(location.coordinates);
  };
  const centerOnCurrentLocation = async () => {
    if (locatingDevice || resolving) return;
    setLocatingDevice(true);
    setError(null);
    try {
      const currentCoordinates = permission === "granted"
        ? await refreshLocation()
        : await requestCurrentLocation();
      if (!currentCoordinates) {
        setError("Activa la ubicación para centrar el mapa en tu posición.");
        return;
      }
      centerMapOn(currentCoordinates);
      await resolveCandidate(currentCoordinates);
    } finally {
      setLocatingDevice(false);
    }
  };
  const confirm = () => {
    if (!resolvedLocation) return;
    onSelect(resolvedLocation);
    setVisible(false);
  };
  const previewCoordinates = coordinates ?? deviceCoordinates ?? LIMA_CENTER;
  const panelBottom = Math.max(insets.bottom, theme.spacing.md);
  const distanceFromDevice = deviceCoordinates && resolvedLocation
    ? calculateDistanceKm(deviceCoordinates, resolvedLocation.coordinates)
    : null;
  const selectionMatchesDevice = Boolean(
    deviceCoordinates && calculateDistanceKm(deviceCoordinates, candidate) < 0.03,
  );

  return (
    <>
      <Pressable onPress={() => { setVisible(true); void requestCurrentLocation(); }} disabled={disabled} accessibilityRole="button" accessibilityLabel={coordinates ? "Cambiar ubicación en el mapa" : "Seleccionar ubicación en el mapa"} style={({ pressed }) => [styles.preview, pressed && styles.pressed]}>
        {Platform.OS === "web" ? <View style={styles.webMap} /> : (
          <View pointerEvents="none" style={styles.previewMapWrap}>
            <MapView style={styles.map} region={{ ...previewCoordinates, ...REGION_DELTA }} mapType={Platform.OS === "ios" ? "mutedStandard" : "standard"} customMapStyle={Platform.OS === "android" ? MATCH_MAP_STYLE : undefined} userInterfaceStyle="dark" toolbarEnabled={false}>
              {coordinates ? <Marker coordinate={coordinates} anchor={{ x: 0.5, y: 1 }}><MatchLocationMarker /></Marker> : null}
            </MapView>
          </View>
        )}
        <LinearGradient colors={["transparent", theme.colors.mediaScrimStrong]} locations={[0, 1]} pointerEvents="none" style={styles.previewShade} />
        <View pointerEvents="none" style={styles.previewOverlay}>
          <CustomText
            text={coordinates ? address || district || "Ubicación seleccionada" : "Seleccionar ubicación"}
            variant="bodyStrong"
            style={styles.previewTitle}
            numberOfLines={2}
          />
        </View>
      </Pressable>

      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" statusBarTranslucent navigationBarTranslucent onRequestClose={() => setVisible(false)}>
        <View style={styles.fullScreen}>
          <StatusBar style="dark" />
          {Platform.OS === "web" ? <View style={styles.webMap} /> : (
            <MapView
              ref={mapRef}
              key={`${visible}-${coordinates?.latitude ?? "new"}`}
              style={StyleSheet.absoluteFill}
              initialRegion={{ ...candidate, ...REGION_DELTA }}
              mapType={Platform.OS === "ios" ? "mutedStandard" : "standard"}
              customMapStyle={Platform.OS === "android" ? MATCH_MAP_STYLE : undefined}
              userInterfaceStyle="dark"
              onPress={handleMapPress}
              showsUserLocation={permission === "granted"}
              showsMyLocationButton={false}
              toolbarEnabled={false}
              mapPadding={{ top: insets.top + 148, right: 20, bottom: panelBottom + panelHeight + 76, left: 20 }}
            >
              {!selectionMatchesDevice ? (
                <Marker coordinate={candidate} anchor={{ x: 0.5, y: 1 }} draggable onDragEnd={(event) => selectCoordinates(event.nativeEvent.coordinate)}>
                  <MatchLocationMarker />
                </Marker>
              ) : null}
            </MapView>
          )}

          <View style={[styles.topControls, { top: insets.top + theme.spacing.sm }]} pointerEvents="box-none">
            <Pressable onPress={() => setVisible(false)} accessibilityRole="button" accessibilityLabel="Cerrar mapa" style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
              <CustomIcon icon={ArrowDown01Icon} color={theme.colors.white} size={26} strokeWidth={3} />
            </Pressable>
          </View>

          <View style={[styles.searchBar, { top: insets.top + 68 }]}>
            <CustomIcon icon={Search01Icon} color={theme.colors.authTextSecondary} size={25} strokeWidth={3} />
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
              <Pressable
                onPress={() => {
                  setQuery("");
                  setSearchResults([]);
                  setError(null);
                }}
                accessibilityRole="button"
                accessibilityLabel="Limpiar búsqueda"
                hitSlop={8}
                style={({ pressed }) => [styles.clearSearchButton, pressed && styles.pressed]}
              >
                <CustomIcon icon={Cancel01Icon} color={theme.colors.authTextSecondary} size={21} strokeWidth={2.4} />
              </Pressable>
            ) : null}
          </View>
          {searchResults.length > 0 ? (
            <View style={[styles.searchResults, { top: insets.top + 132 }]}>
              {searchResults.map((result) => (
                <Pressable key={`${result.coordinates.latitude}-${result.coordinates.longitude}`} onPress={() => selectSearchResult(result)} accessibilityRole="button" accessibilityLabel={`Seleccionar ${[result.address, result.district, result.city].filter(Boolean).join(", ")}`} style={({ pressed }) => [styles.searchResult, pressed && styles.pressed]}>
                  <CustomIcon icon={PinLocation03Icon} color={theme.colors.authTextSecondary} size={22} strokeWidth={2.5} />
                  <View style={styles.resultCopy}>
                    <CustomText text={result.address || "Ubicación encontrada"} variant="bodyStrong" style={styles.resultTitle} numberOfLines={1} />
                    <CustomText text={[result.district, result.city].filter(Boolean).join(", ")} variant="caption" style={styles.resultMeta} numberOfLines={1} />
                  </View>
                </Pressable>
              ))}
            </View>
          ) : null}

          <View pointerEvents="box-none" style={[styles.mapActionLayer, { bottom: panelBottom + panelHeight + theme.spacing.sm }]}>
            <Pressable
              onPress={() => void centerOnCurrentLocation()}
              disabled={locatingDevice || resolving}
              accessibilityRole="button"
              accessibilityLabel="Usar mi ubicación actual"
              style={({ pressed }) => [styles.currentLocationButton, pressed && styles.pressed, (locatingDevice || resolving) && styles.controlDisabled]}
            >
              <CustomIcon icon={Gps01Icon} color={theme.colors.white} size={27} strokeWidth={3} />
            </Pressable>
          </View>

          <View onLayout={(event) => setPanelHeight(event.nativeEvent.layout.height)} style={[styles.bottomPanel, { bottom: panelBottom }]}>
            <View style={styles.panelHeading}>
              <View style={styles.panelCopy}>
                <CustomText text={resolving ? "Buscando dirección..." : resolvedLocation?.address || "Selecciona un punto"} variant="bodyStrong" style={styles.address} />
                {resolvedLocation ? (
                  <CustomText
                    text={`${resolvedLocation.coordinates.latitude.toFixed(5)}, ${resolvedLocation.coordinates.longitude.toFixed(5)}`}
                    variant="caption"
                    style={styles.coordinates}
                    numberOfLines={1}
                  />
                ) : null}
              </View>
            </View>
            {resolvedLocation ? (
              <View style={styles.detailRow}>
                {distanceFromDevice !== null ? (
                  <View style={styles.detailItem}>
                    <CustomText text={distanceFromDevice < 1 ? `${Math.round(distanceFromDevice * 1000)} m` : `${distanceFromDevice.toFixed(1)} km`} variant="subtitle" style={styles.detailValue} numberOfLines={1} />
                    <CustomText text="desde ti" variant="caption" style={styles.detailLabel} numberOfLines={1} />
                  </View>
                ) : null}
                <View style={styles.detailItem}>
                  <CustomText text={[resolvedLocation.district, resolvedLocation.city].filter(Boolean).join(", ") || "Zona por completar"} variant="bodyStrong" style={styles.zoneValue} />
                  <CustomText text="zona" variant="caption" style={styles.detailLabel} numberOfLines={1} />
                </View>
              </View>
            ) : null}
            {error ? <CustomText text={error} variant="caption" style={styles.error} accessibilityRole="alert" /> : null}
            <CustomButton label="Usar esta ubicación" variant="primary" onPress={confirm} disabled={!resolvedLocation || resolving} style={styles.confirmButton} />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default VenueLocationMapPicker;

const styles = StyleSheet.create({
  preview: { height: 230, overflow: "hidden", borderRadius: theme.radius.extraLarge, backgroundColor: theme.colors.surface },
  previewMapWrap: { height: "100%" },
  map: { width: "100%", height: "100%" },
  webMap: { flex: 1, minHeight: 150, backgroundColor: theme.colors.surfaceMuted },
  previewShade: { position: "absolute", right: 0, bottom: 0, left: 0, height: 124 },
  previewOverlay: { position: "absolute", right: theme.spacing.xl, bottom: theme.spacing.xl, left: theme.spacing.xl },
  previewTitle: { color: theme.colors.white, lineHeight: 22 },
  pressed: { opacity: 0.78 },
  fullScreen: { flex: 1, backgroundColor: theme.colors.surfaceMuted },
  topControls: { position: "absolute", right: theme.layout.screenGutter, left: theme.layout.screenGutter, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  backButton: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.mediaFloatingSurface, ...theme.shadows.medium },
  searchBar: { position: "absolute", right: theme.layout.screenGutter, left: theme.layout.screenGutter, height: 60, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, borderRadius: theme.radius.pill, backgroundColor: theme.colors.backgroundAlt, ...theme.shadows.medium },
  searchInput: { flex: 1, minWidth: 0, height: 60, paddingTop: Platform.OS === "android" ? 1 : 0, paddingBottom: 0, color: theme.colors.white, textAlignVertical: "center", includeFontPadding: false, fontFamily: theme.fontFamilies.outfitSemiBold, fontSize: theme.fontSizes.body, lineHeight: 20, fontWeight: theme.fontWeights.semibold, letterSpacing: 0 },
  clearSearchButton: { width: 44, height: 44, marginRight: -theme.spacing.sm, alignItems: "center", justifyContent: "center" },
  markerGlyph: { width: 48, height: 48, alignItems: "center", justifyContent: "center", shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 5, elevation: 5 },
  bottomPanel: { position: "absolute", right: theme.spacing.md, left: theme.spacing.md, gap: theme.spacing.md, padding: theme.spacing.xl, borderRadius: theme.radius.sheet, borderCurve: "continuous", backgroundColor: theme.colors.backgroundAlt, ...theme.shadows.medium },
  panelHeading: { minHeight: 44, justifyContent: "center" },
  panelCopy: { flex: 1, minWidth: 0, alignItems: "center", gap: theme.spacing.xxs },
  address: { width: "100%", color: theme.colors.white, fontFamily: theme.fontFamilies.poppinsBold, fontSize: 16, lineHeight: 23, textAlign: "center" },
  coordinates: { width: "100%", color: theme.colors.authTextSecondary, textAlign: "center" },
  detailRow: { minHeight: 68, flexDirection: "row", alignItems: "stretch", gap: theme.spacing.xl, paddingVertical: theme.spacing.xxs },
  detailItem: { flex: 1, minWidth: 0, alignItems: "center", justifyContent: "center", gap: theme.spacing.xxs },
  detailValue: { width: "100%", color: theme.colors.white, fontSize: 28, lineHeight: 34, textAlign: "center" },
  zoneValue: { width: "100%", color: theme.colors.white, fontSize: 16, lineHeight: 21, textAlign: "center" },
  detailLabel: { width: "100%", color: theme.colors.authTextSecondary, textAlign: "center" },
  error: { color: theme.colors.error },
  searchResults: { position: "absolute", zIndex: 5, right: theme.layout.screenGutter, left: theme.layout.screenGutter, overflow: "hidden", borderRadius: theme.radius.extraLarge, backgroundColor: theme.colors.backgroundAlt, ...theme.shadows.medium },
  searchResult: { minHeight: 68, flexDirection: "row", alignItems: "center", gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.separatorOnDark },
  resultCopy: { flex: 1, minWidth: 0 },
  resultTitle: { color: theme.colors.white },
  resultMeta: { color: theme.colors.authTextSecondary },
  mapActionLayer: { position: "absolute", right: theme.layout.screenGutter, left: theme.layout.screenGutter, alignItems: "flex-end" },
  currentLocationButton: { width: 56, height: 56, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.pill, borderWidth: 2, borderColor: theme.colors.surfaceOnDarkSubtle, backgroundColor: theme.colors.backgroundAlt, ...theme.shadows.medium },
  controlDisabled: { opacity: 0.5 },
  confirmButton: { minHeight: 56, borderRadius: theme.radius.pill, shadowOpacity: 0, elevation: 0 },
});
