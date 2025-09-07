package br.com.udesc.turma_do_gatil_back.repositories;

import br.com.udesc.turma_do_gatil_back.entities.Cat;
import br.com.udesc.turma_do_gatil_back.enums.CatAdoptionStatus;
import br.com.udesc.turma_do_gatil_back.enums.Color;
import br.com.udesc.turma_do_gatil_back.enums.Sex;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CatRepository extends JpaRepository<Cat, UUID> {

    // Métodos para o status de adoção
    Page<Cat> findByAdoptionStatus(CatAdoptionStatus adoptionStatus, Pageable pageable);

    List<Cat> findByAdoptionStatus(CatAdoptionStatus adoptionStatus);

    Page<Cat> findByColor(Color color, Pageable pageable);

    Page<Cat> findBySex(Sex sex, Pageable pageable);

    Page<Cat> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Query JPQL para filtros
    @Query("SELECT c FROM Cat c WHERE " +
           "(:name IS NULL OR :name = '' OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:color IS NULL OR c.color = :color) AND " +
           "(:sex IS NULL OR c.sex = :sex) AND " +
           "(:adoptionStatus IS NULL OR c.adoptionStatus = :adoptionStatus) " +
           "ORDER BY c.name")
    Page<Cat> findWithFilters(@Param("name") String name,
                             @Param("color") Color color,
                             @Param("sex") Sex sex,
                             @Param("adoptionStatus") CatAdoptionStatus adoptionStatus,
                             Pageable pageable);

    @Query(value = "SELECT * FROM cats c WHERE " +
           "(:name IS NULL OR :name = '' OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:color IS NULL OR c.color = :color) AND " +
           "(:sex IS NULL OR c.sex = :sex) AND " +
           "(:adoptionStatus IS NULL OR c.adoption_status = :adoptionStatus)" +
           " ORDER BY c.name", 
           countQuery = "SELECT COUNT(*) FROM cats c WHERE " +
           "(:name IS NULL OR :name = '' OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:color IS NULL OR c.color = :color) AND " +
           "(:sex IS NULL OR c.sex = :sex) AND " +
           "(:adoptionStatus IS NULL OR c.adoption_status = :adoptionStatus)",
           nativeQuery = true)
    Page<Cat> findWithFiltersJPQL(@Param("name") String name,
                                  @Param("color") String color,
                                  @Param("sex") String sex,
                                  @Param("adoptionStatus") String adoptionStatus,
                                  Pageable pageable);

    @Query("SELECT c FROM Cat c WHERE c.adoptionStatus = :adoptionStatus")
    List<Cat> findByAdoptionStatusList(@Param("adoptionStatus") CatAdoptionStatus adoptionStatus);
}
