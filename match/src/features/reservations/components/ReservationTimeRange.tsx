import AppTimeRange, { type AppTimeRangeTone } from "@/src/components/ui/AppTimeRange";
import { addMinutesToTime } from "@/src/features/reservations/utils/reservationTime";

interface ReservationTimeRangeProps {
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  tone?: AppTimeRangeTone;
}

const ReservationTimeRange = ({ startTime, endTime, durationMinutes = 60, tone = "neutral" }: ReservationTimeRangeProps) => (
  <AppTimeRange startTime={startTime} endTime={endTime ?? addMinutesToTime(startTime, durationMinutes)} tone={tone} />
);

export default ReservationTimeRange;
