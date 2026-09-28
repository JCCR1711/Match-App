import type { PublicVenue } from "@/src/features/venues/types/publicVenue";

export const isPublicVenueBookable = (venue: PublicVenue) =>
  venue.marketplaceStatus === "live";
