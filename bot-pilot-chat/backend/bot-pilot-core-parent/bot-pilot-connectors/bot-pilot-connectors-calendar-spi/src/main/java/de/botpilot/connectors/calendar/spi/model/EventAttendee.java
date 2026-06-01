package de.botpilot.connectors.calendar.spi.model;

/**
 * A single event attendee identified by their email address.
 *
 * @param email the attendee's email address
 */
public record EventAttendee(String email) {

    public EventAttendee {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("attendee email must not be blank");
        }
    }
}
