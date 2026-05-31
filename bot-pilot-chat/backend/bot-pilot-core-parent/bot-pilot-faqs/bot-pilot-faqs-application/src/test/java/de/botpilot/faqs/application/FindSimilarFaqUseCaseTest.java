package de.botpilot.faqs.application;

import de.botpilot.faqs.domain.model.BotResponse;
import de.botpilot.faqs.domain.model.Faq;
import de.botpilot.faqs.domain.port.EmbeddingPort;
import de.botpilot.faqs.domain.port.FaqRepository;
import de.botpilot.faqs.domain.port.SimilaritySearchPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for the use-case orchestration logic.
 *
 * <p>All ports are mocked — no Spring context, no real NLP, no real file I/O.
 * This is intentional: the use case owns the control flow (threshold, argmax,
 * step ordering), which is exactly what we verify here.  The port implementations
 * are tested independently in their own modules.
 */
@ExtendWith(MockitoExtension.class)
class FindSimilarFaqUseCaseTest {

    @Mock FaqRepository faqRepository;
    @Mock EmbeddingPort embeddingPort;
    @Mock SimilaritySearchPort similaritySearchPort;

    private static final double THRESHOLD = 0.7;

    private FindSimilarFaqUseCase useCase;

    private static final Faq FAQ_STEUER = new Faq(
            1, "Was brauche ich für meine Steuererklärung?",
            "Sie benötigen Gehaltsabrechnungen...", "Steuern",
            List.of("Steuererklärung", "Unterlagen"));

    private static final Faq FAQ_TERMIN = new Faq(
            4, "Wie buche ich einen Termin?",
            "Nutzen Sie unser Kontaktformular.", "Organisation",
            List.of("Termin", "Kontakt"));

    private static final float[] DUMMY_USER_EMBEDDING = {0.1f, 0.2f, 0.3f};
    private static final float[][] DUMMY_FAQ_EMBEDDINGS = {{0.1f, 0.2f, 0.3f}, {0.4f, 0.5f, 0.6f}};

    @BeforeEach
    void setUp() {
        useCase = new FindSimilarFaqUseCase(
                faqRepository, embeddingPort, similaritySearchPort, THRESHOLD);
    }

    @Nested
    @DisplayName("Constructor validation")
    class ConstructorValidation {

        @Test
        @DisplayName("rejects threshold below 0")
        void rejectsThresholdBelowZero() {
            assertThrows(IllegalArgumentException.class, () ->
                    new FindSimilarFaqUseCase(faqRepository, embeddingPort, similaritySearchPort, -0.1));
        }

        @Test
        @DisplayName("rejects threshold above 1")
        void rejectsThresholdAboveOne() {
            assertThrows(IllegalArgumentException.class, () ->
                    new FindSimilarFaqUseCase(faqRepository, embeddingPort, similaritySearchPort, 1.1));
        }
    }

    @Nested
    @DisplayName("Input validation")
    class InputValidation {

        @Test
        @DisplayName("rejects null question")
        void rejectsNullQuestion() {
            assertThrows(IllegalArgumentException.class, () -> useCase.find(null));
        }

        @Test
        @DisplayName("rejects blank question")
        void rejectsBlankQuestion() {
            assertThrows(IllegalArgumentException.class, () -> useCase.find("   "));
        }

        @Test
        @DisplayName("rejects topK less than 1")
        void rejectsTopKLessThanOne() {
            assertThrows(IllegalArgumentException.class, () -> useCase.find("a question", 0));
        }
    }

    @Nested
    @DisplayName("Happy path: answer found")
    class AnswerFound {

        @BeforeEach
        void setupMocks() {
            when(faqRepository.findAll()).thenReturn(List.of(FAQ_STEUER, FAQ_TERMIN));
            when(embeddingPort.encode(any())).thenReturn(DUMMY_USER_EMBEDDING);
            when(embeddingPort.encodeAll(any())).thenReturn(DUMMY_FAQ_EMBEDDINGS);
            when(similaritySearchPort.retrieveCandidates(any(), any(), any(), anyInt()))
                    .thenReturn(List.of(FAQ_STEUER));
        }

        @Test
        @DisplayName("returns Found when cross-encoder score meets threshold")
        void returnsFoundWhenScoreMeetsThreshold() {
            when(similaritySearchPort.rerank(any(), any())).thenReturn(new float[]{0.85f});

            BotResponse response = useCase.find("Steuererklaerung Unterlagen");

            BotResponse.Found found = assertInstanceOf(BotResponse.Found.class, response);
            assertEquals(FAQ_STEUER.answer(), found.answer());
            assertEquals(0.85, found.score());
        }

        @Test
        @DisplayName("picks the candidate with the highest cross-encoder score (argmax)")
        void picksArgmax() {
            when(similaritySearchPort.retrieveCandidates(any(), any(), any(), anyInt()))
                    .thenReturn(List.of(FAQ_STEUER, FAQ_TERMIN));
            // Second candidate wins
            when(similaritySearchPort.rerank(any(), any())).thenReturn(new float[]{0.60f, 0.90f});

            BotResponse response = useCase.find("Termin buchen");

            BotResponse.Found found = assertInstanceOf(BotResponse.Found.class, response);
            assertEquals(FAQ_TERMIN.answer(), found.answer());
        }

        @Test
        @DisplayName("score is rounded to 3 decimal places")
        void scoreIsRoundedTo3DecimalPlaces() {
            when(similaritySearchPort.rerank(any(), any())).thenReturn(new float[]{0.85678f});

            BotResponse.Found found = assertInstanceOf(BotResponse.Found.class, useCase.find("Steuern"));
            // 0.85678 rounded to 3 d.p. = 0.857
            assertEquals(0.857, found.score());
        }
    }

    @Nested
    @DisplayName("No answer found paths")
    class NoAnswer {

        @Test
        @DisplayName("returns NoAnswerFound when score is below threshold")
        void returnsNoAnswerWhenScoreBelowThreshold() {
            when(faqRepository.findAll()).thenReturn(List.of(FAQ_STEUER));
            when(embeddingPort.encode(any())).thenReturn(DUMMY_USER_EMBEDDING);
            when(embeddingPort.encodeAll(any())).thenReturn(DUMMY_FAQ_EMBEDDINGS);
            when(similaritySearchPort.retrieveCandidates(any(), any(), any(), anyInt()))
                    .thenReturn(List.of(FAQ_STEUER));
            when(similaritySearchPort.rerank(any(), any())).thenReturn(new float[]{0.55f});

            assertInstanceOf(BotResponse.NoAnswerFound.class, useCase.find("unrelated query"));
        }

        @Test
        @DisplayName("returns NoAnswerFound immediately when FAQ corpus is empty")
        void returnsNoAnswerWhenFaqCorpusIsEmpty() {
            when(faqRepository.findAll()).thenReturn(List.of());
            when(embeddingPort.encode(any())).thenReturn(DUMMY_USER_EMBEDDING);

            assertInstanceOf(BotResponse.NoAnswerFound.class, useCase.find("any question"));
        }

        @Test
        @DisplayName("NoAnswerFound uses the singleton INSTANCE")
        void noAnswerFoundIsSingleton() {
            when(faqRepository.findAll()).thenReturn(List.of());
            when(embeddingPort.encode(any())).thenReturn(DUMMY_USER_EMBEDDING);

            BotResponse a = useCase.find("question a");
            BotResponse b = useCase.find("question b");
            assertSame(a, b);
        }
    }

    @Nested
    @DisplayName("Delegation to ports")
    class PortDelegation {

        @Test
        @DisplayName("candidate count is min(topK*5, corpus size)")
        void candidateCountIsCappedAtCorpusSize() {
            // corpus has 2 FAQs, topK=1 → wants 5 candidates → capped at 2
            when(faqRepository.findAll()).thenReturn(List.of(FAQ_STEUER, FAQ_TERMIN));
            when(embeddingPort.encode(any())).thenReturn(DUMMY_USER_EMBEDDING);
            when(embeddingPort.encodeAll(any())).thenReturn(DUMMY_FAQ_EMBEDDINGS);
            when(similaritySearchPort.retrieveCandidates(any(), any(), any(), eq(2)))
                    .thenReturn(List.of(FAQ_STEUER));
            when(similaritySearchPort.rerank(any(), any())).thenReturn(new float[]{0.9f});

            useCase.find("question", 1);

            verify(similaritySearchPort).retrieveCandidates(any(), any(), any(), eq(2));
        }

        @Test
        @DisplayName("passes raw question string to rerank, not an embedding")
        void passesRawQuestionToRerank() {
            when(faqRepository.findAll()).thenReturn(List.of(FAQ_STEUER));
            when(embeddingPort.encode(any())).thenReturn(DUMMY_USER_EMBEDDING);
            when(embeddingPort.encodeAll(any())).thenReturn(DUMMY_FAQ_EMBEDDINGS);
            when(similaritySearchPort.retrieveCandidates(any(), any(), any(), anyInt()))
                    .thenReturn(List.of(FAQ_STEUER));
            when(similaritySearchPort.rerank(any(), any())).thenReturn(new float[]{0.9f});

            String rawQuestion = "Steuererklärung fragen";
            useCase.find(rawQuestion);

            verify(similaritySearchPort).rerank(eq(rawQuestion), any());
        }
    }
}
