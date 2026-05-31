package de.botpilot.faqs.domain.model;

import java.util.List;

/**
 * Immutable FAQ value object.
 *
 * <p>Using a record enforces immutability at the language level: all fields are final,
 * equals/hashCode/toString are generated, and there is no way to accidentally mutate
 * state after construction. This is exactly the right representation for data that
 * comes from a static source (JSON file or future DB row) and is only ever read.
 *
 * <p>The {@code tags} list is declared as {@code List<String>} rather than a mutable
 * collection. Callers should treat it as read-only; if defensive copying is required
 * later (e.g. when deserializing from an untrusted source), add it in the JSON adapter,
 * not here.
 */
public record Faq(
        int id,
        String question,
        String answer,
        String category,
        List<String> tags
) {}
