package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.entities.Note;
import br.com.udesc.turma_do_gatil_back.exceptions.NoteNotFoundException;
import br.com.udesc.turma_do_gatil_back.repositories.NoteRepository;
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
@DisplayName("NoteService Tests")
class NoteServiceTest {

    @Mock
    private NoteRepository noteRepository;

    @InjectMocks
    private NoteService noteService;

    private final UUID noteId = UUID.randomUUID();
    private final UUID catId = UUID.randomUUID();
    private final LocalDateTime testDate = LocalDateTime.now();

    private Note createTestNote() {
        Note note = new Note();
        note.setId(noteId);
        note.setCatId(catId);
        note.setDate(testDate);
        note.setText("Test note text");
        return note;
    }

    @Nested
    @DisplayName("Find All Operations")
    class FindAllTests {

        @Test
        @DisplayName("Should return page of notes when valid pageable provided")
        void findAll_validPageable_returnsPage() {
            Pageable pageable = PageRequest.of(0, 10);
            Note note = createTestNote();
            Page<Note> expectedPage = new PageImpl<>(List.of(note), pageable, 1);
            
            when(noteRepository.findAll(pageable)).thenReturn(expectedPage);

            Page<Note> result = noteService.findAll(pageable);

            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0)).isEqualTo(note);
            verify(noteRepository).findAll(pageable);
        }

        @Test
        @DisplayName("Should throw exception when pageable is null")
        void findAll_nullPageable_throwsException() {
            assertThatThrownBy(() -> noteService.findAll(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Pageable cannot be null");

            verifyNoInteractions(noteRepository);
        }
    }

    @Nested
    @DisplayName("Find By ID Operations")
    class FindByIdTests {

        @Test
        @DisplayName("Should return note when id exists")
        void findById_existingId_returnsNote() {
            Note note = createTestNote();
            when(noteRepository.findById(noteId)).thenReturn(Optional.of(note));

            Optional<Note> result = noteService.findById(noteId);

            assertThat(result).isPresent();
            assertThat(result.get()).isEqualTo(note);
            verify(noteRepository).findById(noteId);
        }

        @Test
        @DisplayName("Should return empty when id does not exist")
        void findById_nonExistingId_returnsEmpty() {
            when(noteRepository.findById(noteId)).thenReturn(Optional.empty());

            Optional<Note> result = noteService.findById(noteId);

            assertThat(result).isEmpty();
            verify(noteRepository).findById(noteId);
        }

        @Test
        @DisplayName("Should throw exception when id is null")
        void findById_nullId_throwsException() {
            assertThatThrownBy(() -> noteService.findById(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("ID cannot be null");

            verifyNoInteractions(noteRepository);
        }
    }

    @Nested
    @DisplayName("Save Operations")
    class SaveTests {

        @Test
        @DisplayName("Should save note when valid note provided")
        void save_validNote_returnsNote() {
            Note note = createTestNote();
            note.setId(null);
            Note savedNote = createTestNote();
            
            when(noteRepository.save(note)).thenReturn(savedNote);

            Note result = noteService.save(note);

            assertThat(result).isEqualTo(savedNote);
            verify(noteRepository).save(note);
        }

        @Test
        @DisplayName("Should throw exception when note is null")
        void save_nullNote_throwsException() {
            assertThatThrownBy(() -> noteService.save(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Note cannot be null");

            verifyNoInteractions(noteRepository);
        }

        @Test
        @DisplayName("Should throw exception when cat id is null")
        void save_nullCatId_throwsException() {
            Note note = createTestNote();
            note.setCatId(null);

            assertThatThrownBy(() -> noteService.save(note))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Cat ID cannot be null");

            verifyNoInteractions(noteRepository);
        }

        @Test
        @DisplayName("Should throw exception when text is empty")
        void save_emptyText_throwsException() {
            Note note = createTestNote();
            note.setText("");

            assertThatThrownBy(() -> noteService.save(note))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Note text cannot be null or empty");

            verifyNoInteractions(noteRepository);
        }

        @Test
        @DisplayName("Should throw exception when text exceeds limit")
        void save_textTooLong_throwsException() {
            Note note = createTestNote();
            note.setText("a".repeat(5001));

            assertThatThrownBy(() -> noteService.save(note))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Note text cannot exceed 5000 characters");

            verifyNoInteractions(noteRepository);
        }
    }

    @Nested
    @DisplayName("Update Operations")
    class UpdateTests {

        @Test
        @DisplayName("Should update note when id exists")
        void update_existingId_updatesNote() {
            Note note = createTestNote();
            note.setId(null);
            Note updatedNote = createTestNote();
            
            when(noteRepository.existsById(noteId)).thenReturn(true);
            when(noteRepository.save(any(Note.class))).thenReturn(updatedNote);

            Note result = noteService.update(noteId, note);

            assertThat(result).isEqualTo(updatedNote);
            assertThat(note.getId()).isEqualTo(noteId);
            verify(noteRepository).existsById(noteId);
            verify(noteRepository).save(note);
        }

        @Test
        @DisplayName("Should throw exception when id does not exist")
        void update_nonExistingId_throwsException() {
            Note note = createTestNote();
            
            when(noteRepository.existsById(noteId)).thenReturn(false);

            assertThatThrownBy(() -> noteService.update(noteId, note))
                    .isInstanceOf(NoteNotFoundException.class)
                    .hasMessage("Note not found with id: " + noteId);

            verify(noteRepository).existsById(noteId);
            verify(noteRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Delete Operations")
    class DeleteTests {

        @Test
        @DisplayName("Should delete note when id exists")
        void deleteById_existingId_deletesNote() {
            when(noteRepository.existsById(noteId)).thenReturn(true);

            noteService.deleteById(noteId);

            verify(noteRepository).existsById(noteId);
            verify(noteRepository).deleteById(noteId);
        }

        @Test
        @DisplayName("Should throw exception when id does not exist")
        void deleteById_nonExistingId_throwsException() {
            when(noteRepository.existsById(noteId)).thenReturn(false);

            assertThatThrownBy(() -> noteService.deleteById(noteId))
                    .isInstanceOf(NoteNotFoundException.class)
                    .hasMessage("Note not found with id: " + noteId);

            verify(noteRepository).existsById(noteId);
            verify(noteRepository, never()).deleteById(any());
        }
    }

    @Nested
    @DisplayName("Find By Cat ID Operations")
    class FindByCatIdTests {

        @Test
        @DisplayName("Should return notes for cat when valid cat id provided")
        void findByCatId_validCatId_returnsNotes() {
            Pageable pageable = PageRequest.of(0, 10);
            Note note = createTestNote();
            Page<Note> expectedPage = new PageImpl<>(List.of(note), pageable, 1);
            
            when(noteRepository.findByCatId(catId, pageable)).thenReturn(expectedPage);

            Page<Note> result = noteService.findByCatId(catId, pageable);

            assertThat(result).isEqualTo(expectedPage);
            verify(noteRepository).findByCatId(catId, pageable);
        }

        @Test
        @DisplayName("Should throw exception when cat id is null")
        void findByCatId_nullCatId_throwsException() {
            Pageable pageable = PageRequest.of(0, 10);

            assertThatThrownBy(() -> noteService.findByCatId(null, pageable))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Cat ID cannot be null");

            verifyNoInteractions(noteRepository);
        }
    }

    @Nested
    @DisplayName("Date Range Operations")
    class DateRangeTests {

        @Test
        @DisplayName("Should return notes in date range when valid dates provided")
        void findByDateRange_validDates_returnsNotes() {
            Pageable pageable = PageRequest.of(0, 10);
            LocalDateTime startDate = testDate.minusDays(1);
            LocalDateTime endDate = testDate.plusDays(1);
            Note note = createTestNote();
            Page<Note> expectedPage = new PageImpl<>(List.of(note), pageable, 1);
            
            when(noteRepository.findByDateBetween(startDate, endDate, pageable)).thenReturn(expectedPage);

            Page<Note> result = noteService.findByDateRange(startDate, endDate, pageable);

            assertThat(result).isEqualTo(expectedPage);
            verify(noteRepository).findByDateBetween(startDate, endDate, pageable);
        }

        @Test
        @DisplayName("Should throw exception when end date is before start date")
        void findByDateRange_endBeforeStart_throwsException() {
            Pageable pageable = PageRequest.of(0, 10);
            LocalDateTime startDate = testDate.plusDays(1);
            LocalDateTime endDate = testDate.minusDays(1);

            assertThatThrownBy(() -> noteService.findByDateRange(startDate, endDate, pageable))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("End date cannot be before start date");

            verifyNoInteractions(noteRepository);
        }
    }

    @Nested
    @DisplayName("Text Search Operations")
    class TextSearchTests {

        @Test
        @DisplayName("Should return notes containing text when valid text provided")
        void findByTextContaining_validText_returnsNotes() {
            Pageable pageable = PageRequest.of(0, 10);
            String searchText = "test";
            Note note = createTestNote();
            Page<Note> expectedPage = new PageImpl<>(List.of(note), pageable, 1);
            
            when(noteRepository.findByTextContainingIgnoreCase(searchText, pageable)).thenReturn(expectedPage);

            Page<Note> result = noteService.findByTextContaining(searchText, pageable);

            assertThat(result).isEqualTo(expectedPage);
            verify(noteRepository).findByTextContainingIgnoreCase(searchText, pageable);
        }

        @Test
        @DisplayName("Should throw exception when text is null")
        void findByTextContaining_nullText_throwsException() {
            Pageable pageable = PageRequest.of(0, 10);

            assertThatThrownBy(() -> noteService.findByTextContaining(null, pageable))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Text cannot be null");

            verifyNoInteractions(noteRepository);
        }
    }

    @Nested
    @DisplayName("Filter Operations")
    class FilterTests {

        @Test
        @DisplayName("Should return filtered notes when valid filters provided")
        void findWithFilters_validFilters_returnsNotes() {
            Pageable pageable = PageRequest.of(0, 10);
            String text = "test";
            LocalDateTime startDate = testDate.minusDays(1);
            LocalDateTime endDate = testDate.plusDays(1);
            Note note = createTestNote();
            Page<Note> expectedPage = new PageImpl<>(List.of(note), pageable, 1);
            
            when(noteRepository.findWithFilters(catId, text, startDate, endDate, pageable))
                    .thenReturn(expectedPage);

            Page<Note> result = noteService.findWithFilters(catId, text, startDate, endDate, pageable);

            assertThat(result).isEqualTo(expectedPage);
            verify(noteRepository).findWithFilters(catId, text, startDate, endDate, pageable);
        }

        @Test
        @DisplayName("Should throw exception when date range is invalid")
        void findWithFilters_invalidDateRange_throwsException() {
            Pageable pageable = PageRequest.of(0, 10);
            LocalDateTime startDate = testDate.plusDays(1);
            LocalDateTime endDate = testDate.minusDays(1);

            assertThatThrownBy(() -> noteService.findWithFilters(catId, null, startDate, endDate, pageable))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("End date cannot be before start date");

            verifyNoInteractions(noteRepository);
        }
    }
}
