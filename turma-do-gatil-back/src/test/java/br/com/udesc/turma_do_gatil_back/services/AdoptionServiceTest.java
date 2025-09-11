package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.entities.Adoption;
import br.com.udesc.turma_do_gatil_back.entities.Cat;
import br.com.udesc.turma_do_gatil_back.enums.AdoptionStatus;
import br.com.udesc.turma_do_gatil_back.enums.CatAdoptionStatus;
import br.com.udesc.turma_do_gatil_back.exceptions.AdoptionNotFoundException;
import br.com.udesc.turma_do_gatil_back.repositories.AdoptionRepository;
import br.com.udesc.turma_do_gatil_back.repositories.CatRepository;
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
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AdoptionService Tests")
class AdoptionServiceTest {

    @Mock
    private AdoptionRepository adoptionRepository;

    @Mock
    private CatRepository catRepository;

    @InjectMocks
    private AdoptionService adoptionService;

    private UUID adoptionId;
    private UUID catId;
    private UUID adopterId;
    private Adoption adoption;
    private Cat cat;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        adoptionId = UUID.randomUUID();
        catId = UUID.randomUUID();
        adopterId = UUID.randomUUID();
        
        adoption = createAdoption(adoptionId, catId, adopterId, AdoptionStatus.PENDING);
        cat = createCat(catId, CatAdoptionStatus.NAO_ADOTADO);
        pageable = PageRequest.of(0, 10);
    }

    @Nested
    @DisplayName("Find Operations")
    class FindOperations {

        @Test
        @DisplayName("Should find all adoptions with pagination")
        void findAll_shouldReturnPagedAdoptions() {
            Page<Adoption> expectedPage = new PageImpl<>(List.of(adoption));
            when(adoptionRepository.findAll(pageable)).thenReturn(expectedPage);

            Page<Adoption> result = adoptionService.findAll(pageable);

            assertThat(result).isEqualTo(expectedPage);
            verify(adoptionRepository).findAll(pageable);
        }

        @Test
        @DisplayName("Should throw exception when pageable is null")
        void findAll_withNullPageable_shouldThrowException() {
            assertThatThrownBy(() -> adoptionService.findAll(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Pageable cannot be null");
        }

        @Test
        @DisplayName("Should find adoption by ID when exists")
        void findById_existingId_shouldReturnAdoption() {
            when(adoptionRepository.findById(adoptionId)).thenReturn(Optional.of(adoption));

            Optional<Adoption> result = adoptionService.findById(adoptionId);

            assertThat(result).isPresent().contains(adoption);
            verify(adoptionRepository).findById(adoptionId);
        }

        @Test
        @DisplayName("Should return empty when adoption not found")
        void findById_nonExistingId_shouldReturnEmpty() {
            when(adoptionRepository.findById(adoptionId)).thenReturn(Optional.empty());

            Optional<Adoption> result = adoptionService.findById(adoptionId);

            assertThat(result).isEmpty();
            verify(adoptionRepository).findById(adoptionId);
        }

        @Test
        @DisplayName("Should throw exception when ID is null")
        void findById_withNullId_shouldThrowException() {
            assertThatThrownBy(() -> adoptionService.findById(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Adoption ID cannot be null");
        }

        @Test
        @DisplayName("Should find adoptions by status")
        void findByStatus_shouldReturnFilteredAdoptions() {
            Page<Adoption> expectedPage = new PageImpl<>(List.of(adoption));
            when(adoptionRepository.findByStatus(AdoptionStatus.PENDING, pageable)).thenReturn(expectedPage);

            Page<Adoption> result = adoptionService.findByStatus(AdoptionStatus.PENDING, pageable);

            assertThat(result).isEqualTo(expectedPage);
            verify(adoptionRepository).findByStatus(AdoptionStatus.PENDING, pageable);
        }

        @Test
        @DisplayName("Should find adoptions by cat ID")
        void findByCatId_shouldReturnFilteredAdoptions() {
            Page<Adoption> expectedPage = new PageImpl<>(List.of(adoption));
            when(adoptionRepository.findByCatId(catId, pageable)).thenReturn(expectedPage);

            Page<Adoption> result = adoptionService.findByCatId(catId, pageable);

            assertThat(result).isEqualTo(expectedPage);
            verify(adoptionRepository).findByCatId(catId, pageable);
        }

        @Test
        @DisplayName("Should find adoptions by adopter ID")
        void findByAdopterId_shouldReturnFilteredAdoptions() {
            Page<Adoption> expectedPage = new PageImpl<>(List.of(adoption));
            when(adoptionRepository.findByAdopterId(adopterId, pageable)).thenReturn(expectedPage);

            Page<Adoption> result = adoptionService.findByAdopterId(adopterId, pageable);

            assertThat(result).isEqualTo(expectedPage);
            verify(adoptionRepository).findByAdopterId(adopterId, pageable);
        }

        @Test
        @DisplayName("Should find adoptions by date range")
        void findByDateRange_validRange_shouldReturnFilteredAdoptions() {
            LocalDateTime startDate = LocalDateTime.now().minusDays(7);
            LocalDateTime endDate = LocalDateTime.now();
            Page<Adoption> expectedPage = new PageImpl<>(List.of(adoption));
            
            when(adoptionRepository.findByAdoptionDateBetween(startDate, endDate, pageable))
                    .thenReturn(expectedPage);

            Page<Adoption> result = adoptionService.findByDateRange(startDate, endDate, pageable);

            assertThat(result).isEqualTo(expectedPage);
            verify(adoptionRepository).findByAdoptionDateBetween(startDate, endDate, pageable);
        }

        @Test
        @DisplayName("Should throw exception when start date is after end date")
        void findByDateRange_invalidRange_shouldThrowException() {
            LocalDateTime startDate = LocalDateTime.now();
            LocalDateTime endDate = LocalDateTime.now().minusDays(1);

            assertThatThrownBy(() -> adoptionService.findByDateRange(startDate, endDate, pageable))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Start date must be before or equal to end date");
        }

        @Test
        @DisplayName("Should find adoptions with multiple filters")
        void findWithFilters_shouldReturnFilteredAdoptions() {
            Page<Adoption> expectedPage = new PageImpl<>(List.of(adoption));
            LocalDateTime startDate = LocalDateTime.now().minusDays(7);
            LocalDateTime endDate = LocalDateTime.now();
            
            when(adoptionRepository.findWithFilters(
                    AdoptionStatus.PENDING, catId, adopterId, startDate, endDate, pageable))
                    .thenReturn(expectedPage);

            Page<Adoption> result = adoptionService.findWithFilters(
                    AdoptionStatus.PENDING, catId, adopterId, startDate, endDate, pageable);

            assertThat(result).isEqualTo(expectedPage);
            verify(adoptionRepository).findWithFilters(
                    AdoptionStatus.PENDING, catId, adopterId, startDate, endDate, pageable);
        }
    }

    @Nested
    @DisplayName("Save Operations")
    class SaveOperations {

        @Test
        @DisplayName("Should save adoption and update cat status")
        void save_validAdoption_shouldSaveAndUpdateCatStatus() {
            when(adoptionRepository.save(adoption)).thenReturn(adoption);
            when(catRepository.findById(catId)).thenReturn(Optional.of(cat));
            when(adoptionRepository.findByCatIdAndStatus(catId, AdoptionStatus.COMPLETED))
                    .thenReturn(Collections.emptyList());
            when(adoptionRepository.findByCatIdAndStatus(catId, AdoptionStatus.PENDING))
                    .thenReturn(List.of(adoption));

            Adoption result = adoptionService.save(adoption);

            assertThat(result).isEqualTo(adoption);
            verify(adoptionRepository).save(adoption);
            verify(catRepository).findById(catId);
            verify(catRepository).save(any(Cat.class));
        }

        @Test
        @DisplayName("Should throw exception when adoption is null")
        void save_nullAdoption_shouldThrowException() {
            assertThatThrownBy(() -> adoptionService.save(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Adoption cannot be null");
        }

        @Test
        @DisplayName("Should throw exception when cat ID is null")
        void save_nullCatId_shouldThrowException() {
            adoption.setCatId(null);

            assertThatThrownBy(() -> adoptionService.save(adoption))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Cat ID cannot be null");
        }

        @Test
        @DisplayName("Should throw exception when adopter ID is null")
        void save_nullAdopterId_shouldThrowException() {
            adoption.setAdopterId(null);

            assertThatThrownBy(() -> adoptionService.save(adoption))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Adopter ID cannot be null");
        }

        @Test
        @DisplayName("Should throw exception when status is null")
        void save_nullStatus_shouldThrowException() {
            adoption.setStatus(null);

            assertThatThrownBy(() -> adoptionService.save(adoption))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Adoption status cannot be null");
        }
    }

    @Nested
    @DisplayName("Update Operations")
    class UpdateOperations {

        @Test
        @DisplayName("Should update existing adoption")
        void update_existingAdoption_shouldUpdate() {
            when(adoptionRepository.existsById(adoptionId)).thenReturn(true);
            when(adoptionRepository.save(adoption)).thenReturn(adoption);
            when(catRepository.findById(catId)).thenReturn(Optional.of(cat));
            when(adoptionRepository.findByCatIdAndStatus(catId, AdoptionStatus.COMPLETED))
                    .thenReturn(Collections.emptyList());
            when(adoptionRepository.findByCatIdAndStatus(catId, AdoptionStatus.PENDING))
                    .thenReturn(List.of(adoption));

            Adoption result = adoptionService.update(adoptionId, adoption);

            assertThat(result).isEqualTo(adoption);
            assertThat(adoption.getId()).isEqualTo(adoptionId);
            verify(adoptionRepository).existsById(adoptionId);
            verify(adoptionRepository).save(adoption);
        }

        @Test
        @DisplayName("Should throw exception when adoption not found")
        void update_nonExistingAdoption_shouldThrowException() {
            when(adoptionRepository.existsById(adoptionId)).thenReturn(false);

            assertThatThrownBy(() -> adoptionService.update(adoptionId, adoption))
                    .isInstanceOf(AdoptionNotFoundException.class)
                    .hasMessage("Adoption not found with id: " + adoptionId);
        }

        @Test
        @DisplayName("Should throw exception when adoption ID is null")
        void update_nullId_shouldThrowException() {
            assertThatThrownBy(() -> adoptionService.update(null, adoption))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Adoption ID cannot be null");
        }
    }

    @Nested
    @DisplayName("Delete Operations")
    class DeleteOperations {

        @Test
        @DisplayName("Should delete adoption and update cat status")
        void deleteById_existingAdoption_shouldDeleteAndUpdateCatStatus() {
            when(adoptionRepository.findById(adoptionId)).thenReturn(Optional.of(adoption));
            when(catRepository.findById(catId)).thenReturn(Optional.of(cat));
            when(adoptionRepository.findByCatIdAndStatus(catId, AdoptionStatus.COMPLETED))
                    .thenReturn(Collections.emptyList());
            when(adoptionRepository.findByCatIdAndStatus(catId, AdoptionStatus.PENDING))
                    .thenReturn(Collections.emptyList());

            adoptionService.deleteById(adoptionId);

            verify(adoptionRepository).findById(adoptionId);
            verify(adoptionRepository).deleteById(adoptionId);
            verify(catRepository).findById(catId);
        }

        @Test
        @DisplayName("Should throw exception when adoption not found")
        void deleteById_nonExistingAdoption_shouldThrowException() {
            when(adoptionRepository.findById(adoptionId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> adoptionService.deleteById(adoptionId))
                    .isInstanceOf(AdoptionNotFoundException.class)
                    .hasMessage("Adoption not found with id: " + adoptionId);
        }

        @Test
        @DisplayName("Should throw exception when ID is null")
        void deleteById_nullId_shouldThrowException() {
            assertThatThrownBy(() -> adoptionService.deleteById(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Adoption ID cannot be null");
        }
    }

    @Nested
    @DisplayName("Cat Status Update Operations")
    class CatStatusUpdateOperations {

        @Test
        @DisplayName("Should update cat status to ADOTADO when has completed adoptions")
        void updateCatStatus_withCompletedAdoptions_shouldSetStatusToAdotado() {
            Adoption completedAdoption = createAdoption(UUID.randomUUID(), catId, adopterId, AdoptionStatus.COMPLETED);
            
            when(adoptionRepository.save(completedAdoption)).thenReturn(completedAdoption);
            when(catRepository.findById(catId)).thenReturn(Optional.of(cat));
            when(adoptionRepository.findByCatIdAndStatus(catId, AdoptionStatus.COMPLETED))
                    .thenReturn(List.of(completedAdoption));

            adoptionService.save(completedAdoption);

            ArgumentCaptor<Cat> catCaptor = ArgumentCaptor.forClass(Cat.class);
            verify(catRepository).save(catCaptor.capture());
            Cat savedCat = catCaptor.getValue();
            assertThat(savedCat.getAdoptionStatus()).isEqualTo(CatAdoptionStatus.ADOTADO);
        }

        @Test
        @DisplayName("Should update cat status to EM_PROCESSO when has pending adoptions")
        void updateCatStatus_withPendingAdoptions_shouldSetStatusToEmProcesso() {
            when(adoptionRepository.save(adoption)).thenReturn(adoption);
            when(catRepository.findById(catId)).thenReturn(Optional.of(cat));
            when(adoptionRepository.findByCatIdAndStatus(catId, AdoptionStatus.COMPLETED))
                    .thenReturn(Collections.emptyList());
            when(adoptionRepository.findByCatIdAndStatus(catId, AdoptionStatus.PENDING))
                    .thenReturn(List.of(adoption));

            adoptionService.save(adoption);

            ArgumentCaptor<Cat> catCaptor = ArgumentCaptor.forClass(Cat.class);
            verify(catRepository).save(catCaptor.capture());
            Cat savedCat = catCaptor.getValue();
            assertThat(savedCat.getAdoptionStatus()).isEqualTo(CatAdoptionStatus.EM_PROCESSO);
        }

        @Test
        @DisplayName("Should update cat status to NAO_ADOTADO when no adoptions exist")
        void updateCatStatus_withNoAdoptions_shouldSetStatusToNaoAdotado() {
            cat.setAdoptionStatus(CatAdoptionStatus.EM_PROCESSO);
            
            when(adoptionRepository.findById(adoptionId)).thenReturn(Optional.of(adoption));
            when(catRepository.findById(catId)).thenReturn(Optional.of(cat));
            when(adoptionRepository.findByCatIdAndStatus(catId, AdoptionStatus.COMPLETED))
                    .thenReturn(Collections.emptyList());
            when(adoptionRepository.findByCatIdAndStatus(catId, AdoptionStatus.PENDING))
                    .thenReturn(Collections.emptyList());

            adoptionService.deleteById(adoptionId);

            ArgumentCaptor<Cat> catCaptor = ArgumentCaptor.forClass(Cat.class);
            verify(catRepository).save(catCaptor.capture());
            Cat savedCat = catCaptor.getValue();
            assertThat(savedCat.getAdoptionStatus()).isEqualTo(CatAdoptionStatus.NAO_ADOTADO);
        }

        @Test
        @DisplayName("Should not update cat when status unchanged")
        void updateCatStatus_sameStatus_shouldNotSaveCat() {
            cat.setAdoptionStatus(CatAdoptionStatus.EM_PROCESSO);
            
            when(adoptionRepository.save(adoption)).thenReturn(adoption);
            when(catRepository.findById(catId)).thenReturn(Optional.of(cat));
            when(adoptionRepository.findByCatIdAndStatus(catId, AdoptionStatus.COMPLETED))
                    .thenReturn(Collections.emptyList());
            when(adoptionRepository.findByCatIdAndStatus(catId, AdoptionStatus.PENDING))
                    .thenReturn(List.of(adoption));

            adoptionService.save(adoption);

            verify(catRepository, never()).save(any(Cat.class));
        }

        @Test
        @DisplayName("Should handle cat not found gracefully")
        void updateCatStatus_catNotFound_shouldNotThrowException() {
            when(adoptionRepository.save(adoption)).thenReturn(adoption);
            when(catRepository.findById(catId)).thenReturn(Optional.empty());

            assertThatCode(() -> adoptionService.save(adoption))
                    .doesNotThrowAnyException();
            
            verify(catRepository, never()).save(any(Cat.class));
        }
    }

    @Nested
    @DisplayName("Edge Cases")
    class EdgeCases {

        @Test
        @DisplayName("Should handle empty adoption list for cat and status")
        void findByCatIdAndStatus_emptyResult_shouldReturnEmptyList() {
            when(adoptionRepository.findByCatIdAndStatus(catId, AdoptionStatus.COMPLETED))
                    .thenReturn(Collections.emptyList());

            List<Adoption> result = adoptionService.findByCatIdAndStatus(catId, AdoptionStatus.COMPLETED);

            assertThat(result).isEmpty();
            verify(adoptionRepository).findByCatIdAndStatus(catId, AdoptionStatus.COMPLETED);
        }

        @Test
        @DisplayName("Should validate date range in filters with null dates")
        void findWithFilters_nullDates_shouldNotThrowException() {
            Page<Adoption> expectedPage = new PageImpl<>(List.of(adoption));
            
            when(adoptionRepository.findWithFilters(null, null, null, null, null, pageable))
                    .thenReturn(expectedPage);

            Page<Adoption> result = adoptionService.findWithFilters(null, null, null, null, null, pageable);

            assertThat(result).isEqualTo(expectedPage);
        }

        @Test
        @DisplayName("Should throw exception for invalid date range in filters")
        void findWithFilters_invalidDateRange_shouldThrowException() {
            LocalDateTime startDate = LocalDateTime.now();
            LocalDateTime endDate = LocalDateTime.now().minusDays(1);

            assertThatThrownBy(() -> adoptionService.findWithFilters(
                    null, null, null, startDate, endDate, pageable))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Start date must be before or equal to end date");
        }
    }

    private Adoption createAdoption(UUID id, UUID catId, UUID adopterId, AdoptionStatus status) {
        Adoption adoption = new Adoption();
        adoption.setId(id);
        adoption.setCatId(catId);
        adoption.setAdopterId(adopterId);
        adoption.setStatus(status);
        adoption.setAdoptionDate(LocalDateTime.now());
        return adoption;
    }

    private Cat createCat(UUID id, CatAdoptionStatus adoptionStatus) {
        Cat cat = new Cat();
        cat.setId(id);
        cat.setAdoptionStatus(adoptionStatus);
        return cat;
    }
}
