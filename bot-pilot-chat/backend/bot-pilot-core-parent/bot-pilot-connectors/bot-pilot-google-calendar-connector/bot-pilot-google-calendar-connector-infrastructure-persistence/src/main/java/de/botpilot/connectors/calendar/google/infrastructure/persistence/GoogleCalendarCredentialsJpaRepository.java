package de.botpilot.connectors.calendar.google.infrastructure.persistence;

import de.botpilot.connectors.calendar.google.domain.GoogleCalendarCredentials;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Spring Data JPA repository for {@link GoogleCalendarCredentials}.
 *
 * <p>Spring Data generates the implementation at startup.  This interface is package-private
 * — external code goes through {@link GoogleCalendarCredentialRepositoryAdapter} which
 * implements the {@code CredentialRepository} port.  This prevents the JPA repository
 * from leaking into the application layer.
 */
interface GoogleCalendarCredentialsJpaRepository
        extends JpaRepository<GoogleCalendarCredentials, String> {

    /**
     * Finds the credentials row whose {@code customer_context} column matches.
     *
     * <p>Named-query derivation: Spring Data translates
     * {@code findByCustomerContext} to {@code WHERE customer_context = ?1}.
     */
    Optional<GoogleCalendarCredentials> findByCustomerContext(String customerContext);
}
