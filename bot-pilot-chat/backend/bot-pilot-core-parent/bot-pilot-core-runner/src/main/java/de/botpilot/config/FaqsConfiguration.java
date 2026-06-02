package de.botpilot.config;

import de.botpilot.faqs.application.FindSimilarFaqUseCase;
import de.botpilot.faqs.domain.port.EmbeddingPort;
import de.botpilot.faqs.domain.port.FaqRepository;
import de.botpilot.faqs.domain.port.SimilaritySearchPort;
import de.botpilot.faqs.infrastructure.json.JsonFaqRepository;
import de.botpilot.faqs.infrastructure.nlp.DjlEmbeddingAdapter;
import de.botpilot.faqs.infrastructure.nlp.DjlSimilaritySearchAdapter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Wires ports to their adapters.
 *
 * <p>This is the "composition root" of the hexagonal architecture.  The only class in
 * the entire codebase that knows both ports (domain interfaces) and adapters (infra
 * implementations) simultaneously.  If you want to swap to a DB-backed FAQ repository,
 * you change exactly ONE line here — the {@code faqRepository()} bean method.  The use
 * case and the NLP adapter are completely unaware of the change.
 *
 * <p>Threshold is externalised to {@code application.properties} so it can be tuned
 * per-environment without recompilation.
 */
@Configuration
class FaqsConfiguration {

    @Value("${bot-pilot.faqs.similarity-threshold:0.7}")
    private double similarityThreshold;

    /**
     * Loads FAQs from the bundled classpath JSON.
     * Swap this bean for a JPA-backed implementation when the corpus moves to a database.
     */
    @Bean
    FaqRepository faqRepository() {
        return new JsonFaqRepository();
    }

    /**
     * DJL bi-encoder adapter.
     *
     * <p>The {@code faqRepository} is passed here so the adapter can pre-compute
     * FAQ embeddings during {@code @PostConstruct}.  This ensures the first real
     * HTTP request does not block on model warm-up.
     */
    @Bean
    EmbeddingPort embeddingPort(FaqRepository faqRepository) {
        return new DjlEmbeddingAdapter(faqRepository.findAll());
    }

    /**
     * Cross-encoder adapter (ONNX Runtime engine).
     * Receives the embedding port so it can fall back to cosine similarity
     * if the cross-encoder ONNX model is not in the DJL model zoo.
     */
    @Bean
    SimilaritySearchPort similaritySearchPort(EmbeddingPort embeddingPort) {
        return new DjlSimilaritySearchAdapter(embeddingPort);
    }

    /**
     * The use case — pure Java object, no Spring annotations needed.
     * Spring creates it here and injects it wherever required.
     */
    @Bean
    FindSimilarFaqUseCase findSimilarFaqUseCase(
            FaqRepository faqRepository,
            EmbeddingPort embeddingPort,
            SimilaritySearchPort similaritySearchPort
    ) {
        return new FindSimilarFaqUseCase(
                faqRepository, embeddingPort, similaritySearchPort, similarityThreshold);
    }
}
