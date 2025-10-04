import type { BusyEventResponse } from '../domain/BusyEvent.ts';

export interface CalendarService {
  readBusyEvents: (next?: number) => Promise<BusyEventResponse>;
}
