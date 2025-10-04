import type { CalendarDetails } from '../../../domain/CalendarDetails.ts';
import { mockOpeningHours } from '../../mocks/MockOpeningHours.ts';

/**
 * Fetches the opening hours and busy events from backend to corresponding current customer.
 *
 * @return calendar details of type {@link CalendarDetails}
 */
const useCalendarDetails = async (): Promise<CalendarDetails | undefined> => {
  try {
    return {
      // Sunday, Saturday
      disabledWeekdays: [0, 6],
      openingHours: mockOpeningHours,
    };
  } catch (error) {
    console.error('Error when fetching the calendar details:', error);
    return undefined;
  }
};

export default useCalendarDetails;
