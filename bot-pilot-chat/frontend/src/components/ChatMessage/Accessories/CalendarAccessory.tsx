import React, { useState } from 'react';
import type { BusyEvent } from '../../../domain/BusyEvent.ts';
import { Box } from '@mui/material';
import {
  type DateOrTimeView,
  DesktopDateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import shouldDisableTime from './utils/calendar.accessory.utils.ts';

const useEventIntervall = (): { eventIntervallViews: DateOrTimeView[] } => {
  return { eventIntervallViews: ['year', 'month', 'day', 'hours', 'minutes'] };
};

type Props = {
  busyHours: BusyEvent[];
};
export const CalendarAccessory: React.FC<Props> = ({ busyHours }) => {
  const now = dayjs();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(now);
  const { eventIntervallViews } = useEventIntervall();

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'de'}>
        <DesktopDateTimePicker
          defaultValue={now}
          format="DD.MM.YYYY HH:mm"
          views={eventIntervallViews}
          disablePast
          minutesStep={15}
          skipDisabled
          shouldDisableTime={(value, view) => shouldDisableTime(value, view, busyHours)}
        ></DesktopDateTimePicker>
      </LocalizationProvider>
    </Box>
  );
};

export default CalendarAccessory;
