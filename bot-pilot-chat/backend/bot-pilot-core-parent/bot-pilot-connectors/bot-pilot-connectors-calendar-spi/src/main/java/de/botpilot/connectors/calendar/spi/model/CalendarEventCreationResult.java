package de.botpilot.connectors.calendar.spi.model;

/**
 * Sealed result type for a calendar event creation attempt.
 *
 * <p>Mirrors the Python {@code CalendarEventCreationResult} dataclass, but using a
 * sealed hierarchy instead of a boolean flag + nullable message field.  This makes
 * the two outcomes structurally distinct and forces callers to handle both branches
 * via pattern-matching switch — exactly like {@code BotResponse} in the faqs module.
 *
 * <p>Callers use pattern-matching switch:
 * <pre>{@code
 * switch (result) {
 *     case CalendarEventCreationResult.Success()              -> // event created
 *     case CalendarEventCreationResult.Failure(var msg)       -> // handle error
 * }
 * }</pre>
 */
public sealed interface CalendarEventCreationResult {

    /** The event was created successfully. */
    record Success() implements CalendarEventCreationResult {
        /** Convenience singleton — Success carries no data. */
        public static final Success INSTANCE = new Success();
    }

    /**
     * The event creation failed.
     *
     * @param errorMessage human-readable description of what went wrong
     */
    record Failure(String errorMessage) implements CalendarEventCreationResult {
        public Failure {
            if (errorMessage == null || errorMessage.isBlank()) {
                throw new IllegalArgumentException("Failure errorMessage must not be blank");
            }
        }
    }

    // --- Static factory methods for readability at call sites ---

    static CalendarEventCreationResult success() {
        return Success.INSTANCE;
    }

    static CalendarEventCreationResult failure(String errorMessage) {
        return new Failure(errorMessage);
    }
}
