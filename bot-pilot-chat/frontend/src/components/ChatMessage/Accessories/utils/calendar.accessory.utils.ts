import dayjs, { type Dayjs } from 'dayjs';
import type { TimeView } from '@mui/x-date-pickers';
import useCalendarDetails from '../useCalendarDetails.ts';
import type { OpeningHour } from '../../../../domain/OpeningHour.ts';
import type { DisabledDays } from '../../../../domain/DisabledDays.ts';

export const shouldDisableTime = (value: Dayjs, view: TimeView) => {
  // only hours and minutes are considered
  if (view !== 'hours' && view !== 'minutes') {
    return false;
  }
  const { busyEvents, openingHours, disabledWeekdays } = useCalendarDetails();
  if (
    outsideOpeningHours(value, openingHours) ||
    isWeekDayDisabled(value, disabledWeekdays)
  ) {
    return true;
  }
  const busyStart = dayjs(value).startOf('minutes');

  const busyEnd = busyStart.add(1, 'minutes');
  return busyEvents.busyEvents.some(
    (event) =>
      dayjs(event.start.dateTime).isBefore(busyEnd) &&
      dayjs(event.end.dateTime).isAfter(busyStart)
  );
};

export const isWeekDayDisabled = (value: Dayjs, disabled: DisabledDays) => {
  if (!disabled) {
    return false;
  }
  return disabled.some((disabled) => value.day() === disabled);
};

export const outsideOpeningHours = (value: Dayjs, openingHours: OpeningHour[]) => {
  return openingHours.some(
    (open) =>
      value.isAfter(open.end.dateTime) ||
      value.isBefore(open.start.dateTime) ||
      // do not allow an event at the same time as the end of opening hours
      value.isSame(open.end.dateTime)
  );
};
