export type MatchCardTone = "blue" | "teal" | "orchid";

export interface OpenMatchPreview {
  id: string;
  venueId: string;
  title: string;
  dateLabel: string;
  time: string;
  availableSpots: number;
  tone: MatchCardTone;
}
