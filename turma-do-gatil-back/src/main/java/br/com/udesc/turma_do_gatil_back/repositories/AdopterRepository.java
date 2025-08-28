package br.com.udesc.turma_do_gatil_back.repositories;

import br.com.udesc.turma_do_gatil_back.entities.Adopter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdopterRepository extends JpaRepository<Adopter, UUID> {

    Optional<Adopter> findByCpf(String cpf);

    Optional<Adopter> findByEmail(String email);

    Page<Adopter> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String firstName, String lastName, Pageable pageable);

    Page<Adopter> findByEmailContainingIgnoreCase(String email, Pageable pageable);

    @Query("SELECT a FROM Adopter a WHERE " +
           "(:name IS NULL OR LOWER(CONCAT(a.firstName, ' ', a.lastName)) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:email IS NULL OR LOWER(a.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
           "(:cpf IS NULL OR a.cpf LIKE CONCAT('%', :cpf, '%'))")
    Page<Adopter> findWithFilters(@Param("name") String name,
                                 @Param("email") String email,
                                 @Param("cpf") String cpf,
                                 Pageable pageable);
}
