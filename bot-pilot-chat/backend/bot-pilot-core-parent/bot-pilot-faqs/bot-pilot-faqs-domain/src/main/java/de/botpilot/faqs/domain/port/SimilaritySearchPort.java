package de.botpilot.faqs.domain.port;

import de.botpilot.faqs.domain.model.Faq;

import java.util.List;

/**
 * Driven port for the two-stage similarity ranking pipeline.
 *
 * <p>The application layer delegates the full ranking concern here rather than
 * orchestrating cosine-similarity math itself.  This keeps business logic (the
 * threshold decision, the FAQ selection) in the use case while deferring the
 * numeric heavy-lifting to the NLP infrastructure.
 *
 * <p>Stage 1 — Cosine similarity recall (bi-encoder): fast, approximate;
 *              retrieves a small candidate set.
 * Stage 2 — Cross-encoder re-ranking: slower, high-precision;
 *              refines the candidate set.
 *
 * <p>Why expose two separate methods?
 * The application layer calls them sequentially and applies the threshold after
 * re-ranking.  This matches the Python logic exactly and keeps the port surface
 * minimal: each method does exactly one thing.
 */
public interface SimilaritySearchPort {

    /**
     * Stage 1 — retrieve top candidates by cosine similarity (bi-encoder recall).
     *
     * @param userEmbedding  dense vector for the user query
     * @param faqEmbeddings  pre-computed embeddings for each FAQ question; index aligns with {@code faqs}
     * @param faqs           the full FAQ list; index aligns with {@code faqEmbeddings}
     * @param numCandidates  how many candidates to return (= topK * 5, capped at faqs.size())
     * @return the top-N candidate FAQs, ordered by cosine similarity descending
     */
    List<Faq> retrieveCandidates(
            float[] userEmbedding,
            float[][] faqEmbeddings,
            List<Faq> faqs,
            int numCandidates
    );

    /**
     * Stage 2 — re-rank candidates using a cross-encoder for higher precision.
     *
     * <p>The cross-encoder sees both the user question and each candidate question
     * together, which gives it richer interaction features than the independent
     * bi-encoder encodings.
     *
     * @param userQuestion    the raw user question string
     * @param candidates      the candidate FAQs from stage 1
     * @return scores in the same order as {@code candidates}; higher is better
     */
    float[] rerank(String userQuestion, List<Faq> candidates);
}
