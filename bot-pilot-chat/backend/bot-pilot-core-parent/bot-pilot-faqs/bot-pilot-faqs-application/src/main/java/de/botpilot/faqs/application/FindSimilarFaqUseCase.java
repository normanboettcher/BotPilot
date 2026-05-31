package de.botpilot.faqs.application;

import de.botpilot.faqs.domain.model.BotResponse;
import de.botpilot.faqs.domain.model.Faq;
import de.botpilot.faqs.domain.port.EmbeddingPort;
import de.botpilot.faqs.domain.port.FaqRepository;
import de.botpilot.faqs.domain.port.SimilaritySearchPort;

import java.util.List;

/**
 * The single use case in this microservice: find the FAQ most similar to a user question.
 *
 * <p>This class owns the business logic for the two-phase retrieval pipeline:
 * <ol>
 *   <li>Encode the user question into a dense vector (bi-encoder).</li>
 *   <li>Retrieve pre-computed FAQ embeddings (lazily initialised, cached by {@link EmbeddingPort}).</li>
 *   <li>Recall the top N candidates by cosine similarity.</li>
 *   <li>Re-rank those candidates with a cross-encoder for higher precision.</li>
 *   <li>Return the best match if its score meets the threshold, otherwise no-answer.</li>
 * </ol>
 *
 * <p>Why the two-phase approach?
 * The bi-encoder (MiniLM-L6-v2) encodes each text independently, making it fast enough
 * to compare against all FAQ embeddings in a single matrix multiply.  But because it
 * encodes question and FAQ separately, it misses fine-grained token interactions.
 * The cross-encoder (stsb-roberta-base) sees both texts together, capturing those
 * interactions — but it is too slow to run against all FAQs.  Combining them gives
 * us recall speed + re-ranking precision, exactly the trade-off the Python code made.
 *
 * <p>This class has no Spring annotations — it is a pure Java object.  The Spring
 * {@code @Service} is added in the assembler module ({@code bot-pilot-faqs-app}) to
 * keep framework coupling out of the application layer.  This makes the use case
 * trivially testable with plain Mockito without starting a Spring context.
 */
public class FindSimilarFaqUseCase {

    /** Number of bi-encoder candidates to retrieve per top-k result requested. */
    private static final int CANDIDATE_MULTIPLIER = 5;

    private final FaqRepository faqRepository;
    private final EmbeddingPort embeddingPort;
    private final SimilaritySearchPort similaritySearchPort;
    private final double threshold;

    /**
     * @param faqRepository       loads the FAQ corpus
     * @param embeddingPort       encodes text to dense vectors
     * @param similaritySearchPort performs cosine recall + cross-encoder re-rank
     * @param threshold           minimum cross-encoder score to return a match (Python default: 0.7)
     */
    public FindSimilarFaqUseCase(
            FaqRepository faqRepository,
            EmbeddingPort embeddingPort,
            SimilaritySearchPort similaritySearchPort,
            double threshold
    ) {
        if (threshold < 0.0 || threshold > 1.0) {
            throw new IllegalArgumentException(
                    "threshold must be in [0.0, 1.0] but was: " + threshold);
        }
        this.faqRepository = faqRepository;
        this.embeddingPort = embeddingPort;
        this.similaritySearchPort = similaritySearchPort;
        this.threshold = threshold;
    }

    /**
     * Finds the FAQ most similar to the user's question.
     *
     * @param userQuestion the raw user question; must not be blank
     * @param topK         how many top results to consider in the recall phase (usually 1)
     * @return {@link BotResponse.Found} if a match above threshold was found,
     *         {@link BotResponse.NoAnswerFound} otherwise
     */
    public BotResponse find(String userQuestion, int topK) {
        if (userQuestion == null || userQuestion.isBlank()) {
            throw new IllegalArgumentException("userQuestion must not be blank");
        }
        if (topK < 1) {
            throw new IllegalArgumentException("topK must be >= 1 but was: " + topK);
        }

        // Step 1: Encode the user question into a dense vector.
        float[] userEmbedding = embeddingPort.encode(userQuestion);

        // Step 2: Load all FAQs and their pre-computed embeddings.
        // Both calls are cheap after warm-up: the repository and embedding port
        // both cache their results on first access.
        List<Faq> allFaqs = faqRepository.findAll();
        if (allFaqs.isEmpty()) {
            return BotResponse.noAnswerFound();
        }
        float[][] faqEmbeddings = embeddingPort.encodeAll(allFaqs);

        // Step 3: Recall phase — retrieve top (topK * CANDIDATE_MULTIPLIER) candidates
        // by cosine similarity.  The multiplier gives the cross-encoder enough material
        // to re-rank without running it over the entire corpus.
        int numCandidates = Math.min(topK * CANDIDATE_MULTIPLIER, allFaqs.size());
        List<Faq> candidates = similaritySearchPort.retrieveCandidates(
                userEmbedding, faqEmbeddings, allFaqs, numCandidates);

        // Step 4: Re-rank phase — cross-encoder scores all (question, candidate) pairs.
        float[] crossScores = similaritySearchPort.rerank(userQuestion, candidates);

        // Step 5: Find the best match and apply the threshold.
        int bestIdx = argmax(crossScores);
        double bestScore = Math.round(crossScores[bestIdx] * 1000.0) / 1000.0;  // 3 d.p.

        if (bestScore >= threshold) {
            String answer = candidates.get(bestIdx).answer();
            return BotResponse.found(answer, bestScore);
        }
        return BotResponse.noAnswerFound();
    }

    /** Convenience overload using the default topK=1 (mirrors Python default). */
    public BotResponse find(String userQuestion) {
        return find(userQuestion, 1);
    }

    // ---- private helpers ----

    private static int argmax(float[] scores) {
        int best = 0;
        for (int i = 1; i < scores.length; i++) {
            if (scores[i] > scores[best]) {
                best = i;
            }
        }
        return best;
    }
}
