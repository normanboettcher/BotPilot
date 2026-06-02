package de.botpilot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * Spring Boot entry point for the bot-pilot-core microservice.
 *
 * <p>The {@code @SpringBootApplication} annotation triggers component scan of this
 * package and all sub-packages.
 */
@SpringBootApplication
public class BotPilotCoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(BotPilotCoreApplication.class, args);
    }
}
