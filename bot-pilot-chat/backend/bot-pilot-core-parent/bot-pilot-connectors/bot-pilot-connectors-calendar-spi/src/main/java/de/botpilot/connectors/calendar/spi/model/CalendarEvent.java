package de.botpilot.connectors.calendar.spi.model;

import java.util.List;

/**
 * A calendar event to be created — the generic, provider-agnostic representation.
 *
 * <p>Why is this called {@code CalendarEvent} and not {@code GoogleCalendarEvent}?
 * The Python code had a {@code GoogleCalendarEvent} dataclass, but the use case
 * should not know it is speaking to Google.  By keeping this record generic, the
 * same {@code CreateCalendarEventUseCase} can drive an Outlook adapter without any
 * changes — only the adapter maps this record to the provider-specific wire format.
 *
 * <p>Google-specific mapping (summary/description/start/end/attendees) lives in the
 * {@code GoogleCalendarEventWriterAdapter} in the infrastructure-google-api module.
 *
 * @param summary     event title
 * @param start       event start time
 * @param end         event end time
 * @param description optional free-text description; may be null or empty
 * @param attendees   invited attendees; never null, may be empty
 */
public record CalendarEvent(
        String summary,
        EventTime start,
        EventTime end,
        String description,
        List<EventAttendee> attendees
) {
    public CalendarEvent {
        if (summary == null || summary.isBlank()) {
            throw new IllegalArgumentException("CalendarEvent summary must not be blank");
        }
        if (start == null) {
            throw new IllegalArgumentException("CalendarEvent start must not be null");
        }
        if (end == null) {
            throw new IllegalArgumentException("CalendarEvent end must not be null");
        }
        attendees = attendees == null ? List.of() : List.copyOf(attendees);
    }
}
