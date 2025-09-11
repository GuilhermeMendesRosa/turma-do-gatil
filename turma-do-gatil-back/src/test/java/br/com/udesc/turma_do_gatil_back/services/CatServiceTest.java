package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.dto.CatSterilizationStatusDto;
import br.com.udesc.turma_do_gatil_back.dto.SterilizationStatsDto;
import br.com.udesc.turma_do_gatil_back.entities.Cat;
import br.com.udesc.turma_do_gatil_back.entities.Sterilization;
import br.com.udesc.turma_do_gatil_back.enums.CatAdoptionStatus;
import br.com.udesc.turma_do_gatil_back.enums.Color;
import br.com.udesc.turma_do_gatil_back.enums.Sex;
import br.com.udesc.turma_do_gatil_back.enums.SterilizationStatus;
import br.com.udesc.turma_do_gatil_back.enums.SterilizationEligibilityStatus;
import br.com.udesc.turma_do_gatil_back.repositories.CatRepository;
import br.com.udesc.turma_do_gatil_back.exceptions.CatNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CatService Tests")
class CatServiceTest {

    @Mock
    private CatRepository catRepository;

    @InjectMocks
    private CatService catService;

    private Cat testCat;
    private UUID testId;
    private Pageable testPageable;

    @BeforeEach
    void setUp() {
        testId = UUID.randomUUID();
        testPageable = PageRequest.of(0, 10);
        testCat = createTestCat("Mimi", LocalDateTime.now().minusDays(100));
        testCat.setId(testId);
    }

    @Nested
    @DisplayName("Basic CRUD Operations")
    class BasicCrudOperations {

        @Test
        @DisplayName("findAll should return paginated cats")
        void findAll_shouldReturnPaginatedCats() {
            // Given
            Page<Cat> expectedPage = new PageImpl<>(List.of(testCat));
            when(catRepository.findAll(testPageable)).thenReturn(expectedPage);

            // When
            Page<Cat> result = catService.findAll(testPageable);

            // Then
            assertThat(result).isEqualTo(expectedPage);
            verify(catRepository).findAll(testPageable);
        }

        @Test
        @DisplayName("findAll should throw exception when pageable is null")
        void findAll_shouldThrowException_whenPageableIsNull() {
            // When & Then
            assertThatThrownBy(() -> catService.findAll(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Pageable cannot be null");
        }

        @Test
        @DisplayName("findById should return cat when found")
        void findById_shouldReturnCat_whenFound() {
            // Given
            when(catRepository.findById(testId)).thenReturn(Optional.of(testCat));

            // When
            Optional<Cat> result = catService.findById(testId);

            // Then
            assertThat(result).isPresent().contains(testCat);
            verify(catRepository).findById(testId);
        }

        @Test
        @DisplayName("findById should return empty when not found")
        void findById_shouldReturnEmpty_whenNotFound() {
            // Given
            when(catRepository.findById(testId)).thenReturn(Optional.empty());

            // When
            Optional<Cat> result = catService.findById(testId);

            // Then
            assertThat(result).isEmpty();
            verify(catRepository).findById(testId);
        }

        @Test
        @DisplayName("findById should throw exception when id is null")
        void findById_shouldThrowException_whenIdIsNull() {
            // When & Then
            assertThatThrownBy(() -> catService.findById(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Cat ID cannot be null");
        }

        @Test
        @DisplayName("save should save and return cat")
        void save_shouldSaveAndReturnCat() {
            // Given
            Cat catToSave = createTestCat("Felix", LocalDateTime.now().minusDays(50));
            Cat savedCat = createTestCat("Felix", LocalDateTime.now().minusDays(50));
            savedCat.setId(UUID.randomUUID());
            
            when(catRepository.save(catToSave)).thenReturn(savedCat);

            // When
            Cat result = catService.save(catToSave);

            // Then
            assertThat(result).isEqualTo(savedCat);
            assertThat(result.getId()).isNotNull();
            verify(catRepository).save(catToSave);
        }

        @Test
        @DisplayName("save should throw exception when cat is null")
        void save_shouldThrowException_whenCatIsNull() {
            // When & Then
            assertThatThrownBy(() -> catService.save(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Cat cannot be null");
        }

        @Test
        @DisplayName("update should update existing cat")
        void update_shouldUpdateExistingCat() {
            // Given
            Cat updatedCat = createTestCat("UpdatedName", LocalDateTime.now().minusDays(200));
            when(catRepository.existsById(testId)).thenReturn(true);
            when(catRepository.save(any(Cat.class))).thenReturn(updatedCat);

            // When
            Cat result = catService.update(testId, updatedCat);

            // Then
            assertThat(result).isEqualTo(updatedCat);
            
            ArgumentCaptor<Cat> catCaptor = ArgumentCaptor.forClass(Cat.class);
            verify(catRepository).save(catCaptor.capture());
            assertThat(catCaptor.getValue().getId()).isEqualTo(testId);
        }

        @Test
        @DisplayName("update should throw CatNotFoundException when cat doesn't exist")
        void update_shouldThrowCatNotFoundException_whenCatDoesNotExist() {
            // Given
            when(catRepository.existsById(testId)).thenReturn(false);

            // When & Then
            assertThatThrownBy(() -> catService.update(testId, testCat))
                    .isInstanceOf(CatNotFoundException.class)
                    .hasMessage("Cat not found with id: " + testId);
        }

        @Test
        @DisplayName("deleteById should delete existing cat")
        void deleteById_shouldDeleteExistingCat() {
            // Given
            when(catRepository.existsById(testId)).thenReturn(true);

            // When
            catService.deleteById(testId);

            // Then
            verify(catRepository).deleteById(testId);
        }

        @Test
        @DisplayName("deleteById should throw CatNotFoundException when cat doesn't exist")
        void deleteById_shouldThrowCatNotFoundException_whenCatDoesNotExist() {
            // Given
            when(catRepository.existsById(testId)).thenReturn(false);

            // When & Then
            assertThatThrownBy(() -> catService.deleteById(testId))
                    .isInstanceOf(CatNotFoundException.class)
                    .hasMessage("Cat not found with id: " + testId);
        }
    }

    @Nested
    @DisplayName("Filtering Operations")
    class FilteringOperations {

        @Test
        @DisplayName("findByAdoptionStatus should return filtered cats")
        void findByAdoptionStatus_shouldReturnFilteredCats() {
            // Given
            Page<Cat> expectedPage = new PageImpl<>(List.of(testCat));
            when(catRepository.findByAdoptionStatus(CatAdoptionStatus.NAO_ADOTADO, testPageable))
                    .thenReturn(expectedPage);

            // When
            Page<Cat> result = catService.findByAdoptionStatus(CatAdoptionStatus.NAO_ADOTADO, testPageable);

            // Then
            assertThat(result).isEqualTo(expectedPage);
            verify(catRepository).findByAdoptionStatus(CatAdoptionStatus.NAO_ADOTADO, testPageable);
        }

        @Test
        @DisplayName("findByColor should return filtered cats")
        void findByColor_shouldReturnFilteredCats() {
            // Given
            Page<Cat> expectedPage = new PageImpl<>(List.of(testCat));
            when(catRepository.findByColor(Color.BLACK, testPageable)).thenReturn(expectedPage);

            // When
            Page<Cat> result = catService.findByColor(Color.BLACK, testPageable);

            // Then
            assertThat(result).isEqualTo(expectedPage);
            verify(catRepository).findByColor(Color.BLACK, testPageable);
        }

        @Test
        @DisplayName("findWithFilters should normalize empty name to null")
        void findWithFilters_shouldNormalizeEmptyNameToNull() {
            // Given
            Page<Cat> expectedPage = new PageImpl<>(List.of(testCat));
            when(catRepository.findWithFilters(null, Color.BLACK, Sex.FEMALE, 
                    CatAdoptionStatus.NAO_ADOTADO, testPageable)).thenReturn(expectedPage);

            // When
            Page<Cat> result = catService.findWithFilters("  ", Color.BLACK, Sex.FEMALE, 
                    CatAdoptionStatus.NAO_ADOTADO, testPageable);

            // Then
            assertThat(result).isEqualTo(expectedPage);
            verify(catRepository).findWithFilters(null, Color.BLACK, Sex.FEMALE, 
                    CatAdoptionStatus.NAO_ADOTADO, testPageable);
        }

        @Test
        @DisplayName("findWithFilters should preserve non-empty name")
        void findWithFilters_shouldPreserveNonEmptyName() {
            // Given
            String catName = "Mimi";
            Page<Cat> expectedPage = new PageImpl<>(List.of(testCat));
            when(catRepository.findWithFilters(catName, null, null, null, testPageable))
                    .thenReturn(expectedPage);

            // When
            Page<Cat> result = catService.findWithFilters(catName, null, null, null, testPageable);

            // Then
            assertThat(result).isEqualTo(expectedPage);
            verify(catRepository).findWithFilters(catName, null, null, null, testPageable);
        }
    }

    @Nested
    @DisplayName("Sterilization Operations")
    class SterilizationOperations {

        @Test
        @DisplayName("findCatsNeedingSterilization should return eligible cats")
        void findCatsNeedingSterilization_shouldReturnEligibleCats() {
            // Given
            Cat eligibleCat = createTestCat("Eligible", LocalDateTime.now().minusDays(120));
            eligibleCat.setId(UUID.randomUUID());
            
            List<Cat> nonAdoptedCats = List.of(eligibleCat);
            when(catRepository.findByAdoptionStatusList(CatAdoptionStatus.NAO_ADOTADO))
                    .thenReturn(nonAdoptedCats);

            // When
            List<CatSterilizationStatusDto> result = catService.findCatsNeedingSterilization();

            // Then
            assertThat(result).hasSize(1);
            CatSterilizationStatusDto dto = result.get(0);
            assertThat(dto.getId()).isEqualTo(eligibleCat.getId());
            assertThat(dto.getName()).isEqualTo(eligibleCat.getName());
            assertThat(dto.getSterilizationStatus()).isEqualTo(SterilizationEligibilityStatus.ELIGIBLE);
        }

        @Test
        @DisplayName("findCatsNeedingSterilization should return overdue cats")
        void findCatsNeedingSterilization_shouldReturnOverdueCats() {
            // Given
            Cat overdueCat = createTestCat("Overdue", LocalDateTime.now().minusDays(200));
            overdueCat.setId(UUID.randomUUID());
            
            List<Cat> nonAdoptedCats = List.of(overdueCat);
            when(catRepository.findByAdoptionStatusList(CatAdoptionStatus.NAO_ADOTADO))
                    .thenReturn(nonAdoptedCats);

            // When
            List<CatSterilizationStatusDto> result = catService.findCatsNeedingSterilization();

            // Then
            assertThat(result).hasSize(1);
            CatSterilizationStatusDto dto = result.get(0);
            assertThat(dto.getSterilizationStatus()).isEqualTo(SterilizationEligibilityStatus.OVERDUE);
        }

        @Test
        @DisplayName("findCatsNeedingSterilization should exclude too young cats")
        void findCatsNeedingSterilization_shouldExcludeTooYoungCats() {
            // Given
            Cat youngCat = createTestCat("Young", LocalDateTime.now().minusDays(60));
            youngCat.setId(UUID.randomUUID());
            
            List<Cat> nonAdoptedCats = List.of(youngCat);
            when(catRepository.findByAdoptionStatusList(CatAdoptionStatus.NAO_ADOTADO))
                    .thenReturn(nonAdoptedCats);

            // When
            List<CatSterilizationStatusDto> result = catService.findCatsNeedingSterilization();

            // Then
            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("findCatsNeedingSterilization should exclude cats with completed sterilization")
        void findCatsNeedingSterilization_shouldExcludeCatsWithCompletedSterilization() {
            // Given
            Cat sterilizedCat = createTestCat("Sterilized", LocalDateTime.now().minusDays(120));
            sterilizedCat.setId(UUID.randomUUID());
            
            Sterilization completedSterilization = new Sterilization();
            completedSterilization.setStatus(SterilizationStatus.COMPLETED);
            sterilizedCat.setSterilizations(List.of(completedSterilization));
            
            List<Cat> nonAdoptedCats = List.of(sterilizedCat);
            when(catRepository.findByAdoptionStatusList(CatAdoptionStatus.NAO_ADOTADO))
                    .thenReturn(nonAdoptedCats);

            // When
            List<CatSterilizationStatusDto> result = catService.findCatsNeedingSterilization();

            // Then
            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("findCatsNeedingSterilization should exclude cats with scheduled sterilization")
        void findCatsNeedingSterilization_shouldExcludeCatsWithScheduledSterilization() {
            // Given
            Cat scheduledCat = createTestCat("Scheduled", LocalDateTime.now().minusDays(120));
            scheduledCat.setId(UUID.randomUUID());
            
            Sterilization scheduledSterilization = new Sterilization();
            scheduledSterilization.setStatus(SterilizationStatus.SCHEDULED);
            scheduledCat.setSterilizations(List.of(scheduledSterilization));
            
            List<Cat> nonAdoptedCats = List.of(scheduledCat);
            when(catRepository.findByAdoptionStatusList(CatAdoptionStatus.NAO_ADOTADO))
                    .thenReturn(nonAdoptedCats);

            // When
            List<CatSterilizationStatusDto> result = catService.findCatsNeedingSterilization();

            // Then
            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("getSterilizationStats should return correct counts")
        void getSterilizationStats_shouldReturnCorrectCounts() {
            // Given
            Cat eligibleCat = createTestCat("Eligible", LocalDateTime.now().minusDays(120));
            Cat overdueCat = createTestCat("Overdue", LocalDateTime.now().minusDays(200));
            Cat youngCat = createTestCat("Young", LocalDateTime.now().minusDays(60));
            
            List<Cat> nonAdoptedCats = Arrays.asList(eligibleCat, overdueCat, youngCat);
            when(catRepository.findByAdoptionStatusList(CatAdoptionStatus.NAO_ADOTADO))
                    .thenReturn(nonAdoptedCats);

            // When
            SterilizationStatsDto result = catService.getSterilizationStats();

            // Then
            assertThat(result.getEligibleCount()).isEqualTo(1);
            assertThat(result.getOverdueCount()).isEqualTo(1);
        }

        @Test
        @DisplayName("getSterilizationStats should return zero counts when no cats need sterilization")
        void getSterilizationStats_shouldReturnZeroCounts_whenNoCatsNeedSterilization() {
            // Given
            when(catRepository.findByAdoptionStatusList(CatAdoptionStatus.NAO_ADOTADO))
                    .thenReturn(List.of());

            // When
            SterilizationStatsDto result = catService.getSterilizationStats();

            // Then
            assertThat(result.getEligibleCount()).isZero();
            assertThat(result.getOverdueCount()).isZero();
        }
    }

    @Nested
    @DisplayName("Input Validation")
    class InputValidation {

        @Test
        @DisplayName("should throw exception when required parameters are null")
        void shouldThrowException_whenRequiredParametersAreNull() {
            assertThatThrownBy(() -> catService.findByAdoptionStatus(null, testPageable))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Adoption status cannot be null");

            assertThatThrownBy(() -> catService.findByColor(null, testPageable))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Color cannot be null");

            assertThatThrownBy(() -> catService.findBySex(null, testPageable))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Sex cannot be null");

            assertThatThrownBy(() -> catService.findByName(null, testPageable))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Name cannot be null");

            assertThatThrownBy(() -> catService.update(null, testCat))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Cat ID cannot be null");

            assertThatThrownBy(() -> catService.update(testId, null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Cat cannot be null");
        }
    }

    private Cat createTestCat(String name, LocalDateTime birthDate) {
        Cat cat = new Cat();
        cat.setName(name);
        cat.setColor(Color.BLACK);
        cat.setSex(Sex.FEMALE);
        cat.setBirthDate(birthDate);
        cat.setShelterEntryDate(LocalDateTime.now().minusDays(10));
        cat.setPhotoUrl("https://example.com/photo.jpg");
        cat.setAdoptionStatus(CatAdoptionStatus.NAO_ADOTADO);
        return cat;
    }
}
