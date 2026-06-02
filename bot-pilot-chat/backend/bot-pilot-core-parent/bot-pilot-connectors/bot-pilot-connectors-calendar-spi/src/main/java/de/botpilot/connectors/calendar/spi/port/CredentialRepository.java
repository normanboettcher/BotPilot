package de.botpilot.connectors.calendar.spi.port;

/**
 * Driven port (outbound): generic credential storage for calendar OAuth tokens.
 *
 * <p>Parameterised by {@code C} — the credential type — so that each connector can
 * define its own credential value object while the port interface stays in the SPI.
 * For Google Calendar, {@code C} is {@code GoogleCalendarCredentials}.
 *
 * <p>Why generic and not typed to GoogleCalendarCredentials?
 * The SPI must not import Google-specific types.  Making the port generic means an
 * Outlook adapter can bind {@code C = OutlookCalendarCredentials} and satisfy the
 * same contract without changing the interface.
 *
 * @param <C> the provider-specific credential entity type
 */
public interface CredentialRepository<C> {

    /**
     * Persists (insert or update) credentials for the given customer context.
     *
     * @param credentials     the credential object to persist
     * @param customerContext the logical identifier for the customer / user
     */
    void save(C credentials, String customerContext);

    /**
     * Loads credentials for the given customer context.
     *
     * @param customerContext the logical identifier for the customer / user
     * @return the stored credentials, or {@code null} if none exist
     */
    C findByCustomerContext(String customerContext);
}
