package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.entities.Note;
import br.com.udesc.turma_do_gatil_back.repositories.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    public Page<Note> findAll(Pageable pageable) {
        return noteRepository.findAll(pageable);
    }

    public Optional<Note> findById(UUID id) {
        return noteRepository.findById(id);
    }

    public Note save(Note note) {
        return noteRepository.save(note);
    }

    public Note update(UUID id, Note note) {
        if (!noteRepository.existsById(id)) {
            throw new RuntimeException("Note not found with id: " + id);
        }
        note.setId(id);
        return noteRepository.save(note);
    }

    public void deleteById(UUID id) {
        if (!noteRepository.existsById(id)) {
            throw new RuntimeException("Note not found with id: " + id);
        }
        noteRepository.deleteById(id);
    }

    public Page<Note> findByCatId(UUID catId, Pageable pageable) {
        return noteRepository.findByCatId(catId, pageable);
    }

    public Page<Note> findByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return noteRepository.findByDateBetween(startDate, endDate, pageable);
    }

    public Page<Note> findByTextContaining(String text, Pageable pageable) {
        return noteRepository.findByTextContainingIgnoreCase(text, pageable);
    }

    public Page<Note> findWithFilters(UUID catId, String text, LocalDateTime startDate,
                                     LocalDateTime endDate, Pageable pageable) {
        return noteRepository.findWithFilters(catId, text, startDate, endDate, pageable);
    }
}
