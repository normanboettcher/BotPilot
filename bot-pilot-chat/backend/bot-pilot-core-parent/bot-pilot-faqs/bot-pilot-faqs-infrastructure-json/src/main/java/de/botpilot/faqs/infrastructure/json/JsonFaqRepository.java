package de.botpilot.faqs.infrastructure.json;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.botpilot.faqs.domain.model.Faq;
import de.botpilot.faqs.domain.port.FaqRepository;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.Collections;
import java.util.List;

/**
 * {@link FaqRepository} adapter that loads FAQs from a bundled JSON file on the classpath.
 *
 * <p>The file {@code data/faqs.json} is loaded once at construction time and cached
 * for the lifetime of the bean.  This mirrors the Python module-level {@code _faqs}
 * cache, but is expressed as a final field (immutable after construction) rather than
 * a mutable global — which eliminates the need for a lock and is safe under concurrent
 * requests.
 *
 * <p>Why classpath resource instead of a file-system path?
 * The Python code configured {@code FAQ_DATA_PATH} via an environment variable pointing
 * to the filesystem.  Moving to a classpath resource means:
 * <ul>
 *   <li>The FAQs are packaged inside the JAR — no external volume mount needed.</li>
 *   <li>The data is always in sync with the code that interprets it.</li>
 *   <li>Integration tests load the same file without any env-var setup.</li>
 * </ul>
 * When the FAQ corpus moves to a database, this class is simply replaced with a
 * JPA-backed adapter — zero changes to domain or application code.
 *
 * <p>No Spring annotations here — the {@code @Bean} declaration lives in the assembler
 * ({@code bot-pilot-faqs-app}) to keep infrastructure adapters framework-agnostic
 * where possible.  If you need this to be a Spring bean directly, add {@code @Component}
 * and the Spring annotation processor will pick it up via component scanning.
 */
public class JsonFaqRepository implements FaqRepository {

    private static final String RESOURCE_PATH = "/data/faqs.json";

    private final List<Faq> faqs;

    public JsonFaqRepository() {
        this(RESOURCE_PATH);
    }

    /**
     * Package-private constructor for tests: allows injecting a custom classpath path.
     */
    JsonFaqRepository(String classpathResource) {
        this.faqs = loadFaqs(classpathResource);
    }

    @Override
    public List<Faq> findAll() {
        // faqs is already an unmodifiable list — no defensive copy needed
        return faqs;
    }

    private static List<Faq> loadFaqs(String classpathResource) {
        ObjectMapper mapper = new ObjectMapper();
        try (InputStream in = JsonFaqRepository.class.getResourceAsStream(classpathResource)) {
            if (in == null) {
                throw new IllegalStateException(
                        "FAQ data not found on classpath: " + classpathResource
                        + ". Ensure data/faqs.json is present in the resources directory.");
            }
            List<Faq> loaded = mapper.readValue(in, new TypeReference<>() {});
            return Collections.unmodifiableList(loaded);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to parse FAQ JSON from " + classpathResource, e);
        }
    }
}
