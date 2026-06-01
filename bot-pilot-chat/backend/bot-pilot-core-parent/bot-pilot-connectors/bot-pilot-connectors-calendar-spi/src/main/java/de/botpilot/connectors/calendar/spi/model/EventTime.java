package de.botpilot.connectors.calendar.spi.model;

/**
 * An instant in time, described as an ISO-8601 datetime string and a timezone identifier.
 *
 * <p>Why a record instead of a {@code ZonedDateTime}?
 * The Google Calendar API accepts and returns datetime strings with timezone information
 * as separate fields in its JSON payload.  Keeping them as strings here avoids an
 * unnecessary parse-and-reformat cycle in the adapter and lets the adapter pass the
 * values through without intermediate conversion loss.
 *
 * @param dateTime ISO-8601 datetime string, e.g. "2024-03-15T09:00:00+01:00"
 * @param timeZone IANA timezone id or UTC offset, e.g. "Europe/Berlin" or "UTC"
 */
public record EventTime(String dateTime, String timeZone) {

    public EventTime {
        if (dateTime == null || dateTime.isBlank()) {
            throw new IllegalArgumentException("dateTime must not be blank");
        }
        if (timeZone == null || timeZone.isBlank()) {
            throw new IllegalArgumentException("timeZone must not be blank");
        }
    }
}
