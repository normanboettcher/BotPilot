package de.botpilot.connectors.calendar.google.rest;

import de.botpilot.connectors.calendar.google.application.CreateCalendarEventUseCase;
import de.botpilot.connectors.calendar.google.application.ReadBusyEventsUseCase;
import de.botpilot.connectors.calendar.spi.exception.NotAuthenticatedException;
import de.botpilot.connectors.calendar.spi.model.BusyEvent;
import de.botpilot.connectors.calendar.spi.model.BusyEventsResponse;
import de.botpilot.connectors.calendar.spi.model.CalendarEvent;
import de.botpilot.connectors.calendar.spi.model.CalendarEventCreationResult;
import de.botpilot.connectors.calendar.spi.model.EventAttendee;
import de.botpilot.connectors.calendar.spi.model.EventTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Driving adapter: REST interface for Google Calendar operations.
 *
 * <p>Mirrors the Python {@code /calendar/google/events/busy} and
 * {@code /calendar/google/events/create} endpoints.  The controller's only
 * responsibility is HTTP translation — no business logic.
 *
 * <p>Pattern-matching switch on the sealed {@link CalendarEventCreationResult} makes
 * every outcome explicit at compile time, exactly as {@code FaqSearchController} does
 * with {@code BotResponse}.
 *
 * <p>Endpoints:
 * <pre>
 * GET  /calendar/google/events/busy?next_days=N  → BusyEventsResponse (200) or 401
 * POST /calendar/google/events/create            → CalendarEventCreationResponse (200/500)
 * </pre>
 */
@RestController
@RequestMapping("/calendar/google")
class CalendarController {

    private static final Logger log = LoggerFactory.getLogger(CalendarController.class);

    private final ReadBusyEventsUseCase readBusyEventsUseCase;
    private final CreateCalendarEventUseCase createCalendarEventUseCase;

    CalendarController(
            ReadBusyEventsUseCase readBusyEventsUseCase,
            CreateCalendarEventUseCase createCalendarEventUseCase
    ) {
        this.readBusyEventsUseCase = readBusyEventsUseCase;
        this.createCalendarEventUseCase = createCalendarEventUseCase;
    }

    /**
     * Returns busy time slots for the next N days.
     *
     * <p>Mirrors Python: {@code GET /calendar/google/events/busy?next_days=N}
     *
     * @param nextDays number of days to query ahead (default 90)
     * @param customerContext identifies the customer; defaults to "default" for backwards compat
     */
    @GetMapping("/events/busy")
    ResponseEntity<?> getBusyEvents(
            @RequestParam(defaultValue = "90") int nextDays,
            @RequestParam(defaultValue = "default") String customerContext
    ) {
        try {
            List<BusyEvent> busyEvents = readBusyEventsUseCase.execute(customerContext, nextDays);
            return ResponseEntity.ok(new BusyEventsResponse(nextDays, busyEvents));
        } catch (NotAuthenticatedException e) {
            log.warn("Not authenticated for context [{}]", customerContext);
            return ResponseEntity.status(401)
                    .body(new ErrorResponse("failed", "Not authenticated.", "401"));
        } catch (Exception e) {
            log.error("Unexpected error reading busy events for context [{}]: {}",
                    customerContext, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(new ErrorResponse("failed",
                            "Unexpected error reading busy events for [" + nextDays + "] days: "
                            + e.getMessage(),
                            "500"));
        }
    }

    /**
     * Creates a new calendar event.
     *
     * <p>Mirrors Python: {@code POST /calendar/google/events/create}
     * Uses pattern-matching switch on the sealed result type — no instanceof checks.
     */
    @PostMapping("/events/create")
    ResponseEntity<CalendarEventCreationResponse> createEvent(
            @RequestBody CreateCalendarEventRequest request
    ) {
        CalendarEvent event = toSpiModel(request);
        CalendarEventCreationResult result =
                createCalendarEventUseCase.execute(event, request.customerContext());

        return switch (result) {
            case CalendarEventCreationResult.Success() ->
                    ResponseEntity.ok(new CalendarEventCreationResponse(
                            "ok", "event successfully created", "200", true));
            case CalendarEventCreationResult.Failure(var msg) -> {
                log.warn("Event creation failed for context [{}]: {}", request.customerContext(), msg);
                yield ResponseEntity.internalServerError()
                        .body(new CalendarEventCreationResponse("failure", msg, "500", false));
            }
        };
    }

    // ---- Request / Response records ----

    /**
     * Request body for event creation.  Mirrors the Python
     * {@code CreateGoogleCalendarEventRequest} dataclass.
     */
    record CreateCalendarEventRequest(
            String customerContext,
            String summary,
            EventTimeDto start,
            EventTimeDto end,
            String description,
            List<AttendeeDto> attendees
    ) {}

    record EventTimeDto(String dateTime, String timeZone) {}

    record AttendeeDto(String email) {}

    record CalendarEventCreationResponse(
            String status,
            String message,
            String statusCode,
            boolean success
    ) {}

    record ErrorResponse(String status, String message, String statusCode) {}

    private CalendarEvent toSpiModel(CreateCalendarEventRequest req) {
        EventTime start = new EventTime(req.start().dateTime(), req.start().timeZone());
        EventTime end = new EventTime(req.end().dateTime(), req.end().timeZone());
        List<EventAttendee> attendees = req.attendees() == null
                ? List.of()
                : req.attendees().stream()
                        .map(a -> new EventAttendee(a.email()))
                        .toList();
        return new CalendarEvent(req.summary(), start, end, req.description(), attendees);
    }
}
