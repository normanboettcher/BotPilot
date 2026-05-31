package de.botpilot.faqs.domain.port;

import de.botpilot.faqs.domain.model.Faq;

import java.util.List;

/**
 * Driven port for computing dense vector embeddings.
 *
 * <p>The application layer calls this port to encode a user question into a float
 * array and to pre-compute embeddings for all FAQ questions (the cache warm-up).
 * The concrete implementation in {@code bot-pilot-faqs-infrastructure-nlp} uses
 * DJL with the {@code all-MiniLM-L6-v2} bi-encoder model.
 *
 * <p>Why a separate port from {@link SimilaritySearchPort}?
 * Embedding and similarity search are two distinct concerns:
 * <ul>
 *   <li>Embedding converts text → vector (computationally cheap for individual inputs,
 *       but could be batched, streamed, or delegated to a remote embedding API).</li>
 *   <li>Similarity search operates on pre-computed vectors (could be replaced by an
 *       ANN index like FAISS or Weaviate without touching the embedding logic).</li>
 * </ul>
 * Separating them respects SRP and lets us swap either side independently.
 */
public interface EmbeddingPort {

    /**
     * Encodes a single text into a dense float vector.
     *
     * @param text the text to encode; must not be null or empty
     * @return a float array of fixed dimensionality (384 for MiniLM-L6-v2)
     */
    float[] encode(String text);

    /**
     * Encodes all FAQ questions in a single batched call for efficiency.
     * Implementations should cache the result and return the cached value
     * on subsequent calls (the corpus does not change at runtime).
     *
     * @param faqs the FAQ list to encode questions for; must not be null or empty
     * @return a 2D array of shape [faqs.size()][embeddingDim]
     */
    float[][] encodeAll(List<Faq> faqs);
}
