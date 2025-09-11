package br.com.udesc.turma_do_gatil_back.repositories;

import br.com.udesc.turma_do_gatil_back.entities.Adopter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdopterRepository extends JpaRepository<Adopter, UUID>, AdopterRepositoryCustom {

    Optional<Adopter> findByCpf(String cpf);

    Optional<Adopter> findByEmail(String email);
}
