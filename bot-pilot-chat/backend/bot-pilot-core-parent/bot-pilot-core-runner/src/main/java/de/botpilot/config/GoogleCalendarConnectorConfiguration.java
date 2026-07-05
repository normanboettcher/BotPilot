package de.botpilot.config;

import de.botpilot.connectors.calendar.google.application.CreateCalendarEventUseCase;
import de.botpilot.connectors.calendar.google.application.ReadBusyEventsUseCase;
import de.botpilot.connectors.calendar.google.infrastructure.googleapi.GoogleCalendarClientFactory;
import de.botpilot.connectors.calendar.google.infrastructure.googleapi.GoogleCalendarEventReaderAdapter;
import de.botpilot.connectors.calendar.google.infrastructure.googleapi.GoogleCalendarEventWriterAdapter;
import de.botpilot.connectors.calendar.google.infrastructure.googleapi.GoogleOAuthFlowFactory;
import de.botpilot.connectors.calendar.google.infrastructure.persistence.GoogleCalendarCredentialRepositoryAdapter;
import de.botpilot.connectors.calendar.spi.port.CalendarEventReader;
import de.botpilot.connectors.calendar.spi.port.CalendarEventWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * Composition root: the only class that knows about both ports and adapters simultaneously.
 *
 * <p>Wires each port interface to its concrete adapter.  If you need to swap the Google
 * Calendar reader for an Outlook reader, you change exactly ONE bean method here — the
 * use case and REST controller are completely unaware of the change.
 *
 * <p>Component scan is extended to cover the infrastructure and REST packages, because
 * {@code @SpringBootApplication} only scans the app package by default and the adapters
 * live in sibling packages.
 *
 * <p>Use cases are plain Java objects (no {@code @Service}) — Spring wires them via
 * {@code @Bean} here, keeping the application layer free of framework coupling.
 */
@Configuration
@ComponentScan(basePackages = {
        "de.botpilot.connectors.calendar.google.infrastructure.persistence",
        "de.botpilot.connectors.calendar.google.infrastructure.vault",
        "de.botpilot.connectors.calendar.google.rest"
})
public class GoogleCalendarConnectorConfiguration {

    @Value("${bot-pilot.google.oauth.client-id}")
    private String clientId;

    @Value("${bot-pilot.google.oauth.client-secret}")
    private String clientSecret;

    @Value("${bot-pilot.google.oauth.redirect-uri}")
    private String redirectUri;

    /**
     * Factory for Google OAuth2 authorization-code flows.
     * Credentials are externalised to application.properties — never hardcoded.
     */
    @Bean
    GoogleOAuthFlowFactory googleOAuthFlowFactory() {
        return new GoogleOAuthFlowFactory(clientId, clientSecret, redirectUri);
    }

    /**
     * Factory that builds a Google Calendar service from stored credentials.
     * Depends on the credential repository to load stored OAuth tokens.
     */
    @Bean
    GoogleCalendarClientFactory googleCalendarClientFactory(
            GoogleCalendarCredentialRepositoryAdapter credentialRepository) {
        return new GoogleCalendarClientFactory(credentialRepository);
    }

    /**
     * Binds the CalendarEventReader port to the Google Calendar freebusy adapter.
     * Swap this bean to point to an Outlook adapter when Outlook support is added.
     */
    @Bean
    CalendarEventReader calendarEventReader(GoogleCalendarClientFactory clientFactory) {
        return new GoogleCalendarEventReaderAdapter(clientFactory);
    }

    /**
     * Binds the CalendarEventWriter port to the Google Calendar events.insert adapter.
     */
    @Bean
    CalendarEventWriter calendarEventWriter(GoogleCalendarClientFactory clientFactory) {
        return new GoogleCalendarEventWriterAdapter(clientFactory);
    }

    /**
     * Read busy events use case — pure Java object, wired here.
     */
    @Bean
    ReadBusyEventsUseCase readBusyEventsUseCase(CalendarEventReader calendarEventReader) {
        return new ReadBusyEventsUseCase(calendarEventReader);
    }

    /**
     * Create calendar event use case — pure Java object, wired here.
     */
    @Bean
    CreateCalendarEventUseCase createCalendarEventUseCase(CalendarEventWriter calendarEventWriter) {
        return new CreateCalendarEventUseCase(calendarEventWriter);
    }
}
