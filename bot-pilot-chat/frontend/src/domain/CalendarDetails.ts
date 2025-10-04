import type { OpeningHour, OpeningHours } from './OpeningHour.ts';
import type { DisabledDays } from './DisabledDays.ts';

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
/**
 * CalendarDetails will be fetched from backend.
 * Contains the opening hours {@link OpeningHour}s as an Array in case of multiple open intervals
 * and the busy events of the customer {@BusyEventResponse}.
 */
export interface CalendarDetails {
  disabledWeekdays: DisabledDays;
  openingHours: OpeningHours;
}
