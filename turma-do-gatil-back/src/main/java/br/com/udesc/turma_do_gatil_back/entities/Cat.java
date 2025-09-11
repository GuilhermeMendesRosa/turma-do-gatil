package br.com.udesc.turma_do_gatil_back.entities;

import br.com.udesc.turma_do_gatil_back.enums.CatAdoptionStatus;
import br.com.udesc.turma_do_gatil_back.enums.Color;
import br.com.udesc.turma_do_gatil_back.enums.Sex;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "cats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cat {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Color color;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Sex sex;

    @Column(name = "birth_date", nullable = false)
    private LocalDateTime birthDate;

    @Column(name = "shelter_entry_date", nullable = false)
    private LocalDateTime shelterEntryDate;

    @Column(name = "photo_url", columnDefinition = "VARCHAR(500)")
    private String photoUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "adoption_status", nullable = false)
    private CatAdoptionStatus adoptionStatus = CatAdoptionStatus.NAO_ADOTADO;

    @OneToMany(mappedBy = "cat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Note> notes;

    @OneToMany(mappedBy = "cat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Sterilization> sterilizations;

    @OneToMany(mappedBy = "cat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Adoption> adoptions;
}
