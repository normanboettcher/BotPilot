package de.botpilot.connectors.calendar.spi.port;

import de.botpilot.connectors.calendar.spi.model.CalendarEvent;
import de.botpilot.connectors.calendar.spi.model.CalendarEventCreationResult;

/**
 * Driven port (outbound): creates a calendar event on behalf of a customer.
 *
 * <p>Adapters implement this interface to handle provider-specific wire formats.
 * The use case calls this port without knowing whether the event is being sent
 * to Google Calendar, Outlook, etc.
 */
public interface CalendarEventWriter {

    /**
     * Creates a new calendar event for the given customer context.
     *
     * @param event           the generic event to create
     * @param customerContext the identifier of the customer whose calendar receives the event
     * @return {@link CalendarEventCreationResult.Success} on success,
     *         {@link CalendarEventCreationResult.Failure} with the error message on failure
     * @throws de.botpilot.connectors.calendar.spi.exception.NotAuthenticatedException
     *         if no valid credentials exist for the given customerContext
     */
    CalendarEventCreationResult createEvent(CalendarEvent event, String customerContext);
}
