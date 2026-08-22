import { spacing } from "./spacing";

/** Shared spatial rhythm for screen composition. */
export const layout = {
  screenGutter: spacing.lg,
  microGap: spacing.xs,
  elementGap: spacing.md,
  groupGap: spacing.xl,
  sectionGap: spacing.xxl,
  cardPadding: spacing.xl,
  headerContentGap: spacing.sm,
  tabBarClearance: 74,
} as const;
