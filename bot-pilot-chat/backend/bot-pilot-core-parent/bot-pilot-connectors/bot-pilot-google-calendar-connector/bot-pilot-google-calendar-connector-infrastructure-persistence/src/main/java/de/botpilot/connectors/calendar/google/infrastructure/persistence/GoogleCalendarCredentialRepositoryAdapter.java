package de.botpilot.connectors.calendar.google.infrastructure.persistence;

import de.botpilot.connectors.calendar.google.domain.GoogleCalendarCredentials;
import de.botpilot.connectors.calendar.spi.port.CredentialRepository;
import org.springframework.stereotype.Repository;

/**
 * Driven adapter: implements the {@link CredentialRepository} port using Spring Data JPA.
 *
 * <p>This class is the bridge between the domain port interface and the JPA persistence
 * mechanism.  The application layer and use cases only see {@code CredentialRepository<GoogleCalendarCredentials>};
 * they never import Spring Data types.
 *
 * <p>The {@code save} method uses {@link GoogleCalendarCredentialsJpaRepository#save}
 * which performs an upsert (merge semantics) — matching the Python {@code session.merge(entry)}.
 *
 * <p>The {@code @Repository} annotation here tells Spring to create this bean and also
 * enables translation of JPA exceptions into Spring's DataAccessException hierarchy,
 * which gives the REST layer consistent error handling without coupling to JPA.
 */
@Repository
public class GoogleCalendarCredentialRepositoryAdapter
        implements CredentialRepository<GoogleCalendarCredentials> {

    private final GoogleCalendarCredentialsJpaRepository jpaRepository;

    public GoogleCalendarCredentialRepositoryAdapter(
            GoogleCalendarCredentialsJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    /**
     * Persists credentials (insert or update by primary key).
     *
     * <p>Spring Data's {@code save} delegates to {@code persist} for new entities
     * and {@code merge} for existing ones (detected by whether the ID field has a value).
     * This matches the Python {@code session.merge(entry)} upsert behaviour.
     */
    @Override
    public void save(GoogleCalendarCredentials credentials, String customerContext) {
        jpaRepository.save(credentials);
    }

    /**
     * Finds credentials by customer context.  Returns {@code null} (not Optional) to
     * match the {@link CredentialRepository} port contract and keep the application layer
     * free of Spring Data types.
     */
    @Override
    public GoogleCalendarCredentials findByCustomerContext(String customerContext) {
        return jpaRepository.findByCustomerContext(customerContext).orElse(null);
    }
}
