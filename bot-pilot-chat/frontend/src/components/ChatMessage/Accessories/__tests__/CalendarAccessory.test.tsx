import {
  describe,
  it,
  expect,
  vi,
  type MockedFunction,
  beforeEach,
  beforeAll,
  afterAll,
} from 'vitest';
import useCalendarDetails from '../useCalendarDetails.ts';
import type { OpeningHour, OpeningHours } from '../../../../domain/OpeningHour.ts';
import type { CalendarDetails } from '../../../../domain/CalendarDetails.ts';
import { render, waitFor } from '@testing-library/react';
import CalendarAccessory from '../CalendarAccessory.tsx';
import React from 'react';
import { userEvent } from '@testing-library/user-event';
import getBusyEvents from '../getBusyEvents.ts';
import type { BusyEventResponse } from '../../../../domain/BusyEvent.ts';
import * as message_service from '../../../../service/MessageService.ts';

const useMessageServiceSpy = vi.spyOn(message_service, 'default');
const sendMessageAndGetResponseMock = vi.fn();

useMessageServiceSpy.mockReturnValue({
  sendMessageAndGetResponse: sendMessageAndGetResponseMock,
});
vi.mock('../../../ChatInput/useHandleSend.ts');
vi.mock('../useCalendarDetails.ts');
vi.mock('../getBusyEvents.ts');

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
beforeEach(() => {
  vi.clearAllMocks();
});
beforeAll(() => {
  vi.setSystemTime(new Date('2025-10-07T12:00:00Z'));
});

afterAll(() => {
  vi.useRealTimers();
});
describe('CalendarAccessory', () => {
  it('should render all time of openingHours from 08:00 - 18:00 Europe/Berlin', async () => {
    (useCalendarDetails as MockedFunction<typeof useCalendarDetails>).mockResolvedValue(
      {
        openingHours: allDayOpen,
        disabledWeekdays: undefined,
      } as CalendarDetails
    );
    (getBusyEvents as MockedFunction<typeof getBusyEvents>).mockResolvedValue({
      busyEvents: [],
      timespanDays: 90,
    } as BusyEventResponse);
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
  it('should render time 10:00 and 11:15 if event is only from 10:15-11:15', async () => {
    (getBusyEvents as MockedFunction<typeof getBusyEvents>).mockResolvedValue({
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
    } as BusyEventResponse);
    (useCalendarDetails as MockedFunction<typeof useCalendarDetails>).mockResolvedValue(
      {
        openingHours: allDayOpen,
        disabledWeekdays: undefined,
      } as CalendarDetails
    );
    const user = userEvent.setup();
    const { getByText, getByTestId, getByRole, queryByRole } = render(
      <CalendarAccessory />
    );
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

    await waitFor(() => {
      expect(getByRole('option', { name: '0 minutes' })).toBeInTheDocument();
      expect(queryByRole('option', { name: '15 minutes' })).not.toBeInTheDocument();
      expect(queryByRole('option', { name: '30 minutes' })).not.toBeInTheDocument();
      expect(queryByRole('option', { name: '45 minutes' })).not.toBeInTheDocument();
    });
    await user.click(elevenFullHour);

    await waitFor(() => {
      expect(queryByRole('option', { name: '0 minutes' })).not.toBeInTheDocument();
      expect(getByRole('option', { name: '15 minutes' })).toBeInTheDocument();
      expect(getByRole('option', { name: '30 minutes' })).toBeInTheDocument();
      expect(getByRole('option', { name: '45 minutes' })).toBeInTheDocument();
    });
  });
  it('should render time 10:15, 10:30, 10:45 and 9:00, 9:15, 9:30 if event is from 09:45-10:15', async () => {
    (getBusyEvents as MockedFunction<typeof getBusyEvents>).mockResolvedValue({
      timespanDays: 90,
      busyEvents: [
        {
          start: {
            dateTime: '2025-10-09T07:45:00Z', // 09:45 europe/berlin
            timeZone: 'UTC',
          },
          end: {
            dateTime: '2025-10-09T08:15:00Z', // 10:15 europe/berlin
            timeZone: 'UTC',
          },
        },
      ],
    } as BusyEventResponse);
    (useCalendarDetails as MockedFunction<typeof useCalendarDetails>).mockResolvedValue(
      {
        openingHours: allDayOpen,
        disabledWeekdays: undefined,
      } as CalendarDetails
    );
    const user = userEvent.setup();
    const { getByText, getByTestId, getByRole, queryByRole } = render(
      <CalendarAccessory />
    );
    const calendarButton = getByTestId('CalendarIcon');
    expect(calendarButton).toBeInTheDocument();

    await user.click(calendarButton);
    const dropDownIcon = getByTestId('ArrowDropDownIcon');
    await user.click(dropDownIcon);
    await user.click(getByRole('radio', { name: '2025' })); // year 2025
    await user.click(getByText('Okt.')); // October
    await user.click(getByText('9')); // Thursday, 9th October 2025

    const nineHours = getByRole('option', { name: '9 hours' });
    const tenHours = getByRole('option', { name: '10 hours' });
    await waitFor(() => {
      expect(nineHours).toBeInTheDocument();
      expect(tenHours).toBeInTheDocument();
    });
    await user.click(nineHours);

    await waitFor(() => {
      expect(getByRole('option', { name: '0 minutes' })).toBeInTheDocument();
      expect(queryByRole('option', { name: '45 minutes' })).not.toBeInTheDocument();
      expect(getByRole('option', { name: '15 minutes' })).toBeInTheDocument();
      expect(getByRole('option', { name: '30 minutes' })).toBeInTheDocument();
    });
    await user.click(tenHours);
    await waitFor(() => {
      expect(queryByRole('option', { name: '0 minutes' })).not.toBeInTheDocument();
      expect(getByRole('option', { name: '45 minutes' })).toBeInTheDocument();
      expect(getByRole('option', { name: '15 minutes' })).toBeInTheDocument();
      expect(getByRole('option', { name: '30 minutes' })).toBeInTheDocument();
    });
  });
});
