import type { EventTime } from './BusyEvent.ts';
import type { Weekday } from './CalendarDetails.ts';

export interface OpeningHour {
  start: EventTime;
  end: EventTime;
}

export type OpeningHours = Map<Weekday, OpeningHour[]>;
