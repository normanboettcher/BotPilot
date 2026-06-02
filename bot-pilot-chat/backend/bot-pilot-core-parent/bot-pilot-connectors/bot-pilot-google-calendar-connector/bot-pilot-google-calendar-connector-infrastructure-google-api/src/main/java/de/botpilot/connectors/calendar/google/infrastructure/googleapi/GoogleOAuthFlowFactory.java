package de.botpilot.connectors.calendar.google.infrastructure.googleapi;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.auth.oauth2.AuthorizationCodeFlow;
import com.google.api.client.auth.oauth2.BearerToken;
import com.google.api.client.auth.oauth2.ClientParametersAuthentication;
import com.google.api.client.http.GenericUrl;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

/**
 * Builds Google OAuth2 authorization-code flows.
 *
 * <p>Encapsulates all Google-specific OAuth2 configuration (client-id, client-secret,
 * scopes, redirect-URI, token endpoint) so the REST controller remains free of
 * Google API types.  The controller receives a pre-built {@link AuthorizationCodeFlow}
 * and calls {@code newAuthorizationUrl()} / {@code newTokenRequest()} on it.
 *
 * <p>Configuration values (client-id, client-secret, redirect-URI) are injected
 * from {@code application.properties} via the assembler configuration class.
 */
public class GoogleOAuthFlowFactory {

    private static final String TOKEN_SERVER_URL = "https://oauth2.googleapis.com/token";
    private static final String AUTHORIZATION_SERVER_URL =
            "https://accounts.google.com/o/oauth2/v2/auth";

    /** Google Calendar scopes required for freebusy queries and event creation. */
    public static final List<String> CALENDAR_SCOPES = List.of(
            "https://www.googleapis.com/auth/calendar.readonly",
            "https://www.googleapis.com/auth/calendar.events",
            "https://www.googleapis.com/auth/calendar.events.freebusy"
    );

    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;

    public GoogleOAuthFlowFactory(String clientId, String clientSecret, String redirectUri) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
    }

    /**
     * Builds an {@link AuthorizationCodeFlow} configured for Google's OAuth2 endpoints.
     *
     * @return a new flow instance; safe to call per-request (flows are stateless)
     * @throws GoogleCalendarApiException if transport or JSON factory cannot be initialised
     */
    public AuthorizationCodeFlow buildFlow() {
        try {
            return new AuthorizationCodeFlow.Builder(
                    BearerToken.authorizationHeaderAccessMethod(),
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(),
                    new GenericUrl(TOKEN_SERVER_URL),
                    new ClientParametersAuthentication(clientId, clientSecret),
                    clientId,
                    AUTHORIZATION_SERVER_URL
            )
                    .setScopes(CALENDAR_SCOPES)
                    .build();
        } catch (GeneralSecurityException | IOException e) {
            throw new GoogleCalendarApiException("Failed to initialise Google OAuth2 flow", e);
        }
    }

    public String getRedirectUri() {
        return redirectUri;
    }

    public String getClientId() {
        return clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }
}
