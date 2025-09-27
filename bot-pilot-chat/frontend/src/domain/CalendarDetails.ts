import type { BusyEventResponse } from './BusyEvent.ts';
import type { OpeningHour } from './OpeningHour.ts';

/**
 * CalendarDetails will be fetched from backend.
 * Contains the opening hours {@link OpeningHour}s as an Array in case of multiple open intervals
 * and the busy events of the customer {@BusyEventResponse}.
 */
export interface CalendarDetails {
  openingHours: OpeningHour[];
  busyEvents: BusyEventResponse;
}
