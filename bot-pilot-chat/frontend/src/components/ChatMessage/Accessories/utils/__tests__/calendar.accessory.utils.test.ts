import { describe, it, expect, vi } from 'vitest';
import dayjs from 'dayjs';
import { shouldDisableTime } from '../calendar.accessory.utils.ts';
import type { BusyEvent } from '../../../../../domain/BusyEvent.ts';
import * as calendar_details from '../../useCalendarDetails.ts';
import type { CalendarDetails } from '../../../../../domain/CalendarDetails.ts';
import { busyEventsMock } from '../../../../mocks/MockBusyEvents.ts';

const givenBusyEvent = (start: string, end: string): BusyEvent => ({
  start: {
    dateTime: start,
    timeZone: 'Europe/Berlin',
  },
  end: {
    dateTime: end,
    timeZone: 'Europe/Berlin',
  },
});

const baseCalendarDetails: CalendarDetails = {
  // all day long
  openingHours: [
    {
      start: {
        dateTime: '2025-10-02T00:00:00+02:00',
        timeZone: 'Europe/Berlin',
      },
      end: {
        dateTime: '2025-10-03T00:00:00+02:00',
        timeZone: 'Europe/Berlin',
      },
    },
  ],
  busyEvents: busyEventsMock,
};
const useCalendarDetailsSpy = vi.spyOn(calendar_details, 'default');

describe('shouldDisableTime', () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    if (i < 10) {
      if (i === 9) {
        hours.push([`0${i}`, `${i + 1}`]);
      } else {
        hours.push([`0${i}`, `0${i + 1}`]);
      }
    } else {
      if (i === 23) {
        hours.push([`${i}`, `00`]);
      } else {
        hours.push([`${i}`, `${i + 1}`]);
      }
    }
  }
  it.each(hours)('Should return true if hour %s - %s is completely busy', (hourStart, hourEnd) => {
    // given
    const start = `2025-10-02T${hourStart}:00:00+02:00`;

    let end = '';
    if (hourStart === '23') {
      end = `2025-10-03T${hourEnd}:00:00+02:00`; // next day
    } else {
      end = `2025-10-02T${hourEnd}:00:00+02:00`;
    }
    const busyEvent = givenBusyEvent(start, end);
    useCalendarDetailsSpy.mockReturnValue({
      ...baseCalendarDetails,
      busyEvents: {
        ...baseCalendarDetails.busyEvents,
        busyEvents: [busyEvent],
      },
    });
    const selectedDate = dayjs(`2025-10-02T${hourStart}:30:00+02:00`);
    console.log(`Testing with hour start: [${start}] and end: [${end}]`);

    // when
    const result = shouldDisableTime(selectedDate, 'minutes');

    // then
    expect(result).toEqual(true);
  });
  it.each([
    ['00', '15', '30'],
    ['15', '00', '15'],
    ['30', '00', '15'],
    ['45', '00', '15'],
    ['45', '15', '30'],
    ['45', '30', '45'],
    ['45', '15', '45'],
    ['45', '00', '45'],
    ['15', '30', '45'],
    ['00', '30', '45'],
  ])(
    'should return false for 10:%s if event is only from 10:%s-10:%s',
    (selectStart, busyStart, busyEnd) => {
      console.log(
        `selectStart: [${selectStart}], busyStart: [${busyStart}], busyEnd: [${busyEnd}]`
      );
      // given
      const start = `2025-10-02T10:${busyStart}:00+02:00`;
      const end = `2025-10-02T10:${busyEnd}:00+02:00`;
      const busyEvent = givenBusyEvent(start, end);
      useCalendarDetailsSpy.mockReturnValue({
        ...baseCalendarDetails,
        busyEvents: {
          ...baseCalendarDetails.busyEvents,
          busyEvents: [busyEvent],
        },
      });

      const selectedDate = dayjs(`2025-10-02T10:${selectStart}:00+02:00`);

      // when
      const result = shouldDisableTime(selectedDate, 'minutes');

      // then
      expect(result).toEqual(false);
    }
  );
  it.each([
    ['15', '15', '30'],
    ['00', '00', '15'],
    ['30', '30', '45'],
    ['30', '00', '45'],
    ['15', '00', '30'],
  ])(
    'should return true for 10:%s if event is from 10:%s-10:%s',
    (selectStart, busyStart, busyEnd) => {
      console.log(
        `selectStart: [${selectStart}], busyStart: [${busyStart}], busyEnd: [${busyEnd}]`
      );
      // given
      const start = `2025-10-02T10:${busyStart}:00+02:00`;
      const end = `2025-10-02T10:${busyEnd}:00+02:00`;
      const busyEvent = givenBusyEvent(start, end);
      useCalendarDetailsSpy.mockReturnValue({
        ...baseCalendarDetails,
        busyEvents: {
          ...baseCalendarDetails.busyEvents,
          busyEvents: [busyEvent],
        },
      });

      const selectedDate = dayjs(`2025-10-02T10:${selectStart}:00+02:00`);

      // when
      const result = shouldDisableTime(selectedDate, 'minutes');

      // then
      expect(result).toEqual(true);
    }
  );
  it.each([
    ['2025-10-02T13:00:00+02:00'],
    ['2025-10-02T13:30:00+02:00'],
    ['2025-10-02T14:00:00+02:00'],
    ['2025-10-02T14:15:00+02:00'],
    ['2025-10-02T14:30:00+02:00'],
    ['2025-10-02T17:15:00+02:00'],
    ['2025-10-02T17:30:00+02:00'],
    ['2025-10-02T18:30:00+02:00'],
  ])('should return true if time %s is not in opening hours', (time) => {
    // given
    const selectedDate = dayjs(time);
    useCalendarDetailsSpy.mockReturnValue({
      openingHours: [
        {
          start: {
            dateTime: '2025-10-02T08:00:00+02:00',
            timeZone: 'Europe/Berlin',
          },
          end: {
            dateTime: '2025-10-02T12:00:00+02:00',
            timeZone: 'Europe/Berlin',
          },
        },
        {
          start: {
            dateTime: '2025-10-02T15:00:00+02:00',
            timeZone: 'Europe/Berlin',
          },
          end: {
            dateTime: '2025-10-02T17:00:00+02:00',
            timeZone: 'Europe/Berlin',
          },
        },
      ],
      busyEvents: {
        timespanDays: 90,
        busyEvents: [],
      },
    });

    // when
    const result = shouldDisableTime(selectedDate, 'minutes');

    // then
    expect(result).toEqual(true);
  });
  it.each([
    ['2025-10-02T08:00:00+02:00'],
    ['2025-10-02T13:00:00+02:00'],
    ['2025-10-02T13:30:00+02:00'],
    ['2025-10-02T14:00:00+02:00'],
    ['2025-10-02T14:15:00+02:00'],
    ['2025-10-02T14:30:00+02:00'],
    ['2025-10-02T17:15:00+02:00'],
    ['2025-10-02T17:30:00+02:00'],
  ])('should return false if time %s is in opening hours', (time) => {
    // given
    const selectedDate = dayjs(time);
    useCalendarDetailsSpy.mockReturnValue({
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
      busyEvents: {
        timespanDays: 90,
        busyEvents: [],
      },
    });

    // when
    const result = shouldDisableTime(selectedDate, 'minutes');

    // then
    expect(result).toEqual(false);
  });
  it('should not allow 18:00 if opening hours are only until 18:00', () => {
    // given
    const selectedDate = dayjs('2025-10-02T18:00:00+02:00');
    useCalendarDetailsSpy.mockReturnValue({
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
      busyEvents: {
        timespanDays: 90,
        busyEvents: [],
      },
    });

    // when
    const result = shouldDisableTime(selectedDate, 'minutes');

    // then
    expect(result).toEqual(true);
  });
  it('should not allow 11:00 if busy event is from 10:15-11:15', () => {
    // given
    const selectedDate = dayjs('2025-10-02T11:00:00+02:00');

    useCalendarDetailsSpy.mockReturnValue({
      ...baseCalendarDetails,
      busyEvents: {
        timespanDays: 90,
        busyEvents: [
          {
            start: { dateTime: '2025-10-02T10:15:00+02:00', timeZone: 'Europe/Berlin' },
            end: { dateTime: '2025-10-02T11:15:00+02:00', timeZone: 'Europe/Berlin' },
          },
        ],
      },
    });

    // when
    const result = shouldDisableTime(selectedDate, 'minutes');

    // then
    expect(result).toEqual(true);
  });
});
