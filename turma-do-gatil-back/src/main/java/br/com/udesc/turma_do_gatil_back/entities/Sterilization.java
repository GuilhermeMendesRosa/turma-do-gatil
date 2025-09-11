package br.com.udesc.turma_do_gatil_back.entities;

import br.com.udesc.turma_do_gatil_back.enums.SterilizationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sterilizations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sterilization {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "cat_id", nullable = false)
    private UUID catId;

    @Column(name = "sterilization_date", nullable = false)
    private LocalDateTime sterilizationDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SterilizationStatus status;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cat_id", insertable = false, updatable = false)
    private Cat cat;
}
