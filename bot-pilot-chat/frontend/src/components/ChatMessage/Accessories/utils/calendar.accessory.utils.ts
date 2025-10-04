import dayjs, { type Dayjs } from 'dayjs';
import type { TimeView } from '@mui/x-date-pickers';
import type { OpeningHours } from '../../../../domain/OpeningHour.ts';
import type { DisabledDays } from '../../../../domain/DisabledDays.ts';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import type { DateTimePickerContainer } from '../CalendarAccessory.tsx';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const shouldDisableTime = (
  value: Dayjs,
  view: TimeView,
  dateTimePickerContainer: DateTimePickerContainer
) => {
  if (!dateTimePickerContainer || !dateTimePickerContainer.busyEvents) {
    return true;
  }
  // only hours and minutes are considered
  if (view !== 'hours' && view !== 'minutes') {
    return false;
  }
  const { busyEvents, openingHours, disabledWeekdays } = dateTimePickerContainer;

  if (
    outsideOpeningHours(value, openingHours) ||
    isWeekDayDisabled(value, disabledWeekdays)
  ) {
    return true;
  }
  if (view === 'hours') {
    const startOfHour = value.startOf('hours');
    const endOfHour = value.endOf('hours');
    return busyEvents.busyEvents.some((event) => {
      const start = dayjs(event.start.dateTime);
      const end = dayjs(event.end.dateTime);
      return start.isSameOrBefore(startOfHour) && end.isSameOrAfter(endOfHour);
    });
  }

  const valueStart = dayjs(value).startOf('minutes');

  return busyEvents.busyEvents.some((event) => {
    const start = dayjs(event.start.dateTime);
    const end = dayjs(event.end.dateTime);
    return valueStart.isBetween(start, end) || valueStart.isSame(start);
  });
};

export const isWeekDayDisabled = (value: Dayjs, disabled: DisabledDays) => {
  if (!disabled) {
    return false;
  }
  return disabled.some((disabled) => value.day() === disabled);
};

export const outsideOpeningHours = (value: Dayjs, openingHours: OpeningHours) => {
  const day = value.day();
  const openHoursOnDay = openingHours.get(day);
  // no opening hours for this day specified
  if (!openHoursOnDay) {
    return false;
  }
  for (const open of openHoursOnDay) {
    const valueUtc = value.utc();
    const localValue = valueUtc.tz(open.start.timeZone);
    const date = localValue.format('YYYY-MM-DD');
    const start = dayjs.tz(`${date} ${open.start.dateTime}`, open.start.timeZone);
    const end = dayjs.tz(`${date} ${open.end.dateTime}`, open.end.timeZone);
    // looking for an interval that the value is between and is not at the end
    const isBetween = localValue.isBetween(start, end, 'minutes', '[]');
    if (isBetween && !localValue.isSame(end)) {
      return false;
    }
  }
  // if no valid interval was found return false
  return true;
};
