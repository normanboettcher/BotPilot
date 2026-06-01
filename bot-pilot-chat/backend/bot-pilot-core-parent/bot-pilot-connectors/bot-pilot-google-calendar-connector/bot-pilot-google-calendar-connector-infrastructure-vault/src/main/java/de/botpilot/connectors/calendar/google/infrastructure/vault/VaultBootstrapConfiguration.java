package de.botpilot.connectors.calendar.google.infrastructure.vault;

import org.springframework.context.annotation.Configuration;

/**
 * Marker configuration class for the Vault infrastructure module.
 *
 * <p>Spring Cloud Vault is activated via {@code bootstrap.properties} / {@code application.properties}
 * properties and does NOT require explicit Java configuration to function.  The actual
 * Vault integration (AppRole authentication, dynamic DB credential injection) is driven
 * entirely by the spring.cloud.vault.* property namespace that Spring Cloud Vault reads
 * during the bootstrap phase.
 *
 * <p>This class exists as an explicit documentation point and to ensure the module is
 * scannable by Spring's component scan without needing any beans defined here.
 *
 * <p>Key properties (configured in the app module's application.properties):
 * <ul>
 *   <li>{@code spring.cloud.vault.uri} — from env VAULT_ADDR</li>
 *   <li>{@code spring.cloud.vault.authentication=APPROLE}</li>
 *   <li>{@code spring.cloud.vault.app-role.role-id} — from env CONNECTORS_VAULT_APP_ROLE_ID</li>
 *   <li>{@code spring.cloud.vault.app-role.secret-id-mechanism=FILE}</li>
 *   <li>{@code spring.cloud.vault.app-role.secret-id} — path /run/secrets/bot-connectors-secret-id</li>
 *   <li>{@code spring.cloud.vault.database.role} — bot-connectors-calendar-role</li>
 * </ul>
 */
@Configuration
public class VaultBootstrapConfiguration {
    // Spring Cloud Vault configuration is entirely property-driven.
    // See the app module's application.properties for the full configuration.
}
