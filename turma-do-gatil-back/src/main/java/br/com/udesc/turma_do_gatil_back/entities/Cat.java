package br.com.udesc.turma_do_gatil_back.entities;

import br.com.udesc.turma_do_gatil_back.enums.CatAdoptionStatus;
import br.com.udesc.turma_do_gatil_back.enums.Color;
import br.com.udesc.turma_do_gatil_back.enums.Sex;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "cats")
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

    // Constructors
    public Cat() {}

    public Cat(String name, Color color, Sex sex, LocalDateTime birthDate, LocalDateTime shelterEntryDate, String photoUrl) {
        this.name = name;
        this.color = color;
        this.sex = sex;
        this.birthDate = birthDate;
        this.shelterEntryDate = shelterEntryDate;
        this.photoUrl = photoUrl;
        this.adoptionStatus = CatAdoptionStatus.NAO_ADOTADO;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public Sex getSex() {
        return sex;
    }

    public void setSex(Sex sex) {
        this.sex = sex;
    }

    public LocalDateTime getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDateTime birthDate) {
        this.birthDate = birthDate;
    }

    public LocalDateTime getShelterEntryDate() {
        return shelterEntryDate;
    }

    public void setShelterEntryDate(LocalDateTime shelterEntryDate) {
        this.shelterEntryDate = shelterEntryDate;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public CatAdoptionStatus getAdoptionStatus() {
        return adoptionStatus;
    }

    public void setAdoptionStatus(CatAdoptionStatus adoptionStatus) {
        this.adoptionStatus = adoptionStatus;
    }

    public List<Note> getNotes() {
        return notes;
    }

    public void setNotes(List<Note> notes) {
        this.notes = notes;
    }

    public List<Sterilization> getSterilizations() {
        return sterilizations;
    }

    public void setSterilizations(List<Sterilization> sterilizations) {
        this.sterilizations = sterilizations;
    }

    public List<Adoption> getAdoptions() {
        return adoptions;
    }

    public void setAdoptions(List<Adoption> adoptions) {
        this.adoptions = adoptions;
    }
}
