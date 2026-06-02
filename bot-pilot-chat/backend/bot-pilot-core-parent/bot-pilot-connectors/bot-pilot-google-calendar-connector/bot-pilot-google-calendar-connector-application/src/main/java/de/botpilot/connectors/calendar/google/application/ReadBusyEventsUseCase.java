package de.botpilot.connectors.calendar.google.application;

import de.botpilot.connectors.calendar.spi.exception.NotAuthenticatedException;
import de.botpilot.connectors.calendar.spi.model.BusyEvent;
import de.botpilot.connectors.calendar.spi.port.CalendarEventReader;

import java.util.List;

/**
 * Use case: read busy time slots from the customer's calendar.
 *
 * <p>Orchestrates the read side: validates inputs, delegates to {@link CalendarEventReader},
 * and propagates {@link NotAuthenticatedException} if the adapter signals that no valid
 * credentials exist for the given context.
 *
 * <p>This class has no Spring annotations.  It is a pure Java object wired as a {@code @Bean}
 * in the assembler module ({@code GoogleCalendarConnectorConfiguration}) — the same pattern
 * as {@code FindSimilarFaqUseCase} in the faqs module.  This makes it trivially testable
 * with plain Mockito without starting a Spring context.
 *
 * <p>Default for nextDays mirrors the Python endpoint default of 90.
 */
public class ReadBusyEventsUseCase {

    /** Default lookahead when no explicit day count is requested (mirrors Python default). */
    public static final int DEFAULT_NEXT_DAYS = 90;

    private final CalendarEventReader calendarEventReader;

    /**
     * @param calendarEventReader the driven port that retrieves busy slots from a calendar provider
     */
    public ReadBusyEventsUseCase(CalendarEventReader calendarEventReader) {
        if (calendarEventReader == null) {
            throw new IllegalArgumentException("calendarEventReader must not be null");
        }
        this.calendarEventReader = calendarEventReader;
    }

    /**
     * Returns busy time slots for the next {@code nextDays} days.
     *
     * @param customerContext identifies the customer whose calendar is queried; must not be blank
     * @param nextDays        number of days ahead to query; must be >= 1
     * @return list of busy slots; never null, may be empty
     * @throws NotAuthenticatedException if no OAuth credentials exist for {@code customerContext}
     */
    public List<BusyEvent> execute(String customerContext, int nextDays) {
        if (customerContext == null || customerContext.isBlank()) {
            throw new IllegalArgumentException("customerContext must not be blank");
        }
        if (nextDays < 1) {
            throw new IllegalArgumentException("nextDays must be >= 1 but was: " + nextDays);
        }
        // The adapter throws NotAuthenticatedException if credentials are absent —
        // that propagates unchanged to the REST layer which maps it to HTTP 401.
        return calendarEventReader.readBusyEventsNext(customerContext, nextDays);
    }

    /** Convenience overload using the default nextDays=90 (mirrors Python endpoint default). */
    public List<BusyEvent> execute(String customerContext) {
        return execute(customerContext, DEFAULT_NEXT_DAYS);
    }
}
