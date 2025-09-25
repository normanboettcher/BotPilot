import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import shouldDisableTime from '../calendar.accessory.utils.ts';

describe('shouldDisableTime', () => {
  it('Should return true if hour is busy', () => {
    // given
    const busyEvent = {
      start: {
        dateTime: '2025-10-02T18:00:00+02:00',
        timeZone: 'Europe/Berlin',
      },
      end: {
        dateTime: '2025-10-02T19:00:00+02:00',
        timeZone: 'Europe/Berlin',
      },
    };

    // when
    const result = shouldDisableTime(dayjs('2025-10-02T18:00:00+02:00'), 'hours', [busyEvent]);

    // then
    expect(result).toEqual(true);
  });
});
