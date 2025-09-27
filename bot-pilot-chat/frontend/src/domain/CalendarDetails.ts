import type { BusyEventResponse } from './BusyEvent.ts';
import type { OpeningHour } from './OpeningHour.ts';
import type { DisabledDays } from './DisabledDays.ts';

/**
 * CalendarDetails will be fetched from backend.
 * Contains the opening hours {@link OpeningHour}s as an Array in case of multiple open intervals
 * and the busy events of the customer {@BusyEventResponse}.
 */
export interface CalendarDetails {
  disabledWeekdays: DisabledDays;
  openingHours: OpeningHour[];
  busyEvents: BusyEventResponse;
}
