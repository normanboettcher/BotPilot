import type { EventTime } from './BusyEvent.ts';

export interface OpeningHour {
  start: EventTime;
  end: EventTime;
}
