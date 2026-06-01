package de.botpilot.connectors.calendar.spi.model;

import java.util.List;

/**
 * Response envelope for a freebusy query.
 *
 * <p>Mirrors the Python {@code BusyEventsResponse} dataclass: pairs the timespan
 * that was queried with the list of busy slots found within it.
 *
 * @param timespanDays number of days that were queried (e.g. 90)
 * @param busyEvents   busy slots within the queried timespan; never null, may be empty
 */
public record BusyEventsResponse(int timespanDays, List<BusyEvent> busyEvents) {

    public BusyEventsResponse {
        if (timespanDays < 1) {
            throw new IllegalArgumentException("timespanDays must be >= 1 but was: " + timespanDays);
        }
        if (busyEvents == null) {
            throw new IllegalArgumentException("busyEvents must not be null");
        }
        busyEvents = List.copyOf(busyEvents); // defensive immutable copy
    }
}
