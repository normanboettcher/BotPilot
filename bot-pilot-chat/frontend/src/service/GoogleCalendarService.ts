import type { RestClient } from './RestClient.ts';
import type { CalendarService } from './CalendarService.ts';
import type { BusyEventResponse } from '../domain/BusyEvent.ts';

class GoogleCalendarService implements CalendarService {
  private readonly restClient: RestClient;

  constructor(restClient: RestClient) {
    this.restClient = restClient;
  }

  readBusyEvents = async (next?: number) => {
    const url = next
      ? `http://192.168.178.65:8000/calendar/google/events/busy?next_days=${next}`
      : 'http://192.168.178.65:8000/calendar/google/events/busy';
    const response = await this.restClient.get(url);
    if (!response) {
      throw new Error(
        'No response from server reading busy events for google calendar'
      );
    }
    const asJson: any = await response.json();
    if (!asJson) {
      throw new Error(
        'Could not parse response from server after reading busy events for google calendar'
      );
    }
    const result: BusyEventResponse = {
      busyEvents: asJson.busy_events.map((e: any) => ({
        start: {
          dateTime: e.start.date_time,
          timeZone: e.start.time_zone,
        },
        end: {
          dateTime: e.end.date_time,
          timeZone: e.end.time_zone,
        },
      })),
      timespanDays: asJson.timespan_days,
    };
    return result;
  };
}

const useGoogleCalendarService = (restClient: RestClient) =>
  new GoogleCalendarService(restClient);

export default useGoogleCalendarService;
