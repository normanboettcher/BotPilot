import React, { useEffect, useState } from 'react';
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
import useCalendarDetails from './useCalendarDetails.ts';
import type { BusyEventResponse } from '../../../domain/BusyEvent.ts';
import getBusyEvents from './getBusyEvents.ts';
import type { CalendarDetails } from '../../../domain/CalendarDetails.ts';
import useMessageService from '../../../service/MessageService.ts';

const useEventIntervall = (): { eventIntervallViews: DateOrTimeView[] } => {
  return { eventIntervallViews: ['year', 'month', 'day', 'hours', 'minutes'] };
};

export type DateTimePickerContainer = CalendarDetails & {
  busyEvents: BusyEventResponse | undefined;
};

export const CalendarAccessory: React.FC = () => {
  const [busyEvents, setBusyEvents] = useState<BusyEventResponse | undefined>();
  const [fetchBusyEvents, setFetchBusyEvents] = useState<boolean>(false);
  const [calendarDetails, setCalendarDetails] = useState<CalendarDetails | undefined>();

  useEffect(() => {
    async function fetchCalendarDetails() {
      const calendarDetails = await useCalendarDetails();
      setCalendarDetails(calendarDetails);
    }

    fetchCalendarDetails();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (fetchBusyEvents) {
        const events = await getBusyEvents();
        if (events) {
          setBusyEvents(events);
        }
      }
    }

    fetchData();
  }, [fetchBusyEvents]);

  const onOpen = () => {
    setFetchBusyEvents(true);
  };

  const now = dayjs();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(now);
  const { eventIntervallViews } = useEventIntervall();
  const { sendMessageAndGetResponse } = useMessageService();
  return (
    <Box data-testid={'calendar-accessory'}>
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
            const selected = dayjs.utc(value).tz('Europe/Berlin');
            const rounded = selected
              .minute(Math.ceil(now.minute() / 15) * 15)
              .second(0)
              .millisecond(0);
            setSelectedDate(rounded);
          }}
          onAccept={async () => {
            if (selectedDate) {
              await sendMessageAndGetResponse(selectedDate.format('DD.MM.YYYY HH:mm'));
            }
          }}
          value={selectedDate}
          minutesStep={15}
          skipDisabled
          shouldDisableTime={(day, view) =>
            shouldDisableTime(day, view, {
              disabledWeekdays: calendarDetails?.disabledWeekdays,
              openingHours: calendarDetails?.openingHours ?? new Map(),
              busyEvents: busyEvents,
            })
          }
          onOpen={onOpen}
        ></DateTimePicker>
      </LocalizationProvider>
    </Box>
  );
};
export default CalendarAccessory;
