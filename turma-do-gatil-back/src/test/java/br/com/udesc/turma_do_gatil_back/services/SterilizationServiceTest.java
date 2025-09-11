package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.entities.Sterilization;
import br.com.udesc.turma_do_gatil_back.enums.SterilizationStatus;
import br.com.udesc.turma_do_gatil_back.exceptions.SterilizationNotFoundException;
import br.com.udesc.turma_do_gatil_back.repositories.SterilizationRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SterilizationService Tests")
class SterilizationServiceTest {

    @Mock
    private SterilizationRepository sterilizationRepository;

    @InjectMocks
    private SterilizationService sterilizationService;

    private final UUID sterilizationId = UUID.randomUUID();
    private final UUID catId = UUID.randomUUID();
    private final LocalDateTime testDate = LocalDateTime.now().minusDays(1);

    private Sterilization createTestSterilization() {
        Sterilization sterilization = new Sterilization();
        sterilization.setId(sterilizationId);
        sterilization.setCatId(catId);
        sterilization.setSterilizationDate(testDate);
        sterilization.setStatus(SterilizationStatus.SCHEDULED);
        sterilization.setNotes("Test notes");
        return sterilization;
    }

    @Nested
    @DisplayName("Find All Operations")
    class FindAllTests {

        @Test
        @DisplayName("Should return page of sterilizations when valid pageable provided")
        void findAll_validPageable_returnsPage() {
            Pageable pageable = PageRequest.of(0, 10);
            Sterilization sterilization = createTestSterilization();
            Page<Sterilization> expectedPage = new PageImpl<>(List.of(sterilization), pageable, 1);
            
            when(sterilizationRepository.findAll(pageable)).thenReturn(expectedPage);

            Page<Sterilization> result = sterilizationService.findAll(pageable);

            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0)).isEqualTo(sterilization);
            verify(sterilizationRepository).findAll(pageable);
        }

        @Test
        @DisplayName("Should throw exception when pageable is null")
        void findAll_nullPageable_throwsException() {
            assertThatThrownBy(() -> sterilizationService.findAll(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Pageable cannot be null");

            verifyNoInteractions(sterilizationRepository);
        }
    }

    @Nested
    @DisplayName("Find By ID Operations")
    class FindByIdTests {

        @Test
        @DisplayName("Should return sterilization when id exists")
        void findById_existingId_returnsSterilization() {
            Sterilization sterilization = createTestSterilization();
            when(sterilizationRepository.findById(sterilizationId)).thenReturn(Optional.of(sterilization));

            Optional<Sterilization> result = sterilizationService.findById(sterilizationId);

            assertThat(result).isPresent();
            assertThat(result.get()).isEqualTo(sterilization);
            verify(sterilizationRepository).findById(sterilizationId);
        }

        @Test
        @DisplayName("Should return empty when id does not exist")
        void findById_nonExistingId_returnsEmpty() {
            when(sterilizationRepository.findById(sterilizationId)).thenReturn(Optional.empty());

            Optional<Sterilization> result = sterilizationService.findById(sterilizationId);

            assertThat(result).isEmpty();
            verify(sterilizationRepository).findById(sterilizationId);
        }

        @Test
        @DisplayName("Should throw exception when id is null")
        void findById_nullId_throwsException() {
            assertThatThrownBy(() -> sterilizationService.findById(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("ID cannot be null");

            verifyNoInteractions(sterilizationRepository);
        }
    }

    @Nested
    @DisplayName("Save Operations")
    class SaveTests {

        @Test
        @DisplayName("Should save sterilization when valid sterilization provided")
        void save_validSterilization_returnsSterilization() {
            Sterilization sterilization = createTestSterilization();
            sterilization.setId(null);
            Sterilization savedSterilization = createTestSterilization();
            
            when(sterilizationRepository.save(sterilization)).thenReturn(savedSterilization);

            Sterilization result = sterilizationService.save(sterilization);

            assertThat(result).isEqualTo(savedSterilization);
            verify(sterilizationRepository).save(sterilization);
        }

        @Test
        @DisplayName("Should throw exception when sterilization is null")
        void save_nullSterilization_throwsException() {
            assertThatThrownBy(() -> sterilizationService.save(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Sterilization cannot be null");

            verifyNoInteractions(sterilizationRepository);
        }

        @Test
        @DisplayName("Should throw exception when cat id is null")
        void save_nullCatId_throwsException() {
            Sterilization sterilization = createTestSterilization();
            sterilization.setCatId(null);

            assertThatThrownBy(() -> sterilizationService.save(sterilization))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Cat ID cannot be null");

            verifyNoInteractions(sterilizationRepository);
        }

        @Test
        @DisplayName("Should throw exception when sterilization date is null")
        void save_nullDate_throwsException() {
            Sterilization sterilization = createTestSterilization();
            sterilization.setSterilizationDate(null);

            assertThatThrownBy(() -> sterilizationService.save(sterilization))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Sterilization date cannot be null");

            verifyNoInteractions(sterilizationRepository);
        }

        @Test
        @DisplayName("Should throw exception when status is null")
        void save_nullStatus_throwsException() {
            Sterilization sterilization = createTestSterilization();
            sterilization.setStatus(null);

            assertThatThrownBy(() -> sterilizationService.save(sterilization))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Status cannot be null");

            verifyNoInteractions(sterilizationRepository);
        }

        @Test
        @DisplayName("Should throw exception when sterilization date is in the future")
        void save_futureDateValid_allowsSave() {
            Sterilization sterilization = createTestSterilization();
            sterilization.setSterilizationDate(LocalDateTime.now().plusDays(1));

            assertThatThrownBy(() -> sterilizationService.save(sterilization))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Sterilization date cannot be in the future");

            verifyNoInteractions(sterilizationRepository);
        }

        @Test
        @DisplayName("Should throw exception when notes exceed limit")
        void save_notesTooLong_throwsException() {
            Sterilization sterilization = createTestSterilization();
            sterilization.setNotes("a".repeat(1001));

            assertThatThrownBy(() -> sterilizationService.save(sterilization))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Notes cannot exceed 1000 characters");

            verifyNoInteractions(sterilizationRepository);
        }
    }

    @Nested
    @DisplayName("Update Operations")
    class UpdateTests {

        @Test
        @DisplayName("Should update sterilization when id exists")
        void update_existingId_updatesSterilization() {
            Sterilization sterilization = createTestSterilization();
            sterilization.setId(null);
            Sterilization updatedSterilization = createTestSterilization();
            
            when(sterilizationRepository.existsById(sterilizationId)).thenReturn(true);
            when(sterilizationRepository.save(any(Sterilization.class))).thenReturn(updatedSterilization);

            Sterilization result = sterilizationService.update(sterilizationId, sterilization);

            assertThat(result).isEqualTo(updatedSterilization);
            assertThat(sterilization.getId()).isEqualTo(sterilizationId);
            verify(sterilizationRepository).existsById(sterilizationId);
            verify(sterilizationRepository).save(sterilization);
        }

        @Test
        @DisplayName("Should throw exception when id does not exist")
        void update_nonExistingId_throwsException() {
            Sterilization sterilization = createTestSterilization();
            
            when(sterilizationRepository.existsById(sterilizationId)).thenReturn(false);

            assertThatThrownBy(() -> sterilizationService.update(sterilizationId, sterilization))
                    .isInstanceOf(SterilizationNotFoundException.class)
                    .hasMessage("Sterilization not found with id: " + sterilizationId);

            verify(sterilizationRepository).existsById(sterilizationId);
            verify(sterilizationRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Delete Operations")
    class DeleteTests {

        @Test
        @DisplayName("Should delete sterilization when id exists")
        void deleteById_existingId_deletesSterilization() {
            when(sterilizationRepository.existsById(sterilizationId)).thenReturn(true);

            sterilizationService.deleteById(sterilizationId);

            verify(sterilizationRepository).existsById(sterilizationId);
            verify(sterilizationRepository).deleteById(sterilizationId);
        }

        @Test
        @DisplayName("Should throw exception when id does not exist")
        void deleteById_nonExistingId_throwsException() {
            when(sterilizationRepository.existsById(sterilizationId)).thenReturn(false);

            assertThatThrownBy(() -> sterilizationService.deleteById(sterilizationId))
                    .isInstanceOf(SterilizationNotFoundException.class)
                    .hasMessage("Sterilization not found with id: " + sterilizationId);

            verify(sterilizationRepository).existsById(sterilizationId);
            verify(sterilizationRepository, never()).deleteById(any());
        }
    }

    @Nested
    @DisplayName("Find By Cat ID Operations")
    class FindByCatIdTests {

        @Test
        @DisplayName("Should return sterilizations for cat when valid cat id provided")
        void findByCatId_validCatId_returnsSterilizations() {
            Pageable pageable = PageRequest.of(0, 10);
            Sterilization sterilization = createTestSterilization();
            Page<Sterilization> expectedPage = new PageImpl<>(List.of(sterilization), pageable, 1);
            
            when(sterilizationRepository.findByCatId(catId, pageable)).thenReturn(expectedPage);

            Page<Sterilization> result = sterilizationService.findByCatId(catId, pageable);

            assertThat(result).isEqualTo(expectedPage);
            verify(sterilizationRepository).findByCatId(catId, pageable);
        }

        @Test
        @DisplayName("Should throw exception when cat id is null")
        void findByCatId_nullCatId_throwsException() {
            Pageable pageable = PageRequest.of(0, 10);

            assertThatThrownBy(() -> sterilizationService.findByCatId(null, pageable))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Cat ID cannot be null");

            verifyNoInteractions(sterilizationRepository);
        }
    }

    @Nested
    @DisplayName("Find By Status Operations")
    class FindByStatusTests {

        @Test
        @DisplayName("Should return sterilizations by status when valid status provided")
        void findByStatus_validStatus_returnsSterilizations() {
            Pageable pageable = PageRequest.of(0, 10);
            SterilizationStatus status = SterilizationStatus.COMPLETED;
            Sterilization sterilization = createTestSterilization();
            sterilization.setStatus(status);
            Page<Sterilization> expectedPage = new PageImpl<>(List.of(sterilization), pageable, 1);
            
            when(sterilizationRepository.findByStatus(status, pageable)).thenReturn(expectedPage);

            Page<Sterilization> result = sterilizationService.findByStatus(status, pageable);

            assertThat(result).isEqualTo(expectedPage);
            verify(sterilizationRepository).findByStatus(status, pageable);
        }

        @Test
        @DisplayName("Should throw exception when status is null")
        void findByStatus_nullStatus_throwsException() {
            Pageable pageable = PageRequest.of(0, 10);

            assertThatThrownBy(() -> sterilizationService.findByStatus(null, pageable))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Status cannot be null");

            verifyNoInteractions(sterilizationRepository);
        }
    }

    @Nested
    @DisplayName("Date Range Operations")
    class DateRangeTests {

        @Test
        @DisplayName("Should return sterilizations in date range when valid dates provided")
        void findByDateRange_validDates_returnsSterilizations() {
            Pageable pageable = PageRequest.of(0, 10);
            LocalDateTime startDate = testDate.minusDays(1);
            LocalDateTime endDate = testDate.plusDays(1);
            Sterilization sterilization = createTestSterilization();
            Page<Sterilization> expectedPage = new PageImpl<>(List.of(sterilization), pageable, 1);
            
            when(sterilizationRepository.findBySterilizationDateBetween(startDate, endDate, pageable))
                    .thenReturn(expectedPage);

            Page<Sterilization> result = sterilizationService.findByDateRange(startDate, endDate, pageable);

            assertThat(result).isEqualTo(expectedPage);
            verify(sterilizationRepository).findBySterilizationDateBetween(startDate, endDate, pageable);
        }

        @Test
        @DisplayName("Should throw exception when end date is before start date")
        void findByDateRange_endBeforeStart_throwsException() {
            Pageable pageable = PageRequest.of(0, 10);
            LocalDateTime startDate = testDate.plusDays(1);
            LocalDateTime endDate = testDate.minusDays(1);

            assertThatThrownBy(() -> sterilizationService.findByDateRange(startDate, endDate, pageable))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("End date cannot be before start date");

            verifyNoInteractions(sterilizationRepository);
        }
    }

    @Nested
    @DisplayName("Filter Operations")
    class FilterTests {

        @Test
        @DisplayName("Should return filtered sterilizations when valid filters provided")
        void findWithFilters_validFilters_returnsSterilizations() {
            Pageable pageable = PageRequest.of(0, 10);
            SterilizationStatus status = SterilizationStatus.SCHEDULED;
            LocalDateTime startDate = testDate.minusDays(1);
            LocalDateTime endDate = testDate.plusDays(1);
            Sterilization sterilization = createTestSterilization();
            Page<Sterilization> expectedPage = new PageImpl<>(List.of(sterilization), pageable, 1);
            
            when(sterilizationRepository.findWithFilters(catId, status, startDate, endDate, pageable))
                    .thenReturn(expectedPage);

            Page<Sterilization> result = sterilizationService.findWithFilters(catId, status, startDate, endDate, pageable);

            assertThat(result).isEqualTo(expectedPage);
            verify(sterilizationRepository).findWithFilters(catId, status, startDate, endDate, pageable);
        }

        @Test
        @DisplayName("Should throw exception when date range is invalid")
        void findWithFilters_invalidDateRange_throwsException() {
            Pageable pageable = PageRequest.of(0, 10);
            LocalDateTime startDate = testDate.plusDays(1);
            LocalDateTime endDate = testDate.minusDays(1);

            assertThatThrownBy(() -> sterilizationService.findWithFilters(catId, null, startDate, endDate, pageable))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("End date cannot be before start date");

            verifyNoInteractions(sterilizationRepository);
        }

        @Test
        @DisplayName("Should handle null filters gracefully")
        void findWithFilters_nullFilters_handlesGracefully() {
            Pageable pageable = PageRequest.of(0, 10);
            Sterilization sterilization = createTestSterilization();
            Page<Sterilization> expectedPage = new PageImpl<>(List.of(sterilization), pageable, 1);
            
            when(sterilizationRepository.findWithFilters(null, null, null, null, pageable))
                    .thenReturn(expectedPage);

            Page<Sterilization> result = sterilizationService.findWithFilters(null, null, null, null, pageable);

            assertThat(result).isEqualTo(expectedPage);
            verify(sterilizationRepository).findWithFilters(null, null, null, null, pageable);
        }
    }
}
