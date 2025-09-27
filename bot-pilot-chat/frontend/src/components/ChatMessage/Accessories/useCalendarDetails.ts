import type { CalendarDetails } from '../../../domain/CalendarDetails.ts';
import { busyEventsMock } from '../../mocks/MockBusyEvents.ts';

/**
 * Fetches the opening hours and busy events from backend corresponding to the current customer.
 *
 * @return calendar details of type {@link CalendarDetails}
 */
const useCalendarDetails = (): CalendarDetails => {
  // TODO: fetch real opening hours and busyEvents from backend
  return {
    // Sunday, Saturday
    disabledWeekdays: [0, 6],
    openingHours: [
      {
        start: {
          dateTime: '2025-10-02T08:00:00+02:00',
          timeZone: 'Europe/Berlin',
        },
        end: {
          dateTime: '2025-10-02T18:00:00+02:00',
          timeZone: 'Europe/Berlin',
        },
      },
    ],
    busyEvents: busyEventsMock,
  };
};

export default useCalendarDetails;
