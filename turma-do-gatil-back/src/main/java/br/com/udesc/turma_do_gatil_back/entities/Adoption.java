package br.com.udesc.turma_do_gatil_back.entities;

import br.com.udesc.turma_do_gatil_back.enums.AdoptionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "adoptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE adoptions SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Adoption extends BaseAuditableEntity {

    @Column(name = "cat_id", nullable = false)
    private UUID catId;

    @Column(name = "adopter_id", nullable = false)
    private UUID adopterId;

    @Column(name = "adoption_date", nullable = false)
    private LocalDateTime adoptionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdoptionStatus status;

    @Column(name = "adoption_term_photo")
    private String adoptionTermPhoto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cat_id", insertable = false, updatable = false)
    private Cat cat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adopter_id", insertable = false, updatable = false)
    private Adopter adopter;
}
