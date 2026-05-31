package de.botpilot.faqs.infrastructure.json;

import de.botpilot.faqs.domain.model.Faq;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Integration test for {@link JsonFaqRepository}.
 *
 * <p>"Integration" here means we actually read from the real {@code data/faqs.json}
 * classpath resource — this validates that the JSON structure matches the {@link Faq}
 * record fields.  No mocks are involved.  This is the right level to test an adapter:
 * verify it correctly bridges between the external format (JSON) and the domain model.
 */
class JsonFaqRepositoryTest {

    private final JsonFaqRepository repository = new JsonFaqRepository();

    @Test
    @DisplayName("loads all 20 FAQs from the classpath resource")
    void loadsAllFaqs() {
        assertEquals(20, repository.findAll().size());
    }

    @Test
    @DisplayName("first FAQ has expected German content")
    void firstFaqHasExpectedContent() {
        Faq first = repository.findAll().getFirst();

        assertEquals(1, first.id());
        assertEquals("Was brauche ich für meine Steuererklärung?", first.question());
        assertEquals("Steuern", first.category());
        assertEquals(List.of("Steuererklärung", "Unterlagen", "Belege"), first.tags());
        assertFalse(first.answer().isBlank());
    }

    @Test
    @DisplayName("every FAQ has a non-blank question and answer")
    void everyFaqHasQuestionAndAnswer() {
        for (Faq faq : repository.findAll()) {
            assertFalse(faq.question().isBlank(),
                    "id=" + faq.id() + " question must not be blank");
            assertFalse(faq.answer().isBlank(),
                    "id=" + faq.id() + " answer must not be blank");
        }
    }

    @Test
    @DisplayName("findAll returns the same list instance on repeated calls (caching)")
    void findAllReturnsCachedList() {
        List<Faq> first = repository.findAll();
        List<Faq> second = repository.findAll();
        assertSame(first, second);
    }

    @Test
    @DisplayName("returned list is unmodifiable")
    void returnedListIsUnmodifiable() {
        List<Faq> faqs = repository.findAll();
        assertThrows(UnsupportedOperationException.class, () ->
                faqs.add(new Faq(99, "test", "answer", "cat", List.of())));
    }

    @Test
    @DisplayName("throws IllegalStateException when resource is not on classpath")
    void throwsWhenResourceMissing() {
        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                new JsonFaqRepository("/data/does-not-exist.json"));
        assertTrue(ex.getMessage().contains("FAQ data not found on classpath"),
                "Expected message about missing classpath resource");
    }

    @Test
    @DisplayName("all FAQ ids are positive")
    void allIdsArePositive() {
        for (Faq faq : repository.findAll()) {
            assertTrue(faq.id() > 0, "id must be positive but was: " + faq.id());
        }
    }
}
