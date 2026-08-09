import DashboardSection from "@/src/features/dashboard/components/DashboardSection";
import FieldManagementCard from "@/src/features/venues/components/FieldManagementCard";
import type { SportsFieldDraft, VenueLocation } from "@/src/features/venues/types/businessOnboarding";
import { theme } from "@/src/theme";
import { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";

interface FieldsCarouselProps {
  fields: SportsFieldDraft[];
  venues: VenueLocation[];
  onOpenAll: () => void;
  onOpenField: (fieldId: string) => void;
}

const FieldsCarousel = ({ fields, venues, onOpenAll, onOpenField }: FieldsCarouselProps) => {
  const renderField = useCallback(({ item }: { item: SportsFieldDraft }) => {
    const venueName = venues.find((venue) => venue.venueId === item.venueId)?.venueName;
    return <FieldManagementCard field={item} subtitle={venueName} style={styles.card} showArrow={false} onPress={() => onOpenField(item.fieldId)} />;
  }, [onOpenField, venues]);

  if (fields.length === 0) return null;

  return (
    <DashboardSection title="Tus canchas" actionLabel="Ver todas" onAction={onOpenAll}>
      <FlatList
        horizontal
        data={fields}
        renderItem={renderField}
        keyExtractor={(field) => field.fieldId}
        contentContainerStyle={styles.content}
        style={styles.list}
        ItemSeparatorComponent={Separator}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        decelerationRate="fast"
        snapToInterval={316}
      />
    </DashboardSection>
  );
};

const Separator = () => <View style={styles.separator} />;

export default FieldsCarousel;

const styles = StyleSheet.create({
  list: { marginHorizontal: -theme.spacing.lg },
  content: { paddingHorizontal: theme.spacing.lg },
  card: { width: 300, minHeight: 150 },
  separator: { width: theme.spacing.md },
});
