package br.com.udesc.turma_do_gatil_back.repositories;

import br.com.udesc.turma_do_gatil_back.entities.Adoption;
import br.com.udesc.turma_do_gatil_back.enums.AdoptionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface AdoptionRepositoryCustom {
    
    Page<Adoption> findWithFilters(AdoptionStatus status, UUID catId, UUID adopterId, 
                                  LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    Page<Adoption> findByStatus(AdoptionStatus status, Pageable pageable);
    
    Page<Adoption> findByCatId(UUID catId, Pageable pageable);
    
    Page<Adoption> findByAdopterId(UUID adopterId, Pageable pageable);
    
    Page<Adoption> findByAdoptionDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    List<Adoption> findByCatIdAndStatus(UUID catId, AdoptionStatus status);
}
