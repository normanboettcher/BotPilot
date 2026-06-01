package de.botpilot.connectors.calendar.spi.model;

/**
 * A time slot during which the calendar owner is busy.
 *
 * <p>Returned by {@link de.botpilot.connectors.calendar.spi.port.CalendarEventReader}
 * as the result of a freebusy query.  Providers (Google, Outlook, etc.) map their
 * native responses to this record — the use case never sees provider-specific types.
 *
 * @param start start of the busy block
 * @param end   end of the busy block
 */
public record BusyEvent(EventTime start, EventTime end) {

    public BusyEvent {
        if (start == null) {
            throw new IllegalArgumentException("BusyEvent start must not be null");
        }
        if (end == null) {
            throw new IllegalArgumentException("BusyEvent end must not be null");
        }
    }
}
