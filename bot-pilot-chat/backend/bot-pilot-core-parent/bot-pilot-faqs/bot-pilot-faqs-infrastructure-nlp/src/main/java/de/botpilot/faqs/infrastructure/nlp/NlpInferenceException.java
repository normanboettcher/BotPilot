package de.botpilot.faqs.infrastructure.nlp;

/**
 * Unchecked exception thrown when DJL model inference fails.
 *
 * <p>Wrapping the checked {@code TranslateException} in an unchecked type keeps the
 * port interfaces clean (no checked exceptions in the domain) while preserving the
 * original stack trace.  The REST layer maps this to an HTTP 503 response.
 */
public class NlpInferenceException extends RuntimeException {

    public NlpInferenceException(String message, Throwable cause) {
        super(message, cause);
    }
}
