package br.com.udesc.turma_do_gatil_back.repositories;

import br.com.udesc.turma_do_gatil_back.entities.Sterilization;
import br.com.udesc.turma_do_gatil_back.enums.SterilizationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface SterilizationRepositoryCustom {
    
    Page<Sterilization> findAllWithCat(Pageable pageable);
    
    Optional<Sterilization> findByIdWithCat(UUID id);
    
    Page<Sterilization> findByCatIdWithCat(UUID catId, Pageable pageable);
    
    Page<Sterilization> findByStatusWithCat(SterilizationStatus status, Pageable pageable);
    
    Page<Sterilization> findBySterilizationDateBetweenWithCat(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    Page<Sterilization> findWithFilters(UUID catId, SterilizationStatus status, 
                                       LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    // Métodos que eram usados diretamente pelos services
    Page<Sterilization> findByCatId(UUID catId, Pageable pageable);
    
    Page<Sterilization> findByStatus(SterilizationStatus status, Pageable pageable);
    
    Page<Sterilization> findBySterilizationDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    long countByStatus(SterilizationStatus status);
}
