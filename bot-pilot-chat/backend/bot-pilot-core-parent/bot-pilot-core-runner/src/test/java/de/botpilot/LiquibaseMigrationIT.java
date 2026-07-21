package de.botpilot;

import de.botpilot.faqs.domain.port.EmbeddingPort;
import de.botpilot.faqs.domain.port.SimilaritySearchPort;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies that Liquibase actually runs at startup and that the schema it produces matches
 * the JPA entity mappings.
 *
 * <h2>Why this test exists</h2>
 * The Spring Boot 4 upgrade split auto-configuration into per-technology modules. A bare
 * {@code org.liquibase:liquibase-core} on the classpath no longer contributes the Liquibase
 * auto-configuration — the application starts perfectly cleanly and simply never migrates.
 * That is the worst class of regression: silent, invisible in a green build, and only
 * discovered when production drifts from the changelog. Asserting that the migration
 * genuinely ran is the only way to hold that guarantee.
 *
 * <h2>Why a real MariaDB, not H2</h2>
 * The changesets are native MariaDB DDL and the first one carries an
 * {@code information_schema} precondition. H2's MariaDB compatibility mode does not
 * faithfully reproduce either, so an H2-based test could pass while the real migration
 * fails — worse than no test. Testcontainers gives a real MariaDB that is created and
 * destroyed per run, so this never touches a database anyone cares about.
 *
 * <h2>Why it is an {@code *IT}</h2>
 * Failsafe runs this in the {@code integration-test} phase, so it needs a Docker daemon.
 * {@link ApplicationContextLoadTest} deliberately covers the wiring without Docker, which
 * keeps {@code mvn test} useful for anyone who does not have it.
 */
@SpringBootTest(properties = "spring.cloud.vault.enabled=false")
@ActiveProfiles("test")
@Testcontainers
class LiquibaseMigrationIT {

    /**
     * Pinned to an explicit MariaDB version rather than {@code latest} so the migration is
     * verified against a known engine — a floating tag turns an unrelated upstream release
     * into a mysterious CI failure.
     */
    @Container
    static final MariaDBContainer<?> MARIADB = new MariaDBContainer<>("mariadb:11.4");

    /** DJL model loading is out of scope here for the same reason as in the fast test. */
    @MockitoBean
    private EmbeddingPort embeddingPort;

    @MockitoBean
    private SimilaritySearchPort similaritySearchPort;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Points the context at the container and re-enables the two things the {@code test}
     * profile switches off. {@code @DynamicPropertySource} wins over the profile YAML, and
     * the JDBC URL is only knowable once the container has been assigned a random port.
     *
     * <p>{@code ddl-auto=validate} is the real assertion of this test: Hibernate compares
     * every entity mapping against the Liquibase-created schema and refuses to start on any
     * mismatch. A drifted column width or a renamed column fails the context here rather
     * than at runtime in production.
     */
    @DynamicPropertySource
    static void datasourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", MARIADB::getJdbcUrl);
        registry.add("spring.datasource.username", MARIADB::getUsername);
        registry.add("spring.datasource.password", MARIADB::getPassword);
        registry.add("spring.datasource.driver-class-name", () -> "org.mariadb.jdbc.Driver");
        registry.add("spring.liquibase.enabled", () -> "true");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
        registry.add("spring.jpa.database-platform", () -> "org.hibernate.dialect.MariaDBDialect");
    }

    /**
     * Proves the auto-configuration is present and executed. If the Boot 4 module split
     * regressed again, DATABASECHANGELOG would not exist and this query would throw.
     */
    @Test
    void liquibaseAppliedTheChangelog() {
        Integer appliedChangesets = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM DATABASECHANGELOG", Integer.class);

        assertThat(appliedChangesets)
                .as("Liquibase auto-configuration must run the changelog at startup")
                .isNotNull()
                .isPositive();
    }

    /**
     * Asserts the changesets produced the table the entity expects. Reaching this method at
     * all already means Hibernate's {@code validate} passed against the migrated schema.
     */
    @Test
    void migratedSchemaContainsTheGoogleCredentialsTable() {
        Integer tableCount = jdbcTemplate.queryForObject("""
                SELECT COUNT(*) FROM information_schema.tables
                WHERE table_schema = DATABASE() AND table_name = 'google_credentials'
                """, Integer.class);

        assertThat(tableCount)
                .as("changeset 0001 must create the google_credentials table")
                .isEqualTo(1);
    }
}
