package br.com.udesc.turma_do_gatil_back.repositories;

import br.com.udesc.turma_do_gatil_back.entities.Adopter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdopterRepositoryCustom {
    
    Page<Adopter> findWithFilters(String name, String email, String cpf, Pageable pageable);
    
    Page<Adopter> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName, Pageable pageable);
    
    Page<Adopter> findByEmailContainingIgnoreCase(String email, Pageable pageable);
}
