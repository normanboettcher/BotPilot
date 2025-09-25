export interface EventTime {
  dateTime: string;
  timeZone: string;
}

export interface BusyEvent {
  start: EventTime;
  end: EventTime;
}

export interface BusyEventResponse {
  timespanDays: number;
  busyEvents: BusyEvent[];
}
