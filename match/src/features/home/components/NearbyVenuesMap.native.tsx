import type { NearbyAvailableVenue, PlayerCoordinates, PlayerLocationSource } from "@/src/features/home/types/nearbyVenue";
import { theme } from "@/src/theme";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface NearbyVenuesMapProps {
  venues: NearbyAvailableVenue[];
  playerCoordinates: PlayerCoordinates;
  locationSource: PlayerLocationSource;
  onSelectVenue: (venueId: string) => void;
}

const NearbyVenuesMap = ({ venues, playerCoordinates, locationSource, onSelectVenue }: NearbyVenuesMapProps) => (
  <View style={styles.container}>
    <MapView
      key={`${playerCoordinates.latitude}-${playerCoordinates.longitude}`}
      style={StyleSheet.absoluteFill}
      initialRegion={{ ...playerCoordinates, latitudeDelta: 0.16, longitudeDelta: 0.16 }}
      showsUserLocation={locationSource === "device"}
      showsMyLocationButton={locationSource === "device"}
      toolbarEnabled={false}
    >
      {locationSource === "fallback" ? (
        <Marker coordinate={playerCoordinates} title="Ubicación de referencia" pinColor={theme.colors.electricBlue} />
      ) : null}
      {venues.map(({ venue, nextAvailableSlot }) => (
        <Marker
          key={venue.id}
          coordinate={venue.coordinates}
          title={venue.name}
          description={`Disponible desde las ${nextAvailableSlot}`}
          pinColor={theme.colors.accent}
          onCalloutPress={() => onSelectVenue(venue.id)}
        />
      ))}
    </MapView>
  </View>
);

export default NearbyVenuesMap;

const styles = StyleSheet.create({
  container: {
    height: 220,
    overflow: "hidden",
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.authSurface,
  },
});
