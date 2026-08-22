export type PublicFieldFormat = "Fútbol 5" | "Fútbol 7" | "Fútbol 11";

export interface PublicVenueField {
  id: string;
  name: string;
  format: PublicFieldFormat;
  hourlyPrice: number;
  availableSlots: string[];
}

export interface PublicVenue {
  id: string;
  name: string;
  district: string;
  distanceLabel: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  fields: PublicVenueField[];
}
