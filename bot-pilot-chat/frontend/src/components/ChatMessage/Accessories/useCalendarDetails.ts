import type { CalendarDetails } from '../../../domain/CalendarDetails.ts';
import { busyEventsMock } from '../../mocks/MockBusyEvents.ts';
import { mockOpeningHours } from '../../mocks/MockOpeningHours.ts';

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
    openingHours: mockOpeningHours,
    busyEvents: busyEventsMock,
  };
};

export default useCalendarDetails;
