import AppSection from "@/src/components/ui/AppSection";
import FieldManagementCard from "@/src/features/venues/components/FieldManagementCard";
import type { SportsFieldDraft, VenueLocation } from "@/src/features/venues/types/businessOnboarding";
import { theme } from "@/src/theme";
import { useCallback, useMemo } from "react";
import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";

interface FieldsCarouselProps {
  fields: SportsFieldDraft[];
  venues: VenueLocation[];
  onOpenAll: () => void;
  onOpenField: (fieldId: string) => void;
}

const FieldsCarousel = ({ fields, venues, onOpenAll, onOpenField }: FieldsCarouselProps) => {
  const { width } = useWindowDimensions();
  const availableWidth = width - theme.layout.screenGutter * 2;
  const cardWidth = availableWidth;
  const cardStyle = useMemo(() => ({ width: cardWidth }), [cardWidth]);
  const renderField = useCallback(({ item }: { item: SportsFieldDraft }) => {
    const venueName = venues.find((venue) => venue.venueId === item.venueId)?.venueName;
    return <FieldManagementCard field={item} subtitle={venueName} presentation="featured" style={cardStyle} onPress={() => onOpenField(item.fieldId)} />;
  }, [cardStyle, onOpenField, venues]);

  if (fields.length === 0) return null;

  return (
    <AppSection title="Canchas" actionLabel="Ver todas" onAction={onOpenAll}>
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
        snapToInterval={cardWidth + theme.spacing.sm}
      />
    </AppSection>
  );
};

const Separator = () => <View style={styles.separator} />;

export default FieldsCarousel;

const styles = StyleSheet.create({
  list: { marginHorizontal: -theme.spacing.lg },
  content: { paddingHorizontal: theme.spacing.lg },
  separator: { width: theme.spacing.sm },
});
