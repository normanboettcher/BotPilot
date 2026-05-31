package de.botpilot.faqs.domain.model;

/**
 * Sealed result type for an FAQ lookup.
 *
 * <p>Why sealed + records instead of a single class with nullable fields?
 * The Python original used a single {@code BotResponse} dataclass with a nullable
 * {@code score} field and a boolean {@code success} flag.  That pattern forces every
 * caller to null-check and to know the invariant "score is null iff success is false".
 * A sealed hierarchy makes the two states <em>structurally distinct</em>: the compiler
 * forces you to handle both cases in a switch expression, and neither state can be
 * misused (you cannot call {@code .score()} on a {@code NoAnswerFound}).
 *
 * <p>Callers use pattern-matching switch:
 * <pre>{@code
 * switch (response) {
 *     case BotResponse.Found(var answer, var score) -> ...
 *     case BotResponse.NoAnswerFound()              -> ...
 * }
 * }</pre>
 */
public sealed interface BotResponse {

    /** The German "not found" message mirrors the Python {@code BotResponse.no_answer_found()} text. */
    String NO_ANSWER_MESSAGE =
            "Zu dieser Anfrage konnte ich leider keine passende Antwort finden.\n"
            + "Bitte formulieren Sie Ihre Frage anders.";

    /**
     * A match was found with a similarity score at or above the configured threshold.
     *
     * @param answer the FAQ answer text
     * @param score  the cross-encoder score, rounded to 3 decimal places
     */
    record Found(String answer, double score) implements BotResponse {}

    /**
     * No FAQ matched the query above the configured threshold.
     */
    record NoAnswerFound() implements BotResponse {
        /** Convenience singleton — {@code NoAnswerFound} carries no data. */
        public static final NoAnswerFound INSTANCE = new NoAnswerFound();
    }

    // --- Static factory methods for readability at call sites ---

    static BotResponse found(String answer, double score) {
        return new Found(answer, score);
    }

    static BotResponse noAnswerFound() {
        return NoAnswerFound.INSTANCE;
    }
}
