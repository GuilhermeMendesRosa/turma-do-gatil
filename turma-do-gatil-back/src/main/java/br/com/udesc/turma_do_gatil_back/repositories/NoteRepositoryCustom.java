package br.com.udesc.turma_do_gatil_back.repositories;

import br.com.udesc.turma_do_gatil_back.entities.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.UUID;

public interface NoteRepositoryCustom {
    
    Page<Note> findWithFilters(UUID catId, String text, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    Page<Note> findByCatId(UUID catId, Pageable pageable);
    
    Page<Note> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    Page<Note> findByTextContainingIgnoreCase(String text, Pageable pageable);
}
