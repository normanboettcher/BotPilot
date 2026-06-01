package de.botpilot.connectors.calendar.google.infrastructure.googleapi;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.OAuth2Credentials;
import com.google.auth.oauth2.UserCredentials;
import de.botpilot.connectors.calendar.google.domain.GoogleCalendarCredentials;
import de.botpilot.connectors.calendar.google.infrastructure.persistence.GoogleCalendarCredentialRepositoryAdapter;
import de.botpilot.connectors.calendar.spi.exception.NotAuthenticatedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * Builds a {@link Calendar} Google API service instance from stored credentials.
 *
 * <p>Mirrors the Python {@code GoogleCalendarClient.get_google_calendar_as_service}:
 * loads credentials from the repository, constructs {@link UserCredentials} (which
 * handles token refresh automatically via the google-auth-library), and builds the
 * {@link Calendar} service with Jackson HTTP transport.
 *
 * <p>Why {@link UserCredentials} instead of {@link GoogleCredentials#fromStream}?
 * We have individual per-user tokens (not a service account).  {@link UserCredentials}
 * is the correct credential type for OAuth2 authorization-code flows where each user
 * has their own access_token + refresh_token.
 *
 * <p>Why not cache the Calendar instance?
 * The Python code created a new service per request (via FastAPI DI).  Access tokens
 * expire and refresh_tokens can be rotated.  Building per-request ensures we always
 * use a fresh credential state without implementing our own TTL cache.
 */
public class GoogleCalendarClientFactory {

    private static final Logger log = LoggerFactory.getLogger(GoogleCalendarClientFactory.class);
    private static final String APPLICATION_NAME = "bot-pilot-google-calendar-connector";

    private final GoogleCalendarCredentialRepositoryAdapter credentialRepository;

    public GoogleCalendarClientFactory(
            GoogleCalendarCredentialRepositoryAdapter credentialRepository) {
        this.credentialRepository = credentialRepository;
    }

    /**
     * Builds a ready-to-use {@link Calendar} service for the given customer context.
     *
     * @param customerContext identifies the customer whose credentials to load
     * @return a configured {@link Calendar} service
     * @throws NotAuthenticatedException if no credentials are stored for the context
     * @throws GoogleCalendarApiException if the Google API client cannot be initialised
     */
    public Calendar buildForContext(String customerContext) {
        GoogleCalendarCredentials entity = credentialRepository.findByCustomerContext(customerContext);
        if (entity == null) {
            log.debug("No credentials found for customer context: {}", customerContext);
            throw new NotAuthenticatedException(customerContext);
        }

        try {
            Date expiryDate = entity.getExpiry() != null
                    ? Date.from(entity.getExpiry().toInstant(ZoneOffset.UTC))
                    : null;

            AccessToken accessToken = new AccessToken(entity.getAccessToken(), expiryDate);

            List<String> scopes = entity.getScopes() != null && !entity.getScopes().isBlank()
                    ? Arrays.asList(entity.getScopes().split(","))
                    : List.of();

            UserCredentials credentials = UserCredentials.newBuilder()
                    .setClientId(entity.getClientId())
                    .setClientSecret(entity.getClientSecret())
                    .setRefreshToken(entity.getRefreshToken())
                    .setAccessToken(accessToken)
                    .setQuotaProjectId(null)
                    .build();

            // Attach scopes for refresh — UserCredentials.createScoped returns a new
            // instance with the requested scopes; the original is not mutated.
            OAuth2Credentials scopedCredentials = scopes.isEmpty()
                    ? credentials
                    : credentials.createScoped(scopes);

            return new Calendar.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(),
                    new HttpCredentialsAdapter(scopedCredentials)
            )
                    .setApplicationName(APPLICATION_NAME)
                    .build();

        } catch (GeneralSecurityException | IOException e) {
            log.error("Failed to build Google Calendar service for context [{}]: {}",
                    customerContext, e.getMessage());
            throw new GoogleCalendarApiException(
                    "Failed to initialise Google Calendar client for context: " + customerContext, e);
        }
    }
}
