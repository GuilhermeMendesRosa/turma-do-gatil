package br.com.udesc.turma_do_gatil_back.dto;

import br.com.udesc.turma_do_gatil_back.enums.SterilizationStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public class SterilizationDto {
    private UUID id;
    private UUID catId;
    private LocalDateTime sterilizationDate;
    private SterilizationStatus status;
    private String notes;

    // Constructors
    public SterilizationDto() {}

    public SterilizationDto(UUID id, UUID catId, LocalDateTime sterilizationDate,
                           SterilizationStatus status, String notes) {
        this.id = id;
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
}
