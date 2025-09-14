package br.com.udesc.turma_do_gatil_back.repositories;

import br.com.udesc.turma_do_gatil_back.entities.Cat;
import br.com.udesc.turma_do_gatil_back.enums.CatAdoptionStatus;
import br.com.udesc.turma_do_gatil_back.enums.Color;
import br.com.udesc.turma_do_gatil_back.enums.Sex;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CatRepositoryCustom {
    
    Page<Cat> findWithFilters(String name, Color color, Sex sex, CatAdoptionStatus adoptionStatus, Pageable pageable);
    
    Page<Cat> findByAdoptionStatus(CatAdoptionStatus adoptionStatus, Pageable pageable);
    
    List<Cat> findByAdoptionStatusList(CatAdoptionStatus adoptionStatus);
    
    Page<Cat> findByColor(Color color, Pageable pageable);
    
    Page<Cat> findBySex(Sex sex, Pageable pageable);
    
    Page<Cat> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    long countByAdoptionStatus(CatAdoptionStatus adoptionStatus);
}
