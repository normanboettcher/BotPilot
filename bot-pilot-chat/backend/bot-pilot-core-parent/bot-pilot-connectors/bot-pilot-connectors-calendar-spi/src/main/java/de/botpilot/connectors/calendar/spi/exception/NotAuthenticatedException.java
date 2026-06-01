package de.botpilot.connectors.calendar.spi.exception;

/**
 * Thrown by calendar port adapters when no valid OAuth credentials exist
 * for the given customer context.
 *
 * <p>Corresponds to the Python check {@code if busy_events is None: return 401}.
 * Making this a typed exception rather than returning null from the port gives
 * callers (controller layer) a clear signal to map to HTTP 401, and prevents
 * callers from accidentally ignoring the unauthenticated state.
 *
 * <p>This is an unchecked exception because the authentication pre-condition is an
 * invariant that callers can check up front (via the /oauth2 flow) but cannot
 * reasonably recover from within a single request.
 */
public class NotAuthenticatedException extends RuntimeException {

    public NotAuthenticatedException(String customerContext) {
        super("No valid credentials found for customer context: " + customerContext);
    }
}
