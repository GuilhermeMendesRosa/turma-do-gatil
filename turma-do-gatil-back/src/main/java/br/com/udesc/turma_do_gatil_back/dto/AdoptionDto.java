package br.com.udesc.turma_do_gatil_back.dto;

import br.com.udesc.turma_do_gatil_back.enums.AdoptionStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public class AdoptionDto {
    private UUID id;
    private UUID catId;
    private UUID adopterId;
    private LocalDateTime adoptionDate;
    private AdoptionStatus status;
    private CatDto cat;
    private AdopterDto adopter;

    // Constructors
    public AdoptionDto() {}

    public AdoptionDto(UUID id, UUID catId, UUID adopterId, LocalDateTime adoptionDate, AdoptionStatus status) {
        this.id = id;
        this.catId = catId;
        this.adopterId = adopterId;
        this.adoptionDate = adoptionDate;
        this.status = status;
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

    public UUID getAdopterId() {
        return adopterId;
    }

    public void setAdopterId(UUID adopterId) {
        this.adopterId = adopterId;
    }

    public LocalDateTime getAdoptionDate() {
        return adoptionDate;
    }

    public void setAdoptionDate(LocalDateTime adoptionDate) {
        this.adoptionDate = adoptionDate;
    }

    public AdoptionStatus getStatus() {
        return status;
    }

    public void setStatus(AdoptionStatus status) {
        this.status = status;
    }

    public CatDto getCat() {
        return cat;
    }

    public void setCat(CatDto cat) {
        this.cat = cat;
    }

    public AdopterDto getAdopter() {
        return adopter;
    }

    public void setAdopter(AdopterDto adopter) {
        this.adopter = adopter;
    }
}
