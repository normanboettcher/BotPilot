package de.botpilot.connectors.calendar.google.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring Boot entry point for the Google Calendar connector microservice.
 *
 * <p>The {@code @SpringBootApplication} annotation triggers component scan of this
 * package and all sub-packages.  Because the controllers, adapters, and repositories
 * live in sibling packages (not sub-packages of this class), the assembler configuration
 * class {@link GoogleCalendarConnectorConfiguration} explicitly wires all beans.
 *
 * <p>Port-to-adapter bindings are declared in {@link GoogleCalendarConnectorConfiguration}.
 * This class contains no wiring logic — it is the launcher only.
 */
@SpringBootApplication
public class BotPilotGoogleCalendarConnectorApplication {

    public static void main(String[] args) {
        SpringApplication.run(BotPilotGoogleCalendarConnectorApplication.class, args);
    }
}
