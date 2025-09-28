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
import useHandleSend from '../../ChatInput/useHandleSend.ts';

const useEventIntervall = (): { eventIntervallViews: DateOrTimeView[] } => {
  return { eventIntervallViews: ['year', 'month', 'day', 'hours', 'minutes'] };
};

export const CalendarAccessory: React.FC = () => {
  const now = dayjs();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(now);
  const { eventIntervallViews } = useEventIntervall();
  const { handleSend } = useHandleSend();

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'de'}>
        <DateTimePicker
          slotProps={{
            dialog: {
              sx: {
                zIndex: 10000,
              },
            },
            popper: {
              placement: 'top-start',
              modifiers: [
                {
                  name: 'flip',
                  enabled: false,
                },
              ],
              sx: {
                zIndex: 12000,
              },
            },
          }}
          defaultValue={now}
          format="DD.MM.YYYY HH:mm"
          views={eventIntervallViews}
          disablePast
          onChange={(value) => {
            setSelectedDate(value);
          }}
          onAccept={async () => {
            if (selectedDate) {
              await handleSend(selectedDate.format('DD.MM.YYYY HH:mm'));
            }
          }}
          value={selectedDate}
          minutesStep={15}
          skipDisabled
          shouldDisableTime={shouldDisableTime}
          onOpen={() => console.log('onOpen')}
        ></DateTimePicker>
      </LocalizationProvider>
    </Box>
  );
};

export default CalendarAccessory;
