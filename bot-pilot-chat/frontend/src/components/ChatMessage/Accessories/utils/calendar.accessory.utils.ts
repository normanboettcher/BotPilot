import dayjs, { type Dayjs } from 'dayjs';
import type { TimeView } from '@mui/x-date-pickers';
import type { BusyEvent } from '../../../../domain/BusyEvent.ts';

const shouldDisableTime = (value: Dayjs, view: TimeView, busyEvents: BusyEvent[]) => {
  // only hours and minutes are considered
  if (view !== 'hours' && view !== 'minutes') {
    return false;
  }
  const busyStart = dayjs(value).startOf('hour');

  const busyEnd = busyStart.add(1, 'hour');
  return busyEvents.some(
    (event) =>
      dayjs(event.start.dateTime).isBefore(busyEnd) && dayjs(event.end.dateTime).isAfter(busyStart)
  );
};
export default shouldDisableTime;
