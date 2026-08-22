import type { PublicVenue } from "@/src/features/venues/types/publicVenue";

export const publicVenuesPreview: PublicVenue[] = [
  {
    id: "arena-san-miguel",
    name: "Arena San Miguel",
    district: "San Miguel",
    distanceLabel: "1.2 km",
    coordinates: { latitude: -12.0775, longitude: -77.0872 },
    fields: [
      { id: "arena-5", name: "Cancha Central", format: "Fútbol 5", hourlyPrice: 90, availableSlots: ["18:00", "19:00", "21:00"] },
      { id: "arena-7", name: "Cancha Norte", format: "Fútbol 7", hourlyPrice: 120, availableSlots: ["17:00", "20:00"] },
    ],
  },
  {
    id: "match-padel-club",
    name: "Match Club Surco",
    district: "Santiago de Surco",
    distanceLabel: "3.8 km",
    coordinates: { latitude: -12.1334, longitude: -76.9975 },
    fields: [
      { id: "surco-5", name: "Cancha 1", format: "Fútbol 5", hourlyPrice: 100, availableSlots: ["18:00", "20:00", "21:00"] },
      { id: "surco-11", name: "Cancha Principal", format: "Fútbol 11", hourlyPrice: 220, availableSlots: ["19:00", "21:00"] },
    ],
  },
  {
    id: "la-80-futbol",
    name: "La 80 Fútbol",
    district: "Miraflores",
    distanceLabel: "4.5 km",
    coordinates: { latitude: -12.1191, longitude: -77.0297 },
    fields: [
      { id: "la80-7", name: "Cancha 80", format: "Fútbol 7", hourlyPrice: 130, availableSlots: ["17:00", "19:00"] },
    ],
  },
];
