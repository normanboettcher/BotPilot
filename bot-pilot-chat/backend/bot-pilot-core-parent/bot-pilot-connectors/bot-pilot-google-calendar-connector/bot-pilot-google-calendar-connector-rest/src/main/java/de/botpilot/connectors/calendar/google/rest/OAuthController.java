package de.botpilot.connectors.calendar.google.rest;

import com.google.api.client.auth.oauth2.AuthorizationCodeFlow;
import com.google.api.client.auth.oauth2.AuthorizationCodeResponseUrl;
import com.google.api.client.auth.oauth2.TokenResponse;
import de.botpilot.connectors.calendar.google.domain.GoogleCalendarCredentials;
import de.botpilot.connectors.calendar.google.infrastructure.googleapi.GoogleOAuthFlowFactory;
import de.botpilot.connectors.calendar.spi.port.CredentialRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URI;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Driving adapter: handles Google OAuth2 initiation and callback.
 *
 * <p>Mirrors the Python {@code /oauth2/start} and {@code /oauth2/callback} endpoints.
 * The OAuth flow is an adapter concern — it talks to Google's auth servers and then
 * persists credentials via the {@link CredentialRepository} port.  There is no
 * business logic here.
 *
 * <p>State is stored in a {@link ConcurrentHashMap} keyed by a per-request CSRF state
 * parameter — matching the Python {@code user_tokens["state"]} pattern.  For production
 * this should be backed by a distributed store (Redis, DB); the in-memory map is
 * sufficient for single-instance deployments.
 *
 * <p>Endpoints:
 * <pre>
 * GET /oauth2/start           → HTTP 302 redirect to Google consent screen
 * GET /oauth2/callback?code=&state=  → exchanges code, persists credentials, returns 200
 * </pre>
 */
@RestController
@RequestMapping("/oauth2")
class OAuthController {

    private static final Logger log = LoggerFactory.getLogger(OAuthController.class);
    private static final String DEFAULT_CUSTOMER_CONTEXT = "default";

    private final GoogleOAuthFlowFactory flowFactory;
    private final CredentialRepository<GoogleCalendarCredentials> credentialRepository;

    /**
     * In-memory CSRF state store.  Maps state token → customer context.
     * Replace with a distributed store for multi-instance deployments.
     */
    private final ConcurrentMap<String, String> pendingStates = new ConcurrentHashMap<>();

    OAuthController(
            GoogleOAuthFlowFactory flowFactory,
            CredentialRepository<GoogleCalendarCredentials> credentialRepository
    ) {
        this.flowFactory = flowFactory;
        this.credentialRepository = credentialRepository;
    }

    /**
     * Initiates the Google OAuth2 authorization-code flow.
     *
     * <p>Returns HTTP 302 with the Google consent URL as the Location header.
     * The client (browser or SPA) follows the redirect to grant access.
     */
    @GetMapping("/start")
    ResponseEntity<Void> start() {
        AuthorizationCodeFlow flow = flowFactory.buildFlow();

        String state = java.util.UUID.randomUUID().toString();
        pendingStates.put(state, DEFAULT_CUSTOMER_CONTEXT);

        String authUrl = flow.newAuthorizationUrl()
                .setRedirectUri(flowFactory.getRedirectUri())
                .setState(state)
                .set("access_type", "offline")
                .set("prompt", "consent")
                .build();

        log.debug("Redirecting to Google OAuth consent: state={}", state);
        return ResponseEntity.status(302).location(URI.create(authUrl)).build();
    }

    /**
     * Handles the OAuth2 callback after the user grants access.
     *
     * <p>Validates the CSRF state parameter, exchanges the authorization code for tokens,
     * and persists the credentials via the repository port.
     */
    @GetMapping("/callback")
    ResponseEntity<OAuthCallbackResponse> callback(
            @RequestParam String code,
            @RequestParam String state
    ) {
        String customerContext = pendingStates.remove(state);
        if (customerContext == null) {
            log.warn("Received OAuth callback with unknown state: {}", state);
            return ResponseEntity.badRequest()
                    .body(new OAuthCallbackResponse("error", "Invalid or expired state parameter"));
        }

        try {
            AuthorizationCodeFlow flow = flowFactory.buildFlow();
            TokenResponse tokenResponse = flow.newTokenRequest(code)
                    .setRedirectUri(flowFactory.getRedirectUri())
                    .execute();

            GoogleCalendarCredentials credentials = buildCredentials(
                    tokenResponse, customerContext, flowFactory.getClientId(),
                    flowFactory.getClientSecret());

            credentialRepository.save(credentials, customerContext);

            log.info("OAuth credentials saved for context [{}]", customerContext);
            return ResponseEntity.ok(
                    new OAuthCallbackResponse("ok", "OAuth authentication successful"));

        } catch (IOException e) {
            log.error("Token exchange failed for state [{}]: {}", state, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(new OAuthCallbackResponse("error", "Token exchange failed: " + e.getMessage()));
        }
    }

    private GoogleCalendarCredentials buildCredentials(
            TokenResponse response,
            String customerContext,
            String clientId,
            String clientSecret
    ) {
        String calendarId = customerContext + "-google-calendar";

        // Compute expiry from expires_in seconds if present
        LocalDateTime expiry = null;
        if (response.getExpiresInSeconds() != null) {
            expiry = LocalDateTime.ofInstant(
                    Instant.now().plusSeconds(response.getExpiresInSeconds()),
                    ZoneOffset.UTC);
        }

        // Scopes come back as a space-delimited string; store as comma-delimited
        // to match the Python serialisation format.
        String scopes = response.getScope() != null
                ? response.getScope().replace(" ", ",")
                : null;

        return new GoogleCalendarCredentials(
                calendarId,
                customerContext,
                clientId,
                clientSecret,
                response.getAccessToken(),
                (String) response.get("refresh_token"),
                "https://oauth2.googleapis.com/token",
                expiry,
                scopes
        );
    }

    // ---- Response records ----

    record OAuthCallbackResponse(String status, String message) {}
}
