import dayjs, { type Dayjs } from 'dayjs';
import type { TimeView } from '@mui/x-date-pickers';
import useCalendarDetails from '../useCalendarDetails.ts';

export const shouldDisableTime = (value: Dayjs, view: TimeView) => {
  // only hours and minutes are considered
  if (view !== 'hours' && view !== 'minutes') {
    return false;
  }
  const { busyEvents, openingHours } = useCalendarDetails();
  const notInOpeningHours = openingHours.some(
    (open) =>
      value.isAfter(open.end.dateTime) ||
      value.isBefore(open.start.dateTime) ||
      // do not allow an event at the same time as the end of opening hours
      value.isSame(open.end.dateTime)
  );
  if (notInOpeningHours) {
    return true;
  }
  const busyStart = dayjs(value).startOf('minutes');

  const busyEnd = busyStart.add(1, 'minutes');
  return busyEvents.busyEvents.some(
    (event) =>
      dayjs(event.start.dateTime).isBefore(busyEnd) && dayjs(event.end.dateTime).isAfter(busyStart)
  );
};
