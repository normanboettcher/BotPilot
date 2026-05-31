package de.botpilot.faqs.api;

import de.botpilot.faqs.application.FindSimilarFaqUseCase;
import de.botpilot.faqs.domain.model.BotResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Driving adapter — thin REST controller.
 *
 * <p>The controller's only responsibility is HTTP translation:
 * <ul>
 *   <li>Parse the incoming JSON request into a plain string (the user question).</li>
 *   <li>Delegate to the use case.</li>
 *   <li>Map the sealed {@link BotResponse} result to an HTTP response DTO + status code.</li>
 * </ul>
 * There is no business logic here.  All branching belongs in the use case.
 *
 * <p>Endpoint: {@code POST /api/faqs/search}
 * <pre>
 * Request:  { "question": "Was brauche ich für meine Steuererklärung?" }
 * Response (found):    200 { "answer": "...", "score": 0.852, "found": true }
 * Response (no match): 200 { "answer": "...", "score": null, "found": false }
 * </pre>
 */
@RestController
@RequestMapping("/api/faqs")
class FaqSearchController {

    private final FindSimilarFaqUseCase findSimilarFaqUseCase;

    FaqSearchController(FindSimilarFaqUseCase findSimilarFaqUseCase) {
        this.findSimilarFaqUseCase = findSimilarFaqUseCase;
    }

    @PostMapping("/search")
    ResponseEntity<FaqSearchResponse> search(@RequestBody FaqSearchRequest request) {
        BotResponse result = findSimilarFaqUseCase.find(request.question());
        return switch (result) {
            case BotResponse.Found(var answer, var score) ->
                    ResponseEntity.ok(new FaqSearchResponse(answer, score, true));
            case BotResponse.NoAnswerFound() ->
                    ResponseEntity.ok(new FaqSearchResponse(
                            BotResponse.NO_ANSWER_MESSAGE, null, false));
        };
    }

    // ---- Request / Response records ----

    /**
     * Deserialised from the incoming JSON body.
     *
     * <p>A record is used instead of a mutable POJO: Jackson (since 2.12) can
     * deserialize records using their canonical constructor, so no Lombok or
     * boilerplate getters/setters are needed.
     */
    record FaqSearchRequest(String question) {}

    /**
     * Serialised to the outgoing JSON body.
     *
     * <p>{@code score} is nullable: it is absent (serialised as {@code null}) when
     * no answer was found.  Using {@code Double} (boxed) instead of {@code double}
     * (primitive) allows Jackson to write {@code "score": null}.
     */
    record FaqSearchResponse(String answer, Double score, boolean found) {}
}
