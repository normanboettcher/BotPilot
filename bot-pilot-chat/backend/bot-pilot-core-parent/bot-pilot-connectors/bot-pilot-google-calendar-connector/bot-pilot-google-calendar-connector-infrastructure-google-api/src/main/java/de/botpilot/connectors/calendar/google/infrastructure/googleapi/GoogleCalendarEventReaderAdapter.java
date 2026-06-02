package de.botpilot.connectors.calendar.google.infrastructure.googleapi;

import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.FreeBusyRequest;
import com.google.api.services.calendar.model.FreeBusyRequestItem;
import com.google.api.services.calendar.model.FreeBusyResponse;
import com.google.api.services.calendar.model.TimePeriod;
import de.botpilot.connectors.calendar.spi.model.BusyEvent;
import de.botpilot.connectors.calendar.spi.model.EventTime;
import de.botpilot.connectors.calendar.spi.port.CalendarEventReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Driven adapter: implements {@link CalendarEventReader} using the Google Calendar
 * Freebusy API.
 *
 * <p>Mirrors the Python {@code GoogleCalendarEventsProvider.read_busy_events_next}:
 * queries {@code freebusy().query()} for the primary calendar over the next N days
 * and maps {@link TimePeriod} objects to {@link BusyEvent} records.
 *
 * <p>Token refresh is handled transparently by {@link GoogleCalendarClientFactory}
 * (via the google-auth-library) — this adapter does not manage credential lifecycle.
 */
public class GoogleCalendarEventReaderAdapter implements CalendarEventReader {

    private static final Logger log = LoggerFactory.getLogger(GoogleCalendarEventReaderAdapter.class);
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    private final GoogleCalendarClientFactory clientFactory;

    public GoogleCalendarEventReaderAdapter(GoogleCalendarClientFactory clientFactory) {
        this.clientFactory = clientFactory;
    }

    @Override
    public List<BusyEvent> readBusyEventsNext(String customerContext, int nextDays) {
        Calendar service = clientFactory.buildForContext(customerContext);

        Instant now = Instant.now();
        Instant timeMax = now.plus(nextDays, java.time.temporal.ChronoUnit.DAYS);

        com.google.api.client.util.DateTime googleNow =
                new com.google.api.client.util.DateTime(now.toEpochMilli());
        com.google.api.client.util.DateTime googleMax =
                new com.google.api.client.util.DateTime(timeMax.toEpochMilli());

        FreeBusyRequest request = new FreeBusyRequest()
                .setTimeMin(googleNow)
                .setTimeMax(googleMax)
                .setTimeZone("UTC")
                .setItems(List.of(new FreeBusyRequestItem().setId("primary")));

        try {
            FreeBusyResponse response = service.freebusy().query(request).execute();

            var calendar = response.getCalendars().get("primary");
            if (calendar == null) {
                log.warn("No 'primary' calendar in freebusy response for context [{}]",
                        customerContext);
                return List.of();
            }

            if (calendar.getErrors() != null && !calendar.getErrors().isEmpty()) {
                throw new GoogleCalendarApiException(
                        "Freebusy query returned errors for context [" + customerContext + "]: "
                        + calendar.getErrors());
            }

            List<TimePeriod> busy = calendar.getBusy();
            if (busy == null || busy.isEmpty()) {
                return List.of();
            }

            return busy.stream()
                    .map(this::toSpiModel)
                    .collect(Collectors.toList());

        } catch (IOException e) {
            log.error("Failed to query freebusy for context [{}]: {}", customerContext, e.getMessage());
            throw new GoogleCalendarApiException(
                    "Google Calendar freebusy query failed for context: " + customerContext, e);
        }
    }

    private BusyEvent toSpiModel(TimePeriod period) {
        EventTime start = new EventTime(
                ISO_FORMATTER.format(
                        Instant.ofEpochMilli(period.getStart().getValue())
                               .atOffset(ZoneOffset.UTC)),
                "UTC"
        );
        EventTime end = new EventTime(
                ISO_FORMATTER.format(
                        Instant.ofEpochMilli(period.getEnd().getValue())
                               .atOffset(ZoneOffset.UTC)),
                "UTC"
        );
        return new BusyEvent(start, end);
    }
}
