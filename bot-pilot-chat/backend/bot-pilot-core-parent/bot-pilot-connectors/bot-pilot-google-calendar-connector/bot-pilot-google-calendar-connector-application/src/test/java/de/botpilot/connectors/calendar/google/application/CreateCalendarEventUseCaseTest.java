package de.botpilot.connectors.calendar.google.application;

import de.botpilot.connectors.calendar.spi.exception.NotAuthenticatedException;
import de.botpilot.connectors.calendar.spi.model.CalendarEvent;
import de.botpilot.connectors.calendar.spi.model.CalendarEventCreationResult;
import de.botpilot.connectors.calendar.spi.model.EventTime;
import de.botpilot.connectors.calendar.spi.port.CalendarEventWriter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link CreateCalendarEventUseCase}.
 *
 * <p>All ports are mocked.  The use case owns input validation and delegation;
 * it does not interpret or transform the result — those are tested here.
 */
@ExtendWith(MockitoExtension.class)
class CreateCalendarEventUseCaseTest {

    @Mock
    CalendarEventWriter calendarEventWriter;

    private CreateCalendarEventUseCase useCase;

    private static final CalendarEvent SAMPLE_EVENT = new CalendarEvent(
            "Team standup",
            new EventTime("2024-03-15T09:00:00Z", "UTC"),
            new EventTime("2024-03-15T09:30:00Z", "UTC"),
            "Daily sync",
            List.of()
    );

    @BeforeEach
    void setUp() {
        useCase = new CreateCalendarEventUseCase(calendarEventWriter);
    }

    @Nested
    @DisplayName("Constructor validation")
    class ConstructorValidation {

        @Test
        @DisplayName("rejects null calendarEventWriter")
        void rejectsNullWriter() {
            assertThrows(IllegalArgumentException.class,
                    () -> new CreateCalendarEventUseCase(null));
        }
    }

    @Nested
    @DisplayName("Input validation")
    class InputValidation {

        @Test
        @DisplayName("rejects null event")
        void rejectsNullEvent() {
            assertThrows(IllegalArgumentException.class,
                    () -> useCase.execute(null, "default"));
        }

        @Test
        @DisplayName("rejects null customerContext")
        void rejectsNullContext() {
            assertThrows(IllegalArgumentException.class,
                    () -> useCase.execute(SAMPLE_EVENT, null));
        }

        @Test
        @DisplayName("rejects blank customerContext")
        void rejectsBlankContext() {
            assertThrows(IllegalArgumentException.class,
                    () -> useCase.execute(SAMPLE_EVENT, "  "));
        }
    }

    @Nested
    @DisplayName("Happy path: event created")
    class EventCreated {

        @Test
        @DisplayName("returns Success when port succeeds")
        void returnsSuccessFromPort() {
            when(calendarEventWriter.createEvent(any(), any()))
                    .thenReturn(CalendarEventCreationResult.success());

            CalendarEventCreationResult result = useCase.execute(SAMPLE_EVENT, "default");

            assertInstanceOf(CalendarEventCreationResult.Success.class, result);
        }

        @Test
        @DisplayName("Success uses the singleton INSTANCE")
        void successIsSingleton() {
            when(calendarEventWriter.createEvent(any(), any()))
                    .thenReturn(CalendarEventCreationResult.success());

            CalendarEventCreationResult a = useCase.execute(SAMPLE_EVENT, "ctx-a");
            CalendarEventCreationResult b = useCase.execute(SAMPLE_EVENT, "ctx-b");

            assertSame(a, b);
        }
    }

    @Nested
    @DisplayName("Failure path")
    class CreationFailed {

        @Test
        @DisplayName("returns Failure with error message when port fails")
        void returnsFailureFromPort() {
            when(calendarEventWriter.createEvent(any(), any()))
                    .thenReturn(CalendarEventCreationResult.failure("Google API error"));

            CalendarEventCreationResult result = useCase.execute(SAMPLE_EVENT, "default");

            CalendarEventCreationResult.Failure failure =
                    assertInstanceOf(CalendarEventCreationResult.Failure.class, result);
            org.junit.jupiter.api.Assertions.assertEquals("Google API error", failure.errorMessage());
        }
    }

    @Nested
    @DisplayName("Not authenticated path")
    class NotAuthenticated {

        @Test
        @DisplayName("propagates NotAuthenticatedException from port")
        void propagatesNotAuthenticated() {
            when(calendarEventWriter.createEvent(any(), any()))
                    .thenThrow(new NotAuthenticatedException("default"));

            assertThrows(NotAuthenticatedException.class,
                    () -> useCase.execute(SAMPLE_EVENT, "default"));
        }
    }

    @Nested
    @DisplayName("Delegation to port")
    class PortDelegation {

        @Test
        @DisplayName("passes event and customerContext to port unchanged")
        void passesParametersToPort() {
            when(calendarEventWriter.createEvent(SAMPLE_EVENT, "tenant-7"))
                    .thenReturn(CalendarEventCreationResult.success());

            useCase.execute(SAMPLE_EVENT, "tenant-7");

            verify(calendarEventWriter).createEvent(SAMPLE_EVENT, "tenant-7");
        }
    }
}
