package de.botpilot.connectors.calendar.google.application;

import de.botpilot.connectors.calendar.spi.exception.NotAuthenticatedException;
import de.botpilot.connectors.calendar.spi.model.BusyEvent;
import de.botpilot.connectors.calendar.spi.model.EventTime;
import de.botpilot.connectors.calendar.spi.port.CalendarEventReader;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link ReadBusyEventsUseCase}.
 *
 * <p>All ports are mocked — no Spring context, no real Google API calls.
 * The use case owns input validation and delegation; those are the exact
 * behaviors verified here.
 */
@ExtendWith(MockitoExtension.class)
class ReadBusyEventsUseCaseTest {

    @Mock
    CalendarEventReader calendarEventReader;

    private ReadBusyEventsUseCase useCase;

    private static final BusyEvent SAMPLE_BUSY_EVENT = new BusyEvent(
            new EventTime("2024-03-15T09:00:00Z", "UTC"),
            new EventTime("2024-03-15T10:00:00Z", "UTC")
    );

    @BeforeEach
    void setUp() {
        useCase = new ReadBusyEventsUseCase(calendarEventReader);
    }

    @Nested
    @DisplayName("Constructor validation")
    class ConstructorValidation {

        @Test
        @DisplayName("rejects null calendarEventReader")
        void rejectsNullReader() {
            assertThrows(IllegalArgumentException.class,
                    () -> new ReadBusyEventsUseCase(null));
        }
    }

    @Nested
    @DisplayName("Input validation")
    class InputValidation {

        @Test
        @DisplayName("rejects null customerContext")
        void rejectsNullContext() {
            assertThrows(IllegalArgumentException.class,
                    () -> useCase.execute(null, 30));
        }

        @Test
        @DisplayName("rejects blank customerContext")
        void rejectsBlankContext() {
            assertThrows(IllegalArgumentException.class,
                    () -> useCase.execute("   ", 30));
        }

        @Test
        @DisplayName("rejects nextDays less than 1")
        void rejectsNextDaysLessThanOne() {
            assertThrows(IllegalArgumentException.class,
                    () -> useCase.execute("default", 0));
        }
    }

    @Nested
    @DisplayName("Happy path: busy events returned")
    class BusyEventsReturned {

        @Test
        @DisplayName("returns list from port when credentials exist")
        void returnsBusyEventsFromPort() {
            when(calendarEventReader.readBusyEventsNext("default", 30))
                    .thenReturn(List.of(SAMPLE_BUSY_EVENT));

            List<BusyEvent> result = useCase.execute("default", 30);

            assertEquals(1, result.size());
            assertEquals(SAMPLE_BUSY_EVENT, result.get(0));
        }

        @Test
        @DisplayName("returns empty list when calendar is free")
        void returnsEmptyListWhenCalendarFree() {
            when(calendarEventReader.readBusyEventsNext(any(), anyInt()))
                    .thenReturn(List.of());

            List<BusyEvent> result = useCase.execute("default", 7);

            assertTrue(result.isEmpty());
        }

        @Test
        @DisplayName("single-arg overload uses default nextDays of 90")
        void defaultNextDaysIs90() {
            when(calendarEventReader.readBusyEventsNext(eq("default"), eq(90)))
                    .thenReturn(List.of());

            useCase.execute("default");

            verify(calendarEventReader).readBusyEventsNext("default", 90);
        }
    }

    @Nested
    @DisplayName("Not authenticated path")
    class NotAuthenticated {

        @Test
        @DisplayName("propagates NotAuthenticatedException from port")
        void propagatesNotAuthenticated() {
            when(calendarEventReader.readBusyEventsNext(any(), anyInt()))
                    .thenThrow(new NotAuthenticatedException("default"));

            assertThrows(NotAuthenticatedException.class,
                    () -> useCase.execute("default", 30));
        }
    }

    @Nested
    @DisplayName("Delegation to port")
    class PortDelegation {

        @Test
        @DisplayName("passes customerContext and nextDays to port unchanged")
        void passesParametersToPort() {
            when(calendarEventReader.readBusyEventsNext("tenant-42", 14))
                    .thenReturn(List.of());

            useCase.execute("tenant-42", 14);

            verify(calendarEventReader).readBusyEventsNext("tenant-42", 14);
        }
    }
}
