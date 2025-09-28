import React, { useState } from 'react';
import { Box } from '@mui/material';
import {
  type DateOrTimeView,
  DateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import { shouldDisableTime } from './utils/calendar.accessory.utils.ts';

const useEventIntervall = (): { eventIntervallViews: DateOrTimeView[] } => {
  return { eventIntervallViews: ['year', 'month', 'day', 'hours', 'minutes'] };
};

export const CalendarAccessory: React.FC = () => {
  const now = dayjs();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(now);
  const { eventIntervallViews } = useEventIntervall();

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'de'}>
        <DateTimePicker
          defaultValue={now}
          format="DD.MM.YYYY HH:mm"
          views={eventIntervallViews}
          disablePast
          onChange={setSelectedDate}
          value={selectedDate}
          minutesStep={15}
          skipDisabled
          shouldDisableTime={shouldDisableTime}
        ></DateTimePicker>
      </LocalizationProvider>
    </Box>
  );
};

export default CalendarAccessory;
