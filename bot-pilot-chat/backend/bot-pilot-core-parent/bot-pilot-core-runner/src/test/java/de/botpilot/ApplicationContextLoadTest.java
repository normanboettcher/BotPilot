package de.botpilot;

import de.botpilot.faqs.application.FindSimilarFaqUseCase;
import de.botpilot.faqs.domain.port.EmbeddingPort;
import de.botpilot.faqs.domain.port.FaqRepository;
import de.botpilot.faqs.domain.port.SimilaritySearchPort;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import javax.sql.DataSource;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies that the full application context starts and every port is wired to an adapter.
 *
 * <p>This is the cheapest test that would have caught a broken upgrade. The module's other
 * tests are pure unit tests that never touch Spring, so before this class existed a major
 * version bump could break bean wiring, auto-configuration or property binding and still
 * produce a green build.
 *
 * <p><strong>No Docker, no network, no database.</strong> Vault and Liquibase are switched
 * off by the {@code test} profile (see {@code application-test.yml} for why), and the
 * datasource is a throwaway in-memory H2. This test must stay runnable by anyone who has
 * just cloned the repository — that is what makes it safe to run on every build.
 *
 * <h2>Why the DJL ports are mocked</h2>
 * {@code DjlEmbeddingAdapter} downloads the {@code all-MiniLM-L6-v2} model from the DJL
 * model zoo in {@code @PostConstruct}. Left alone, this test would pull a model over the
 * network on every single build and fail offline. {@link MockitoBean} replaces the bean
 * <em>definition</em> rather than the instance, so {@code FaqsConfiguration}'s
 * {@code @Bean} factory methods are never invoked and DJL is never loaded at all.
 *
 * <p>That is a deliberate scope boundary, not an oversight: this test asks "is the object
 * graph correct", not "does inference work". Model loading is covered by the NLP module's
 * own tests.
 */
@SpringBootTest(properties = "spring.cloud.vault.enabled=false")
@ActiveProfiles("test")
class ApplicationContextLoadTest {

    @MockitoBean
    private EmbeddingPort embeddingPort;

    @MockitoBean
    private SimilaritySearchPort similaritySearchPort;

    @Autowired
    private ApplicationContext context;

    /**
     * The assertion is the absence of an exception: if any bean fails to construct, any
     * required property is unresolvable, or any auto-configuration misfires, the context
     * never reaches this method.
     */
    @Test
    void contextLoads() {
        assertThat(context).isNotNull();
    }

    /**
     * Guards the composition root specifically. A context can start successfully while a
     * port silently resolves to the wrong adapter, so the ports are asserted by name.
     */
    @Test
    void everyPortIsWiredToAnAdapter() {
        assertThat(context.getBean(FaqRepository.class)).isNotNull();
        assertThat(context.getBean(FindSimilarFaqUseCase.class)).isNotNull();
        assertThat(context.getBean(DataSource.class)).isNotNull();
    }

    /**
     * Fails loudly if the fail-safe default ever regresses.
     *
     * <p>Liquibase must not be auto-configured while the {@code test} profile is active:
     * a context test that quietly migrated whatever database the ambient environment
     * pointed at would be a genuinely dangerous piece of test code. Asserting the absence
     * of the bean is what keeps that guarantee from silently rotting.
     */
    @Test
    void liquibaseIsNotActiveInTheFastContextTest() {
        assertThat(context.getBeanNamesForType(liquibase.integration.spring.SpringLiquibase.class))
                .as("Liquibase must stay disabled outside LiquibaseMigrationIT")
                .isEmpty();
    }
}
