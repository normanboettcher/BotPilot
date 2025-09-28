import type { OpeningHour, OpeningHours } from '../../domain/OpeningHour.ts';
import type { Weekday } from '../../domain/CalendarDetails.ts';

const mockAllDay: OpeningHour[] = [
  {
    start: {
      dateTime: '08:00',
      timeZone: 'Europe/Berlin',
    },
    end: {
      dateTime: '18:00',
      timeZone: 'Europe/Berlin',
    },
  },
];
export const mockOpeningHours: OpeningHours = new Map<Weekday, OpeningHour[]>([
  [1, mockAllDay], //monday
  [2, mockAllDay], //tuesday
  [3, mockAllDay], //wednesday
  [4, mockAllDay], //thursday
  [5, mockAllDay], //friday
]);
