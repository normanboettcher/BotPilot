package de.botpilot.connectors.calendar.google.infrastructure.googleapi;

/**
 * Unchecked wrapper for Google API client exceptions.
 *
 * <p>Isolates Google API checked exceptions ({@code GeneralSecurityException},
 * {@code IOException}) from the port contract, which is defined in the SPI module
 * and cannot declare adapter-specific checked exceptions.
 */
public class GoogleCalendarApiException extends RuntimeException {

    public GoogleCalendarApiException(String message, Throwable cause) {
        super(message, cause);
    }

    public GoogleCalendarApiException(String message) {
        super(message);
    }
}
