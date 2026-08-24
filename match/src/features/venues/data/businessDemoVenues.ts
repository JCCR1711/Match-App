import type { VenueLocation } from "@/src/features/venues/types/businessOnboarding";

const demoSchedule: VenueLocation["defaultSchedule"] = {
  weekdays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
  openingTime: "08:00",
  closingTime: "23:00",
};

export const businessDemoVenues: readonly VenueLocation[] = [
  {
    venueId: "demo-venue-san-juan",
    venueName: "Sede San Juan",
    address: "Av. Los Heroes 620",
    district: "San Juan de Miraflores",
    city: "Lima",
    coordinates: { latitude: -12.1631, longitude: -76.9635 },
    status: "active",
    defaultSchedule: demoSchedule,
  },
  {
    venueId: "demo-venue-surco",
    venueName: "Sede Surco",
    address: "Av. Caminos del Inca 1450",
    district: "Santiago de Surco",
    city: "Lima",
    coordinates: { latitude: -12.1291, longitude: -76.9842 },
    status: "active",
    defaultSchedule: demoSchedule,
  },
  {
    venueId: "demo-venue-miraflores",
    venueName: "Sede Miraflores",
    address: "Av. Republica de Panama 5480",
    district: "Miraflores",
    city: "Lima",
    coordinates: { latitude: -12.1191, longitude: -77.0282 },
    status: "active",
    defaultSchedule: demoSchedule,
  },
  {
    venueId: "demo-venue-la-molina",
    venueName: "Sede La Molina",
    address: "Av. La Molina 1090",
    district: "La Molina",
    city: "Lima",
    coordinates: { latitude: -12.0775, longitude: -76.9483 },
    status: "active",
    defaultSchedule: demoSchedule,
  },
];
