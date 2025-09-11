package br.com.udesc.turma_do_gatil_back.entities;

import br.com.udesc.turma_do_gatil_back.enums.AdoptionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "adoptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Adoption {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "cat_id", nullable = false)
    private UUID catId;

    @Column(name = "adopter_id", nullable = false)
    private UUID adopterId;

    @Column(name = "adoption_date", nullable = false)
    private LocalDateTime adoptionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdoptionStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cat_id", insertable = false, updatable = false)
    private Cat cat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adopter_id", insertable = false, updatable = false)
    private Adopter adopter;
}
