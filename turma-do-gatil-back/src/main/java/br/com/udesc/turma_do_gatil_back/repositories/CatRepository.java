package br.com.udesc.turma_do_gatil_back.repositories;

import br.com.udesc.turma_do_gatil_back.entities.Cat;
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

    Page<Cat> findByAdopted(Boolean adopted, Pageable pageable);

    List<Cat> findByAdopted(Boolean adopted);

    Page<Cat> findByColor(Color color, Pageable pageable);

    Page<Cat> findBySex(Sex sex, Pageable pageable);

    Page<Cat> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query(value = "SELECT * FROM cats c WHERE " +
           "(:name IS NULL OR LOWER(c.name::text) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:color IS NULL OR c.color = :color) AND " +
           "(:sex IS NULL OR c.sex = :sex) AND " +
           "(:adopted IS NULL OR c.adopted = :adopted) " +
           "ORDER BY c.name",
           nativeQuery = true)
    Page<Cat> findWithFilters(@Param("name") String name,
                             @Param("color") String color,
                             @Param("sex") String sex,
                             @Param("adopted") Boolean adopted,
                             Pageable pageable);
}
