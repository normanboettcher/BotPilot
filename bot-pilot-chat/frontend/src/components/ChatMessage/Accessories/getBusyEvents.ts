import type { BusyEventResponse } from '../../../domain/BusyEvent.ts';
import useRestClient from '../../../service/RestClient.ts';
import useGoogleCalendarService from '../../../service/GoogleCalendarService.ts';

const getBusyEvents = async (): Promise<BusyEventResponse | undefined> => {
  const restClient = useRestClient();
  const calendarService = useGoogleCalendarService(restClient);
  try {
    return await calendarService.readBusyEvents();
  } catch (error) {
    console.error(error);
  }
};
export default getBusyEvents;
