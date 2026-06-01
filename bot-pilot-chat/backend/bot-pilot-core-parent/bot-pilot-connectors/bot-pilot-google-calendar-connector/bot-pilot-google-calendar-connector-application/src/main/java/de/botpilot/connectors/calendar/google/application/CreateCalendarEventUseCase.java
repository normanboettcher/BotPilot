package de.botpilot.connectors.calendar.google.application;

import de.botpilot.connectors.calendar.spi.model.CalendarEvent;
import de.botpilot.connectors.calendar.spi.model.CalendarEventCreationResult;
import de.botpilot.connectors.calendar.spi.port.CalendarEventWriter;

/**
 * Use case: create a new event on the customer's calendar.
 *
 * <p>Validates inputs, delegates to {@link CalendarEventWriter}, and returns a
 * {@link CalendarEventCreationResult} sealed type.  The controller maps the two
 * variants ({@code Success}, {@code Failure}) to appropriate HTTP responses via
 * pattern-matching switch — no instanceof checks, no null returns.
 *
 * <p>No Spring annotations — wired as {@code @Bean} in the assembler module.
 */
public class CreateCalendarEventUseCase {

    private final CalendarEventWriter calendarEventWriter;

    /**
     * @param calendarEventWriter the driven port that creates events on a calendar provider
     */
    public CreateCalendarEventUseCase(CalendarEventWriter calendarEventWriter) {
        if (calendarEventWriter == null) {
            throw new IllegalArgumentException("calendarEventWriter must not be null");
        }
        this.calendarEventWriter = calendarEventWriter;
    }

    /**
     * Creates a calendar event for the given customer.
     *
     * @param event           the event to create; must not be null
     * @param customerContext identifies the customer whose calendar receives the event; must not be blank
     * @return {@link CalendarEventCreationResult.Success} on success,
     *         {@link CalendarEventCreationResult.Failure} with an error message on failure
     * @throws de.botpilot.connectors.calendar.spi.exception.NotAuthenticatedException
     *         if no OAuth credentials exist for {@code customerContext}
     */
    public CalendarEventCreationResult execute(CalendarEvent event, String customerContext) {
        if (event == null) {
            throw new IllegalArgumentException("event must not be null");
        }
        if (customerContext == null || customerContext.isBlank()) {
            throw new IllegalArgumentException("customerContext must not be blank");
        }
        return calendarEventWriter.createEvent(event, customerContext);
    }
}
