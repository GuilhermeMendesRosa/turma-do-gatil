package br.com.udesc.turma_do_gatil_back.repositories;

import br.com.udesc.turma_do_gatil_back.entities.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface NoteRepository extends JpaRepository<Note, UUID> {

    Page<Note> findByCatId(UUID catId, Pageable pageable);

    Page<Note> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    Page<Note> findByTextContainingIgnoreCase(String text, Pageable pageable);

    @Query("SELECT n FROM Note n WHERE " +
           "(:catId IS NULL OR n.catId = :catId) AND " +
           "(:text IS NULL OR LOWER(n.text) LIKE LOWER(CONCAT('%', :text, '%'))) AND " +
           "(:startDate IS NULL OR n.date >= :startDate) AND " +
           "(:endDate IS NULL OR n.date <= :endDate)")
    Page<Note> findWithFilters(@Param("catId") UUID catId,
                              @Param("text") String text,
                              @Param("startDate") LocalDateTime startDate,
                              @Param("endDate") LocalDateTime endDate,
                              Pageable pageable);
}
