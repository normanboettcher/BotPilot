package de.botpilot.connectors.calendar.google.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

/**
 * JPA entity for persisting Google OAuth2 credentials.
 *
 * <p>Maps to the {@code google_credentials} table — the same schema used by the
 * Python SQLAlchemy model.  Column lengths match the Python Column(String(N)) widths
 * exactly, ensuring schema compatibility across the migration.
 *
 * <p>Why is a JPA entity in the domain module (not persistence)?
 * The entity IS the domain model for credentials.  It holds the OAuth2 state that
 * the application needs to operate (access token, refresh token, expiry).  Putting it
 * in the persistence module would create a circular dependency: persistence depends on
 * domain for the entity, and domain would have to depend on persistence for the entity
 * definition.  JPA annotations are purely structural metadata, not infrastructure logic.
 *
 * <p>Schema is pre-created; Hibernate is set to validate only ({@code ddl-auto: validate}).
 * If you need to add a column, write a migration SQL script — do not flip to create-drop.
 */
@Entity
@Table(name = "google_credentials")
public class GoogleCalendarCredentials {

    /**
     * Primary key: a deterministic string composed as "{customerContext}-google-calendar".
     * Matches the Python {@code build_from_credentials} logic exactly.
     */
    @Id
    @Column(name = "calendar_id", nullable = false, length = 500)
    private String calendarId;

    /** Logical identifier for the user / customer owning these credentials. */
    @Column(name = "customer_context", nullable = false, length = 500)
    private String customerContext;

    @Column(name = "client_id", nullable = false, length = 500)
    private String clientId;

    @Column(name = "client_secret", nullable = false, length = 500)
    private String clientSecret;

    @Column(name = "access_token", nullable = false, length = 2500)
    private String accessToken;

    @Column(name = "refresh_token", nullable = false, length = 2500)
    private String refreshToken;

    @Column(name = "token_uri", nullable = false, length = 1000)
    private String tokenUri;

    /**
     * Token expiry timestamp.  Nullable — Google does not always return an expiry
     * for refresh tokens (only for access tokens).
     */
    @Column(name = "expiry", nullable = true)
    private LocalDateTime expiry;

    /**
     * Comma-separated OAuth2 scopes, e.g.
     * "https://www.googleapis.com/auth/calendar.readonly,...".
     * Matches the Python serialisation: {@code ",".join(cred.scopes)}.
     */
    @Column(name = "scopes", nullable = true, length = 1000)
    private String scopes;

    /** JPA requires a no-arg constructor. */
    protected GoogleCalendarCredentials() {}

    public GoogleCalendarCredentials(
            String calendarId,
            String customerContext,
            String clientId,
            String clientSecret,
            String accessToken,
            String refreshToken,
            String tokenUri,
            LocalDateTime expiry,
            String scopes
    ) {
        this.calendarId = calendarId;
        this.customerContext = customerContext;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenUri = tokenUri;
        this.expiry = expiry;
        this.scopes = scopes;
    }

    public String getCalendarId() { return calendarId; }
    public String getCustomerContext() { return customerContext; }
    public String getClientId() { return clientId; }
    public String getClientSecret() { return clientSecret; }
    public String getAccessToken() { return accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public String getTokenUri() { return tokenUri; }
    public LocalDateTime getExpiry() { return expiry; }
    public String getScopes() { return scopes; }

    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public void setExpiry(LocalDateTime expiry) { this.expiry = expiry; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
}
