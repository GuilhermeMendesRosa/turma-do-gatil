package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.entities.Note;
import br.com.udesc.turma_do_gatil_back.exceptions.NoteNotFoundException;
import br.com.udesc.turma_do_gatil_back.repositories.NoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final SecurityService securityService;

    public Page<Note> findAll(Pageable pageable) {
        Objects.requireNonNull(pageable, "Pageable cannot be null");
        log.debug("Finding all notes with pageable: {}", pageable);
        return noteRepository.findAll(pageable);
    }

    public Optional<Note> findById(UUID id) {
        Objects.requireNonNull(id, "ID cannot be null");
        log.debug("Finding note by id: {}", id);
        return noteRepository.findById(id);
    }

    public Note save(Note note) {
        Objects.requireNonNull(note, "Note cannot be null");
        validateNote(note);

        log.info("Saving new note for cat: {}", note.getCatId());
        Note savedNote = noteRepository.save(note);
        log.debug("Note saved with id: {}", savedNote.getId());
        return savedNote;
    }

    public Note update(UUID id, Note note) {
        Objects.requireNonNull(id, "ID cannot be null");
        Objects.requireNonNull(note, "Note cannot be null");
        validateNote(note);

        log.info("Updating note with id: {}", id);

        if (!existsById(id)) {
            throw new NoteNotFoundException(id);
        }

        note.setId(id);
        Note updatedNote = noteRepository.save(note);
        log.debug("Note updated successfully: {}", id);
        return updatedNote;
    }

    public void deleteById(UUID id) {
        Objects.requireNonNull(id, "ID cannot be null");
        log.info("Deleting note with id: {}", id);

        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new NoteNotFoundException(id));

        note.setDeletedBy(securityService.getCurrentUsername());
        noteRepository.delete(note);
        log.debug("Note soft deleted successfully: {}", id);
    }

    public Page<Note> findByCatId(UUID catId, Pageable pageable) {
        Objects.requireNonNull(catId, "Cat ID cannot be null");
        Objects.requireNonNull(pageable, "Pageable cannot be null");
        log.debug("Finding notes by cat id: {}", catId);
        return noteRepository.findByCatId(catId, pageable);
    }

    public Page<Note> findByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        Objects.requireNonNull(startDate, "Start date cannot be null");
        Objects.requireNonNull(endDate, "End date cannot be null");
        Objects.requireNonNull(pageable, "Pageable cannot be null");

        validateDateRange(startDate, endDate);
        log.debug("Finding notes by date range: {} to {}", startDate, endDate);
        return noteRepository.findByDateBetween(startDate, endDate, pageable);
    }

    public Page<Note> findByTextContaining(String text, Pageable pageable) {
        Objects.requireNonNull(text, "Text cannot be null");
        Objects.requireNonNull(pageable, "Pageable cannot be null");
        log.debug("Finding notes containing text: {}", text);
        return noteRepository.findByTextContainingIgnoreCase(text, pageable);
    }

    public Page<Note> findWithFilters(UUID catId, String text, LocalDateTime startDate,
                                      LocalDateTime endDate, Pageable pageable) {
        Objects.requireNonNull(pageable, "Pageable cannot be null");

        if (startDate != null && endDate != null) {
            validateDateRange(startDate, endDate);
        }

        log.debug("Finding notes with filters - catId: {}, text: {}, dateRange: {} to {}",
                catId, text, startDate, endDate);
        return noteRepository.findWithFilters(catId, text, startDate, endDate, pageable);
    }

    private boolean existsById(UUID id) {
        return noteRepository.existsById(id);
    }

    private void validateNote(Note note) {
        Objects.requireNonNull(note.getCatId(), "Cat ID cannot be null");
        Objects.requireNonNull(note.getDate(), "Date cannot be null");

        if (!StringUtils.hasText(note.getText())) {
            throw new IllegalArgumentException("Note text cannot be null or empty");
        }

        if (note.getText().trim().length() > 5000) {
            throw new IllegalArgumentException("Note text cannot exceed 5000 characters");
        }
    }

    private void validateDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }
    }
}
