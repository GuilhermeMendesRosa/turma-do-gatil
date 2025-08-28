package br.com.udesc.turma_do_gatil_back.repositories;

import br.com.udesc.turma_do_gatil_back.entities.Sterilization;
import br.com.udesc.turma_do_gatil_back.enums.SterilizationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface SterilizationRepository extends JpaRepository<Sterilization, UUID> {

    Page<Sterilization> findByCatId(UUID catId, Pageable pageable);

    Page<Sterilization> findByStatus(SterilizationStatus status, Pageable pageable);

    Page<Sterilization> findBySterilizationDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    @Query("SELECT s FROM Sterilization s WHERE " +
           "(:catId IS NULL OR s.catId = :catId) AND " +
           "(:status IS NULL OR s.status = :status) AND " +
           "(:startDate IS NULL OR s.sterilizationDate >= :startDate) AND " +
           "(:endDate IS NULL OR s.sterilizationDate <= :endDate)")
    Page<Sterilization> findWithFilters(@Param("catId") UUID catId,
                                       @Param("status") SterilizationStatus status,
                                       @Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate,
                                       Pageable pageable);
}
