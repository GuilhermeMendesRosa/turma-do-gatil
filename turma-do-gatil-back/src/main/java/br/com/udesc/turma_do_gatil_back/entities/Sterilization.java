package br.com.udesc.turma_do_gatil_back.entities;

import br.com.udesc.turma_do_gatil_back.enums.SterilizationStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sterilizations")
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

    // Constructors
    public Sterilization() {}

    public Sterilization(UUID catId, LocalDateTime sterilizationDate, SterilizationStatus status, String notes) {
        this.catId = catId;
        this.sterilizationDate = sterilizationDate;
        this.status = status;
        this.notes = notes;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getCatId() {
        return catId;
    }

    public void setCatId(UUID catId) {
        this.catId = catId;
    }

    public LocalDateTime getSterilizationDate() {
        return sterilizationDate;
    }

    public void setSterilizationDate(LocalDateTime sterilizationDate) {
        this.sterilizationDate = sterilizationDate;
    }

    public SterilizationStatus getStatus() {
        return status;
    }

    public void setStatus(SterilizationStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Cat getCat() {
        return cat;
    }

    public void setCat(Cat cat) {
        this.cat = cat;
    }
}
