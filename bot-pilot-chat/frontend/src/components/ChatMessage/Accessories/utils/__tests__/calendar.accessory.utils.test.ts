import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import {
  isWeekDayDisabled,
  outsideOpeningHours,
  shouldDisableTime,
} from '../calendar.accessory.utils.ts';
import type { BusyEvent } from '../../../../../domain/BusyEvent.ts';
import type {
  CalendarDetails,
  Weekday,
} from '../../../../../domain/CalendarDetails.ts';
import { busyEventsMock } from '../../../../mocks/MockBusyEvents.ts';
import type { OpeningHour, OpeningHours } from '../../../../../domain/OpeningHour.ts';

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
const allDayLong: OpeningHour[] = [
  {
    start: {
      dateTime: '00:00',
      timeZone: 'Europe/Berlin',
    },
    end: {
      dateTime: '23:59',
      timeZone: 'Europe/Berlin',
    },
  },
];
const openingHours: OpeningHours = new Map();

for (let i = 1; i < 6; i++) {
  openingHours.set(i as Weekday, allDayLong);
}

const baseCalendarDetails: CalendarDetails = {
  disabledWeekdays: undefined,
  // all day long
  openingHours: openingHours,
  busyEvents: busyEventsMock,
};

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
  it.each(hours)(
    'Should return true if hour %s - %s is completely busy',
    (hourStart, hourEnd) => {
      // given
      const start = `2025-10-02T${hourStart}:00:00Z`;

      let end = '';
      if (hourStart === '23') {
        end = `2025-10-03T${hourEnd}:00:00Z`; // next day
      } else {
        end = `2025-10-02T${hourEnd}:00:00Z`;
      }
      const busyEvent = givenBusyEvent(start, end);
      const calendarDetails: CalendarDetails = {
        ...baseCalendarDetails,
        busyEvents: {
          ...baseCalendarDetails.busyEvents,
          busyEvents: [busyEvent],
        },
      };
      const selectedDate = dayjs(`2025-10-02T${hourStart}:30:00Z`);
      console.log(
        `Testing with hour start: [${dayjs(start)}] and end: [${dayjs(end)}]`
      );

      // when
      const result = shouldDisableTime(selectedDate, 'minutes', calendarDetails);

      // then
      expect(result).toEqual(true);
    }
  );
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
      const start = `2025-10-02T10:${busyStart}:00Z`;
      const end = `2025-10-02T10:${busyEnd}:00Z`;
      const busyEvent = givenBusyEvent(start, end);
      const calendarDetails: CalendarDetails = {
        ...baseCalendarDetails,
        busyEvents: {
          ...baseCalendarDetails.busyEvents,
          busyEvents: [busyEvent],
        },
      };

      const selectedDate = dayjs(`2025-10-02T10:${selectStart}:00Z`);

      // when
      const result = shouldDisableTime(selectedDate, 'minutes', calendarDetails);

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
      const start = `2025-10-02T10:${busyStart}:00Z`;
      const end = `2025-10-02T10:${busyEnd}:00Z`;
      const busyEvent = givenBusyEvent(start, end);
      const calendarDetails: CalendarDetails = {
        ...baseCalendarDetails,
        busyEvents: {
          ...baseCalendarDetails.busyEvents,
          busyEvents: [busyEvent],
        },
      };

      const selectedDate = dayjs(`2025-10-02T10:${selectStart}:00Z`);

      // when
      const result = shouldDisableTime(selectedDate, 'minutes', calendarDetails);

      // then
      expect(result).toEqual(true);
    }
  );
  it.each([
    ['2025-10-06T13:00:00Z'],
    ['2025-10-06T13:30:00Z'],
    ['2025-10-06T14:00:00Z'],
    ['2025-10-06T14:15:00Z'],
    ['2025-10-06T14:30:00Z'],
    ['2025-10-06T17:15:00Z'],
    ['2025-10-06T17:30:00Z'],
    ['2025-10-06T18:30:00Z'],
    ['2025-10-06T18:00:00Z'],
  ])('should return true if time %s is not in opening hours', (time) => {
    // given
    const selectedDate = dayjs(time);
    const calendarDetails: CalendarDetails = {
      ...baseCalendarDetails,
      openingHours: new Map([
        // Monday
        [
          1,
          [
            {
              start: {
                dateTime: '08:00',
                timeZone: 'Europe/Berlin',
              },
              end: {
                dateTime: '12:00',
                timeZone: 'Europe/Berlin',
              },
            },
          ],
        ],
        [
          1,
          [
            {
              start: {
                dateTime: '15:00',
                timeZone: 'Europe/Berlin',
              },
              end: {
                dateTime: '17:00',
                timeZone: 'Europe/Berlin',
              },
            },
          ],
        ],
      ]),
      busyEvents: {
        timespanDays: 90,
        busyEvents: [],
      },
    };

    // when
    const result = shouldDisableTime(selectedDate, 'minutes', calendarDetails);

    // then
    expect(result).toEqual(true);
  });
  it.each([
    ['2025-10-06T08:00:00Z'],
    ['2025-10-06T08:30:00Z'],
    ['2025-10-06T11:00:00Z'],
    ['2025-10-06T15:30:00Z'],
  ])('should return false if time %s is in opening hours', (time) => {
    // given
    const selectedDate = dayjs(time);
    const calendarDetails: CalendarDetails = {
      ...baseCalendarDetails,
      openingHours: new Map([
        // Monday
        [
          1,
          [
            {
              start: {
                dateTime: '08:00',
                timeZone: 'Europe/Berlin',
              },
              end: {
                dateTime: '12:00',
                timeZone: 'Europe/Berlin',
              },
            },
            {
              start: {
                dateTime: '15:00',
                timeZone: 'Europe/Berlin',
              },
              end: {
                dateTime: '17:00',
                timeZone: 'Europe/Berlin',
              },
            },
          ],
        ],
      ]),
      busyEvents: {
        timespanDays: 90,
        busyEvents: [],
      },
    };

    // when
    const result = shouldDisableTime(selectedDate, 'minutes', calendarDetails);

    // then
    expect(result).toEqual(false);
  });
  it('should not allow 18:00 if opening hours are only until 18:00', () => {
    // given
    // Monday
    const selectedDate = dayjs('2025-10-06T18:00:00Z');
    const calendarDetails: CalendarDetails = {
      ...baseCalendarDetails,
      openingHours: new Map([
        [
          1,
          [
            {
              start: {
                dateTime: '08:00',
                timeZone: 'Europe/Berlin',
              },
              end: {
                dateTime: '18:00',
                timeZone: 'Europe/Berlin',
              },
            },
          ],
        ],
      ]),
      busyEvents: {
        timespanDays: 90,
        busyEvents: [],
      },
    };

    // when
    const result = shouldDisableTime(selectedDate, 'minutes', calendarDetails);

    // then
    expect(result).toEqual(true);
  });
  it('should not allow 11:00 if busy event is from 10:15-11:15', () => {
    // given
    const selectedDate = dayjs('2025-10-02T11:00:00Z');

    const calendarDetails: CalendarDetails = {
      ...baseCalendarDetails,
      busyEvents: {
        timespanDays: 90,
        busyEvents: [
          {
            start: { dateTime: '2025-10-02T10:15:00Z', timeZone: 'Europe/Berlin' },
            end: { dateTime: '2025-10-02T11:15:00Z', timeZone: 'Europe/Berlin' },
          },
        ],
      },
    };

    // when
    const result = shouldDisableTime(selectedDate, 'minutes', calendarDetails);

    // then
    expect(result).toEqual(true);
  });
});

describe('isWeekdayDisabled', () => {
  it('should return true if saturday is disabled', () => {
    // given
    const disabledDays = [0, 6]; // weekends
    const selectedDate = dayjs('2025-09-27'); //a saturday

    // when
    const result = isWeekDayDisabled(selectedDate, disabledDays);

    // then
    expect(result).toEqual(true);
  });
});

describe('outsideOpeningHours', () => {
  it.each([
    ['2025-10-06T06:00:00+02:00'],
    ['2025-10-06T06:00:00+01:00'],
    ['2025-10-06T05:00:00+00:00'],
    ['2025-10-06T05:00:00Z'],
  ])('should return true if date [%s] outside opening hours', (date) => {
    // given
    // monday
    const selectedDate = dayjs(date);
    const openingHours: OpeningHours = new Map([
      [
        // monday
        1,
        [
          {
            start: {
              dateTime: '08:00',
              timeZone: 'Europe/Berlin',
            },
            end: {
              dateTime: '19:00',
              timeZone: 'Europe/Berlin',
            },
          },
        ],
      ],
    ]);
    // when
    const result = outsideOpeningHours(selectedDate, openingHours);

    // then
    expect(result).toEqual(true);
  });
});
