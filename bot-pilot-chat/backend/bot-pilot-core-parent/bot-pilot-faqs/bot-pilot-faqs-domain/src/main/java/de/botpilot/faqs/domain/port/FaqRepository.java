package de.botpilot.faqs.domain.port;

import de.botpilot.faqs.domain.model.Faq;

import java.util.List;

/**
 * Driven port (output port) — the domain's contract for loading FAQs.
 *
 * <p>The domain and application layers depend <em>only on this interface</em>.
 * The concrete implementation lives in {@code bot-pilot-faqs-infrastructure-json}
 * (or a future DB adapter) and is injected at runtime by Spring.
 *
 * <p>Why not return a Stream or Optional?  The use case needs random access into the
 * result set (index lookup by position after cosine similarity ranking), so a
 * {@code List} is the honest return type.  If the FAQ corpus grows to millions of
 * entries we would need pagination, but that is premature here.
 */
public interface FaqRepository {

    /**
     * Returns all FAQs from the backing store.
     * Implementations may cache aggressively — the corpus changes rarely.
     *
     * @return immutable or unmodifiable list of all FAQs; never null; may be empty
     */
    List<Faq> findAll();
}
