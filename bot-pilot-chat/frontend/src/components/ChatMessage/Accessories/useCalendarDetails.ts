import type { CalendarDetails } from '../../../domain/CalendarDetails.ts';
import { mockOpeningHours } from '../../mocks/MockOpeningHours.ts';
import useRestClient from '../../../service/RestClient.ts';
import useGoogleCalendarService from '../../../service/GoogleCalendarService.ts';

/**
 * Fetches the opening hours and busy events from backend to corresponding current customer.
 *
 * @return calendar details of type {@link CalendarDetails}
 */
const useCalendarDetails = async (): Promise<CalendarDetails | undefined> => {
  const restClient = useRestClient();
  const calendarService = useGoogleCalendarService(restClient);
  try {
    const busyEventResponse = await calendarService.readBusyEvents();
    return {
      // Sunday, Saturday
      disabledWeekdays: [0, 6],
      openingHours: mockOpeningHours,
      busyEvents: busyEventResponse,
    };
  } catch (error) {
    console.error('Error when fetching the calendar details:', error);
    return undefined;
  }
};

export default useCalendarDetails;
