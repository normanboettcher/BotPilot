import { describe, it, expect, vi, type MockedFunction } from 'vitest';
import useCalendarDetails from '../useCalendarDetails.ts';
import type { OpeningHour, OpeningHours } from '../../../../domain/OpeningHour.ts';
import type { CalendarDetails } from '../../../../domain/CalendarDetails.ts';
import { render, waitFor, screen } from '@testing-library/react';
import CalendarAccessory from '../CalendarAccessory.tsx';
import React from 'react';
import useHandleSend from '../../../ChatInput/useHandleSend.ts';
import { userEvent } from '@testing-library/user-event';

vi.mock('../../../ChatInput/useHandleSend.ts');
vi.mock('../useCalendarDetails.ts');
const allDay: OpeningHour = {
  start: {
    dateTime: '08:00',
    timeZone: 'Europe/Berlin',
  },
  end: {
    dateTime: '18:00',
    timeZone: 'Europe/Berlin',
  },
};
const allDayOpen: OpeningHours = new Map([
  [1, [allDay]],
  [2, [allDay]],
  [3, [allDay]],
  [4, [allDay]],
  [5, [allDay]],
  [6, [allDay]],
]);
const handleSendMock = vi.fn();
(useHandleSend as MockedFunction<typeof useHandleSend>).mockResolvedValue({
  handleSend: handleSendMock,
});
describe('CalendarAccessory', () => {
  it('should render all time of openingHours from 08:00 - 18:00 Europe/Berlin', async () => {
    (useCalendarDetails as MockedFunction<typeof useCalendarDetails>).mockResolvedValue(
      {
        busyEvents: {
          timespanDays: 90,
          busyEvents: [],
        },
        openingHours: allDayOpen,
        disabledWeekdays: undefined,
      } as CalendarDetails
    );
    const user = userEvent.setup();
    const { getByText, getByTestId, getByLabelText, getByRole } = render(
      <CalendarAccessory />
    );
    const calendarButton = getByTestId('CalendarIcon');
    expect(calendarButton).toBeInTheDocument();

    await user.click(calendarButton);
    const dropDownIcon = getByTestId('ArrowDropDownIcon');
    await user.click(dropDownIcon);
    await user.click(getByRole('radio', { name: '2025' })); // year 2025
    await user.click(getByText('Okt.')); // October
    await user.click(getByText('8')); // Wednesday, 8th October 2025

    await waitFor(() => expect(getByLabelText('8 hours')).toBeInTheDocument());
  });
  it('should render time 10:00 if event is only from 10:15-11:15', async () => {
    (useCalendarDetails as MockedFunction<typeof useCalendarDetails>).mockResolvedValue(
      {
        busyEvents: {
          timespanDays: 90,
          busyEvents: [
            {
              start: {
                dateTime: '2025-10-09T08:15:00Z', // 10:15 europe/berlin
                timeZone: 'UTC',
              },
              end: {
                dateTime: '2025-10-09T09:15:00Z', // 11:15 europe/berlin
                timeZone: 'UTC',
              },
            },
          ],
        },
        openingHours: allDayOpen,
        disabledWeekdays: undefined,
      } as CalendarDetails
    );
    const user = userEvent.setup();
    const { getByText, getByTestId, getByRole } = render(<CalendarAccessory />);
    const calendarButton = getByTestId('CalendarIcon');
    expect(calendarButton).toBeInTheDocument();

    await user.click(calendarButton);
    const dropDownIcon = getByTestId('ArrowDropDownIcon');
    await user.click(dropDownIcon);
    await user.click(getByRole('radio', { name: '2025' })); // year 2025
    await user.click(getByText('Okt.')); // October
    await user.click(getByText('9')); // Thursday, 9th October 2025

    const tenFullHour = getByRole('option', { name: '10 hours' });
    const elevenFullHour = getByRole('option', { name: '11 hours' });
    await waitFor(() => {
      expect(tenFullHour).toBeInTheDocument();
      expect(elevenFullHour).toBeInTheDocument();
    });
    await user.click(tenFullHour);
    screen.debug(getByTestId('calendar-accessory'), undefined);

    /*
    await waitFor(() => {
      expect(getByRole('option', { name: '0 minutes' })).toBeInTheDocument();
      expect(getByRole('option', { name: '15 minutes' })).not.toBeInTheDocument();
      expect(getByRole('option', { name: '30 minutes' })).not.toBeInTheDocument();
      expect(getByRole('option', { name: '45 minutes' })).not.toBeInTheDocument();
    });

     */
  });
});
