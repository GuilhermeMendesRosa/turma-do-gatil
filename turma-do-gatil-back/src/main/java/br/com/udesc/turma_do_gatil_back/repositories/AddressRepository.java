package br.com.udesc.turma_do_gatil_back.repositories;

import br.com.udesc.turma_do_gatil_back.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AddressRepository extends JpaRepository<Address, UUID> {

    Optional<Address> findByAdopterId(UUID adopterId);
}
