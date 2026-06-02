package de.botpilot.connectors.calendar.google.infrastructure.googleapi;

import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;
import de.botpilot.connectors.calendar.spi.model.CalendarEvent;
import de.botpilot.connectors.calendar.spi.model.CalendarEventCreationResult;
import de.botpilot.connectors.calendar.spi.port.CalendarEventWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Driven adapter: implements {@link CalendarEventWriter} using the Google Calendar Events API.
 *
 * <p>Mirrors the Python {@code GoogleCalendarEventsWriter.create_event}:
 * maps the generic {@link CalendarEvent} SPI record to a Google {@link Event} wire model
 * and calls {@code events().insert()}.
 *
 * <p>The mapping from SPI model to Google model is encapsulated entirely here —
 * the use case never imports {@code com.google.api.*}.
 */
public class GoogleCalendarEventWriterAdapter implements CalendarEventWriter {

    private static final Logger log = LoggerFactory.getLogger(GoogleCalendarEventWriterAdapter.class);

    private final GoogleCalendarClientFactory clientFactory;

    public GoogleCalendarEventWriterAdapter(GoogleCalendarClientFactory clientFactory) {
        this.clientFactory = clientFactory;
    }

    @Override
    public CalendarEventCreationResult createEvent(CalendarEvent event, String customerContext) {
        Calendar service = clientFactory.buildForContext(customerContext);

        Event googleEvent = toGoogleEvent(event);

        try {
            Event created = service.events()
                    .insert("primary", googleEvent)
                    .execute();

            if (created == null) {
                log.warn("Google Calendar returned null for event insertion, context [{}]",
                        customerContext);
                return CalendarEventCreationResult.failure(
                        "Event [" + event.summary() + "] could not be created: null response");
            }

            log.debug("Event created successfully: id=[{}], context=[{}]",
                    created.getId(), customerContext);
            return CalendarEventCreationResult.success();

        } catch (IOException e) {
            log.error("Failed to create event [{}] for context [{}]: {}",
                    event.summary(), customerContext, e.getMessage());
            return CalendarEventCreationResult.failure(
                    "Google Calendar API error creating event [" + event.summary() + "]: "
                    + e.getMessage());
        }
    }

    /**
     * Maps the provider-agnostic {@link CalendarEvent} SPI record to the Google
     * {@link Event} wire model.
     *
     * <p>This is the adapter's primary responsibility: translation between the domain
     * language and the provider's wire format.  The inverse mapping lives in
     * {@link GoogleCalendarEventReaderAdapter}.
     */
    private Event toGoogleEvent(CalendarEvent event) {
        EventDateTime start = new EventDateTime()
                .setDateTime(new com.google.api.client.util.DateTime(event.start().dateTime()))
                .setTimeZone(event.start().timeZone());

        EventDateTime end = new EventDateTime()
                .setDateTime(new com.google.api.client.util.DateTime(event.end().dateTime()))
                .setTimeZone(event.end().timeZone());

        List<EventAttendee> attendees = event.attendees().stream()
                .map(a -> new EventAttendee().setEmail(a.email()))
                .collect(Collectors.toList());

        return new Event()
                .setSummary(event.summary())
                .setDescription(event.description())
                .setStart(start)
                .setEnd(end)
                .setAttendees(attendees);
    }
}
