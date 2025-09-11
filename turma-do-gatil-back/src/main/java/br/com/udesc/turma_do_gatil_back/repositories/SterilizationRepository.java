package br.com.udesc.turma_do_gatil_back.repositories;

import br.com.udesc.turma_do_gatil_back.entities.Sterilization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SterilizationRepository extends JpaRepository<Sterilization, UUID>, SterilizationRepositoryCustom {
    
    @Override
    default Page<Sterilization> findAll(Pageable pageable) {
        return findAllWithCat(pageable);
    }

    @Override  
    default Optional<Sterilization> findById(UUID id) {
        return findByIdWithCat(id);
    }
}
