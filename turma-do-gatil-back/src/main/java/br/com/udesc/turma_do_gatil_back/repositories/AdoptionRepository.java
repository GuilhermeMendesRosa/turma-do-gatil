package br.com.udesc.turma_do_gatil_back.repositories;

import br.com.udesc.turma_do_gatil_back.entities.Adoption;
import br.com.udesc.turma_do_gatil_back.enums.AdoptionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AdoptionRepository extends JpaRepository<Adoption, UUID> {

    Page<Adoption> findByStatus(AdoptionStatus status, Pageable pageable);

    Page<Adoption> findByCatId(UUID catId, Pageable pageable);

    Page<Adoption> findByAdopterId(UUID adopterId, Pageable pageable);

    Page<Adoption> findByAdoptionDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    List<Adoption> findByCatIdAndStatus(UUID catId, AdoptionStatus status);

    @Query("SELECT a FROM Adoption a WHERE " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:catId IS NULL OR a.catId = :catId) AND " +
           "(:adopterId IS NULL OR a.adopterId = :adopterId) AND " +
           "(:startDate IS NULL OR a.adoptionDate >= :startDate) AND " +
           "(:endDate IS NULL OR a.adoptionDate <= :endDate)")
    Page<Adoption> findWithFilters(@Param("status") AdoptionStatus status,
                                  @Param("catId") UUID catId,
                                  @Param("adopterId") UUID adopterId,
                                  @Param("startDate") LocalDateTime startDate,
                                  @Param("endDate") LocalDateTime endDate,
                                  Pageable pageable);
}
