export interface BusyEvent {
  start: string;
  end: string;
}

export interface BusyEventResponse {
  timespanDays: number;
  busyEvents: BusyEvent[];
}
