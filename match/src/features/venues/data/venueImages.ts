import type { ImageSource } from "expo-image";

const arenaSanMiguel = require("../../../assets/venues/arena-san-miguel.png") as ImageSource;
const matchClubSurco = require("../../../assets/venues/match-club-surco.png") as ImageSource;

const imagesByVenueId: Record<string, ImageSource> = {
  "arena-san-miguel": arenaSanMiguel,
  "match-padel-club": matchClubSurco,
  "la-80-futbol": arenaSanMiguel,
};

export const getVenueImage = (venueId: string) => imagesByVenueId[venueId] ?? arenaSanMiguel;

export const getVenueImageByName = (venueName: string) =>
  venueName.toLowerCase().includes("surco") ? matchClubSurco : arenaSanMiguel;
