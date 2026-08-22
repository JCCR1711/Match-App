import AppRootHeader from "@/src/components/ui/AppRootHeader";
import CustomText from "@/src/components/ui/CustomText";
import FeaturedVenueCard from "@/src/features/home/components/FeaturedVenueCard";
import HomeVenueCard from "@/src/features/home/components/HomeVenueCard";
import HomeSectionHeader from "@/src/features/home/components/HomeSectionHeader";
import NearbyVenuesMap from "@/src/features/home/components/NearbyVenuesMap";
import OpenMatchCard from "@/src/features/home/components/OpenMatchCard";
import { openMatches } from "@/src/features/home/data/openMatches";
import { useNearbyAvailableVenues } from "@/src/features/home/hooks/useNearbyAvailableVenues";
import type { NearbyAvailableVenue } from "@/src/features/home/types/nearbyVenue";
import type { OpenMatchPreview } from "@/src/features/home/types/openMatch";
import { publicVenuesPreview } from "@/src/features/venues/data/publicVenuesPreview";
import { useAuth } from "@/src/hooks/useAuth";
import { theme } from "@/src/theme";
import { UserIcon } from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeView = () => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { width: viewportWidth } = useWindowDimensions();
  const { venues, playerCoordinates, locationSource, isLoading } = useNearbyAvailableVenues();
  const [selectedTime, setSelectedTime] = useState("");
  const firstName = user?.displayName.split(" ")[0] || "Jugador";
  const featuredVenue = venues[0];
  const featuredTimes = useMemo(() => featuredVenue?.availableSlots.slice(0, 3) ?? [], [featuredVenue]);
  const horizontalCardWidth = Math.min(
    320,
    viewportWidth - theme.layout.screenGutter * 2 - theme.spacing.huge,
  );

  useEffect(() => {
    if (featuredTimes.length > 0 && !featuredTimes.includes(selectedTime)) setSelectedTime(featuredTimes[0]);
  }, [featuredTimes, selectedTime]);

  const openVenue = useCallback((venueId: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: "/venues/[venueId]", params: { venueId } });
  }, []);

  const renderVenue = useCallback(
    ({ item }: { item: NearbyAvailableVenue }) => (
      <HomeVenueCard item={item} width={horizontalCardWidth} onPress={() => openVenue(item.venue.id)} />
    ),
    [horizontalCardWidth, openVenue],
  );

  const renderMatch = useCallback(
    ({ item }: { item: OpenMatchPreview }) => {
      const venue = publicVenuesPreview.find((candidate) => candidate.id === item.venueId) ?? publicVenuesPreview[0];
      return (
        <OpenMatchCard
          match={item}
          venue={venue}
          width={horizontalCardWidth}
          onPress={() => openVenue(venue.id)}
        />
      );
    },
    [horizontalCardWidth, openVenue],
  );

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + theme.spacing.sm,
            paddingBottom: insets.bottom + theme.layout.tabBarClearance + theme.spacing.xxxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AppRootHeader
          title={`Hola, ${firstName}`}
          subtitle={
            isLoading
              ? "Buscando tu ubicación"
              : locationSource === "device"
                ? "Canchas cerca de tu ubicación"
                : "Explorando canchas en Lima"
          }
          actionIcon={UserIcon}
          actionLabel={`Abrir perfil de ${firstName}`}
          onAction={() => router.push("/(tabs)/player-profile")}
        />

        <View style={styles.sections}>
          {featuredVenue ? (
            <View style={styles.section}>
              <HomeSectionHeader title="Disponible para ti" label="HOY" />
              <FeaturedVenueCard
                venue={featuredVenue.venue}
                times={featuredTimes}
                selectedTime={selectedTime}
                onSelectTime={(time) => {
                  setSelectedTime(time);
                  void Haptics.selectionAsync();
                }}
                onOpen={() => openVenue(featuredVenue.venue.id)}
              />
            </View>
          ) : null}

          <View style={styles.section}>
            <CustomText text="Canchas cerca de ti" variant="subtitle" style={styles.sectionTitle} />
            <NearbyVenuesMap venues={venues} playerCoordinates={playerCoordinates} locationSource={locationSource} onSelectVenue={openVenue} />
          </View>

          <View style={styles.section}>
            <HomeSectionHeader title="Canchas disponibles" />
            <FlatList
              horizontal
              data={venues}
              renderItem={renderVenue}
              keyExtractor={(item) => item.venue.id}
              contentContainerStyle={styles.horizontalList}
              showsHorizontalScrollIndicator={false}
              snapToInterval={horizontalCardWidth + theme.spacing.sm}
              decelerationRate="fast"
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <CustomText text="No hay canchas libres hoy" variant="sectionHeading" style={styles.emptyTitle} />
                  <CustomText text="Prueba nuevamente más tarde." variant="caption" style={styles.sectionMetadata} />
                </View>
              }
            />
          </View>

          <View style={styles.section}>
            <HomeSectionHeader title="Partidos disponibles" />
            <FlatList
              horizontal
              data={openMatches}
              renderItem={renderMatch}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.horizontalList}
              showsHorizontalScrollIndicator={false}
              snapToInterval={horizontalCardWidth + theme.spacing.sm}
              decelerationRate="fast"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeView;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.authCanvas },
  content: { paddingHorizontal: theme.layout.screenGutter },
  sections: { paddingTop: theme.spacing.md, gap: theme.layout.sectionGap },
  section: { gap: theme.spacing.md },
  sectionTitle: { flex: 1, color: theme.colors.white },
  sectionMetadata: { color: theme.colors.authTextSecondary },
  horizontalList: { gap: theme.spacing.sm },
  emptyState: { width: 280, minHeight: 150, alignItems: "center", justifyContent: "center", gap: theme.spacing.xs },
  emptyTitle: { color: theme.colors.white },
});
