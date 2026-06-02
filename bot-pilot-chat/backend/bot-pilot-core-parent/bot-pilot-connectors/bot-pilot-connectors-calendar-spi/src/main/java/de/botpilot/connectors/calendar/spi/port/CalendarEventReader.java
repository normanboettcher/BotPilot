package de.botpilot.connectors.calendar.spi.port;

import de.botpilot.connectors.calendar.spi.model.BusyEvent;

import java.util.List;

/**
 * Driven port (outbound): reads busy time slots from a calendar provider.
 *
 * <p>This is the "right side" of the hexagon — an interface the application layer
 * calls, implemented by an infrastructure adapter (Google Calendar, Outlook, etc.).
 *
 * <p>Why "CalendarEventReader" and not "GoogleCalendarEventsProvider"?
 * The use case must not know which calendar provider it is talking to.
 * Naming the port after the capability ("reading events") rather than the
 * implementation ("Google provider") keeps the inner ring provider-agnostic.
 */
public interface CalendarEventReader {

    /**
     * Returns the busy time slots for the given customer context over the next N days.
     *
     * @param customerContext the identifier of the customer / user whose calendar to query
     * @param nextDays        number of days ahead to query (Python default was 90)
     * @return list of busy slots; never null, may be empty if the calendar is free
     * @throws de.botpilot.connectors.calendar.spi.exception.NotAuthenticatedException
     *         if no valid credentials exist for the given customerContext
     */
    List<BusyEvent> readBusyEventsNext(String customerContext, int nextDays);
}
