package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.entities.Adopter;
import br.com.udesc.turma_do_gatil_back.exceptions.AdopterNotFoundException;
import br.com.udesc.turma_do_gatil_back.exceptions.CpfAlreadyExistsException;
import br.com.udesc.turma_do_gatil_back.exceptions.EmailAlreadyExistsException;
import br.com.udesc.turma_do_gatil_back.repositories.AdopterRepository;
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
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AdopterService Tests")
class AdopterServiceTest {

    @Mock
    private AdopterRepository adopterRepository;

    @InjectMocks
    private AdopterService adopterService;

    private Adopter testAdopter;
    private UUID testId;
    private Pageable testPageable;

    @BeforeEach
    void setUp() {
        testId = UUID.randomUUID();
        testPageable = PageRequest.of(0, 10);
        testAdopter = createTestAdopter();
    }

    private Adopter createTestAdopter() {
        return new Adopter(
            "John",
            "Doe",
            LocalDateTime.of(1990, 1, 1, 0, 0),
            "12345678901",
            "11999887766",
            "john.doe@example.com",
            "123 Main St",
            LocalDateTime.now()
        );
    }

    @Nested
    @DisplayName("findAll Tests")
    class FindAllTests {

        @Test
        @DisplayName("should return page of adopters when pageable is valid")
        void findAll_shouldReturnPageOfAdopters_whenPageableIsValid() {
            // Arrange
            List<Adopter> adopters = List.of(testAdopter);
            Page<Adopter> expectedPage = new PageImpl<>(adopters, testPageable, 1);
            when(adopterRepository.findAll(testPageable)).thenReturn(expectedPage);

            // Act
            Page<Adopter> result = adopterService.findAll(testPageable);

            // Assert
            assertThat(result).isEqualTo(expectedPage);
            assertThat(result.getContent()).hasSize(1);
            verify(adopterRepository).findAll(testPageable);
        }

        @Test
        @DisplayName("should throw exception when pageable is null")
        void findAll_shouldThrowException_whenPageableIsNull() {
            // Act & Assert
            assertThatThrownBy(() -> adopterService.findAll(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Pageable cannot be null");
        }
    }

    @Nested
    @DisplayName("findById Tests")
    class FindByIdTests {

        @Test
        @DisplayName("should return adopter when id exists")
        void findById_shouldReturnAdopter_whenIdExists() {
            // Arrange
            when(adopterRepository.findById(testId)).thenReturn(Optional.of(testAdopter));

            // Act
            Optional<Adopter> result = adopterService.findById(testId);

            // Assert
            assertThat(result).isPresent();
            assertThat(result.get()).isEqualTo(testAdopter);
            verify(adopterRepository).findById(testId);
        }

        @Test
        @DisplayName("should return empty optional when id doesn't exist")
        void findById_shouldReturnEmptyOptional_whenIdDoesNotExist() {
            // Arrange
            when(adopterRepository.findById(testId)).thenReturn(Optional.empty());

            // Act
            Optional<Adopter> result = adopterService.findById(testId);

            // Assert
            assertThat(result).isEmpty();
            verify(adopterRepository).findById(testId);
        }

        @Test
        @DisplayName("should throw exception when id is null")
        void findById_shouldThrowException_whenIdIsNull() {
            // Act & Assert
            assertThatThrownBy(() -> adopterService.findById(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Adopter ID cannot be null");
        }
    }

    @Nested
    @DisplayName("findByCpf Tests")
    class FindByCpfTests {

        @Test
        @DisplayName("should return adopter when cpf exists")
        void findByCpf_shouldReturnAdopter_whenCpfExists() {
            // Arrange
            String cpf = "12345678901";
            when(adopterRepository.findByCpf(cpf)).thenReturn(Optional.of(testAdopter));

            // Act
            Optional<Adopter> result = adopterService.findByCpf(cpf);

            // Assert
            assertThat(result).isPresent();
            assertThat(result.get()).isEqualTo(testAdopter);
            verify(adopterRepository).findByCpf(cpf);
        }

        @Test
        @DisplayName("should return empty optional when cpf doesn't exist")
        void findByCpf_shouldReturnEmptyOptional_whenCpfDoesNotExist() {
            // Arrange
            String cpf = "98765432100";
            when(adopterRepository.findByCpf(cpf)).thenReturn(Optional.empty());

            // Act
            Optional<Adopter> result = adopterService.findByCpf(cpf);

            // Assert
            assertThat(result).isEmpty();
            verify(adopterRepository).findByCpf(cpf);
        }

        @Test
        @DisplayName("should throw exception when cpf is null")
        void findByCpf_shouldThrowException_whenCpfIsNull() {
            // Act & Assert
            assertThatThrownBy(() -> adopterService.findByCpf(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("CPF cannot be null");
        }
    }

    @Nested
    @DisplayName("findByEmail Tests")
    class FindByEmailTests {

        @Test
        @DisplayName("should return adopter when email exists")
        void findByEmail_shouldReturnAdopter_whenEmailExists() {
            // Arrange
            String email = "john.doe@example.com";
            when(adopterRepository.findByEmail(email)).thenReturn(Optional.of(testAdopter));

            // Act
            Optional<Adopter> result = adopterService.findByEmail(email);

            // Assert
            assertThat(result).isPresent();
            assertThat(result.get()).isEqualTo(testAdopter);
            verify(adopterRepository).findByEmail(email);
        }

        @Test
        @DisplayName("should return empty optional when email doesn't exist")
        void findByEmail_shouldReturnEmptyOptional_whenEmailDoesNotExist() {
            // Arrange
            String email = "nonexistent@example.com";
            when(adopterRepository.findByEmail(email)).thenReturn(Optional.empty());

            // Act
            Optional<Adopter> result = adopterService.findByEmail(email);

            // Assert
            assertThat(result).isEmpty();
            verify(adopterRepository).findByEmail(email);
        }

        @Test
        @DisplayName("should throw exception when email is null")
        void findByEmail_shouldThrowException_whenEmailIsNull() {
            // Act & Assert
            assertThatThrownBy(() -> adopterService.findByEmail(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Email cannot be null");
        }
    }

    @Nested
    @DisplayName("save Tests")
    class SaveTests {

        @Test
        @DisplayName("should save adopter successfully when all validations pass")
        void save_shouldSaveAdopterSuccessfully_whenAllValidationsPass() {
            // Arrange
            Adopter adopterWithId = createTestAdopter();
            adopterWithId.setId(testId);
            
            when(adopterRepository.findByCpf(testAdopter.getCpf())).thenReturn(Optional.empty());
            when(adopterRepository.findByEmail(testAdopter.getEmail())).thenReturn(Optional.empty());
            when(adopterRepository.save(testAdopter)).thenReturn(adopterWithId);

            // Act
            Adopter result = adopterService.save(testAdopter);

            // Assert
            assertThat(result).isEqualTo(adopterWithId);
            assertThat(result.getId()).isEqualTo(testId);
            
            verify(adopterRepository).findByCpf(testAdopter.getCpf());
            verify(adopterRepository).findByEmail(testAdopter.getEmail());
            verify(adopterRepository).save(testAdopter);
        }

        @Test
        @DisplayName("should throw CpfAlreadyExistsException when cpf already exists")
        void save_shouldThrowCpfAlreadyExistsException_whenCpfAlreadyExists() {
            // Arrange
            when(adopterRepository.findByCpf(testAdopter.getCpf())).thenReturn(Optional.of(testAdopter));

            // Act & Assert
            assertThatThrownBy(() -> adopterService.save(testAdopter))
                    .isInstanceOf(CpfAlreadyExistsException.class)
                    .hasMessageContaining("CPF already registered:");
            
            verify(adopterRepository).findByCpf(testAdopter.getCpf());
            verify(adopterRepository, never()).save(any());
        }

        @Test
        @DisplayName("should throw EmailAlreadyExistsException when email already exists")
        void save_shouldThrowEmailAlreadyExistsException_whenEmailAlreadyExists() {
            // Arrange
            when(adopterRepository.findByCpf(testAdopter.getCpf())).thenReturn(Optional.empty());
            when(adopterRepository.findByEmail(testAdopter.getEmail())).thenReturn(Optional.of(testAdopter));

            // Act & Assert
            assertThatThrownBy(() -> adopterService.save(testAdopter))
                    .isInstanceOf(EmailAlreadyExistsException.class)
                    .hasMessageContaining("Email already registered:");
            
            verify(adopterRepository).findByCpf(testAdopter.getCpf());
            verify(adopterRepository).findByEmail(testAdopter.getEmail());
            verify(adopterRepository, never()).save(any());
        }

        @Test
        @DisplayName("should throw exception when adopter is null")
        void save_shouldThrowException_whenAdopterIsNull() {
            // Act & Assert
            assertThatThrownBy(() -> adopterService.save(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Adopter cannot be null");
        }

        @Test
        @DisplayName("should throw exception when cpf is null")
        void save_shouldThrowException_whenCpfIsNull() {
            // Arrange
            testAdopter.setCpf(null);

            // Act & Assert
            assertThatThrownBy(() -> adopterService.save(testAdopter))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("CPF cannot be null");
        }

        @Test
        @DisplayName("should throw exception when email is null")
        void save_shouldThrowException_whenEmailIsNull() {
            // Arrange
            testAdopter.setEmail(null);

            // Act & Assert
            assertThatThrownBy(() -> adopterService.save(testAdopter))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Email cannot be null");
        }
    }

    @Nested
    @DisplayName("update Tests")
    class UpdateTests {

        @Test
        @DisplayName("should update adopter successfully when all validations pass")
        void update_shouldUpdateAdopterSuccessfully_whenAllValidationsPass() {
            // Arrange
            Adopter updatedAdopter = createTestAdopter();
            updatedAdopter.setId(testId);
            
            when(adopterRepository.existsById(testId)).thenReturn(true);
            when(adopterRepository.findByCpf(testAdopter.getCpf())).thenReturn(Optional.empty());
            when(adopterRepository.findByEmail(testAdopter.getEmail())).thenReturn(Optional.empty());
            when(adopterRepository.save(any(Adopter.class))).thenReturn(updatedAdopter);

            // Act
            Adopter result = adopterService.update(testId, testAdopter);

            // Assert
            assertThat(result).isEqualTo(updatedAdopter);
            assertThat(result.getId()).isEqualTo(testId);
            
            ArgumentCaptor<Adopter> adopterCaptor = ArgumentCaptor.forClass(Adopter.class);
            verify(adopterRepository).save(adopterCaptor.capture());
            assertThat(adopterCaptor.getValue().getId()).isEqualTo(testId);
        }

        @Test
        @DisplayName("should throw AdopterNotFoundException when adopter doesn't exist")
        void update_shouldThrowAdopterNotFoundException_whenAdopterDoesNotExist() {
            // Arrange
            when(adopterRepository.existsById(testId)).thenReturn(false);

            // Act & Assert
            assertThatThrownBy(() -> adopterService.update(testId, testAdopter))
                    .isInstanceOf(AdopterNotFoundException.class)
                    .hasMessageContaining("Adopter not found with id:");
            
            verify(adopterRepository).existsById(testId);
            verify(adopterRepository, never()).save(any());
        }

        @Test
        @DisplayName("should throw CpfAlreadyExistsException when cpf belongs to another adopter")
        void update_shouldThrowCpfAlreadyExistsException_whenCpfBelongsToAnotherAdopter() {
            // Arrange
            UUID otherAdopterId = UUID.randomUUID();
            Adopter otherAdopter = createTestAdopter();
            otherAdopter.setId(otherAdopterId);
            
            when(adopterRepository.existsById(testId)).thenReturn(true);
            when(adopterRepository.findByCpf(testAdopter.getCpf())).thenReturn(Optional.of(otherAdopter));

            // Act & Assert
            assertThatThrownBy(() -> adopterService.update(testId, testAdopter))
                    .isInstanceOf(CpfAlreadyExistsException.class)
                    .hasMessageContaining("CPF already registered for another adopter:");
            
            verify(adopterRepository, never()).save(any());
        }

        @Test
        @DisplayName("should throw EmailAlreadyExistsException when email belongs to another adopter")
        void update_shouldThrowEmailAlreadyExistsException_whenEmailBelongsToAnotherAdopter() {
            // Arrange
            UUID otherAdopterId = UUID.randomUUID();
            Adopter otherAdopter = createTestAdopter();
            otherAdopter.setId(otherAdopterId);
            
            when(adopterRepository.existsById(testId)).thenReturn(true);
            when(adopterRepository.findByCpf(testAdopter.getCpf())).thenReturn(Optional.empty());
            when(adopterRepository.findByEmail(testAdopter.getEmail())).thenReturn(Optional.of(otherAdopter));

            // Act & Assert
            assertThatThrownBy(() -> adopterService.update(testId, testAdopter))
                    .isInstanceOf(EmailAlreadyExistsException.class)
                    .hasMessageContaining("Email already registered for another adopter:");
            
            verify(adopterRepository, never()).save(any());
        }

        @Test
        @DisplayName("should allow update when cpf belongs to same adopter")
        void update_shouldAllowUpdate_whenCpfBelongsToSameAdopter() {
            // Arrange
            Adopter existingAdopter = createTestAdopter();
            existingAdopter.setId(testId);
            Adopter updatedAdopter = createTestAdopter();
            updatedAdopter.setId(testId);
            
            when(adopterRepository.existsById(testId)).thenReturn(true);
            when(adopterRepository.findByCpf(testAdopter.getCpf())).thenReturn(Optional.of(existingAdopter));
            when(adopterRepository.findByEmail(testAdopter.getEmail())).thenReturn(Optional.of(existingAdopter));
            when(adopterRepository.save(any(Adopter.class))).thenReturn(updatedAdopter);

            // Act
            Adopter result = adopterService.update(testId, testAdopter);

            // Assert
            assertThat(result).isEqualTo(updatedAdopter);
            verify(adopterRepository).save(any(Adopter.class));
        }
    }

    @Nested
    @DisplayName("deleteById Tests")
    class DeleteByIdTests {

        @Test
        @DisplayName("should delete adopter successfully when adopter exists")
        void deleteById_shouldDeleteAdopterSuccessfully_whenAdopterExists() {
            // Arrange
            when(adopterRepository.existsById(testId)).thenReturn(true);

            // Act
            adopterService.deleteById(testId);

            // Assert
            verify(adopterRepository).existsById(testId);
            verify(adopterRepository).deleteById(testId);
        }

        @Test
        @DisplayName("should throw AdopterNotFoundException when adopter doesn't exist")
        void deleteById_shouldThrowAdopterNotFoundException_whenAdopterDoesNotExist() {
            // Arrange
            when(adopterRepository.existsById(testId)).thenReturn(false);

            // Act & Assert
            assertThatThrownBy(() -> adopterService.deleteById(testId))
                    .isInstanceOf(AdopterNotFoundException.class)
                    .hasMessageContaining("Adopter not found with id:");
            
            verify(adopterRepository).existsById(testId);
            verify(adopterRepository, never()).deleteById(testId);
        }

        @Test
        @DisplayName("should throw exception when id is null")
        void deleteById_shouldThrowException_whenIdIsNull() {
            // Act & Assert
            assertThatThrownBy(() -> adopterService.deleteById(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Adopter ID cannot be null");
        }
    }

    @Nested
    @DisplayName("Search Methods Tests")
    class SearchMethodsTests {

        @Test
        @DisplayName("findByName should return results when name is provided")
        void findByName_shouldReturnResults_whenNameIsProvided() {
            // Arrange
            String name = "John";
            List<Adopter> adopters = List.of(testAdopter);
            Page<Adopter> expectedPage = new PageImpl<>(adopters, testPageable, 1);
            
            when(adopterRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                    eq(name), eq(name), eq(testPageable))).thenReturn(expectedPage);

            // Act
            Page<Adopter> result = adopterService.findByName(name, testPageable);

            // Assert
            assertThat(result).isEqualTo(expectedPage);
            verify(adopterRepository).findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                    name, name, testPageable);
        }

        @Test
        @DisplayName("findByName should return empty page when name is null or empty")
        void findByName_shouldReturnEmptyPage_whenNameIsNullOrEmpty() {
            // Act
            Page<Adopter> result1 = adopterService.findByName(null, testPageable);
            Page<Adopter> result2 = adopterService.findByName("", testPageable);
            Page<Adopter> result3 = adopterService.findByName("  ", testPageable);

            // Assert
            assertThat(result1.isEmpty()).isTrue();
            assertThat(result2.isEmpty()).isTrue();
            assertThat(result3.isEmpty()).isTrue();
            
            verifyNoInteractions(adopterRepository);
        }

        @Test
        @DisplayName("findByEmailContaining should return results when email is provided")
        void findByEmailContaining_shouldReturnResults_whenEmailIsProvided() {
            // Arrange
            String email = "john";
            List<Adopter> adopters = List.of(testAdopter);
            Page<Adopter> expectedPage = new PageImpl<>(adopters, testPageable, 1);
            
            when(adopterRepository.findByEmailContainingIgnoreCase(email, testPageable))
                    .thenReturn(expectedPage);

            // Act
            Page<Adopter> result = adopterService.findByEmailContaining(email, testPageable);

            // Assert
            assertThat(result).isEqualTo(expectedPage);
            verify(adopterRepository).findByEmailContainingIgnoreCase(email, testPageable);
        }

        @Test
        @DisplayName("findWithFilters should delegate to repository")
        void findWithFilters_shouldDelegateToRepository() {
            // Arrange
            String name = "John";
            String email = "john@example.com";
            String cpf = "12345678901";
            List<Adopter> adopters = List.of(testAdopter);
            Page<Adopter> expectedPage = new PageImpl<>(adopters, testPageable, 1);
            
            when(adopterRepository.findWithFilters(name, email, cpf, testPageable))
                    .thenReturn(expectedPage);

            // Act
            Page<Adopter> result = adopterService.findWithFilters(name, email, cpf, testPageable);

            // Assert
            assertThat(result).isEqualTo(expectedPage);
            verify(adopterRepository).findWithFilters(name, email, cpf, testPageable);
        }
    }

    @Nested
    @DisplayName("Input Validation Tests")
    class InputValidationTests {

        @Test
        @DisplayName("should throw exception when required parameters are null")
        void shouldThrowException_whenRequiredParametersAreNull() {
            assertThatThrownBy(() -> adopterService.findAll(null))
                    .isInstanceOf(NullPointerException.class);
            
            assertThatThrownBy(() -> adopterService.findByEmailContaining("test", null))
                    .isInstanceOf(NullPointerException.class);
            
            assertThatThrownBy(() -> adopterService.findWithFilters("test", "test", "test", null))
                    .isInstanceOf(NullPointerException.class);
        }
    }
}
